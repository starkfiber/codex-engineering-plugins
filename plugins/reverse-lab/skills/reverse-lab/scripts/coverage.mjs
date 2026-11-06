#!/usr/bin/env node
import fs from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const object=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const hash=v=>typeof v==='string'&&/^[a-f0-9]{64}$/.test(v);
const count=v=>Number.isSafeInteger(v)&&v>=0;
function requireValue(ok,message){if(!ok)throw Error(message);}
export function assessCoverage(input,gate='application') {
  requireValue(['application','semantic','runtime'].includes(gate),'Unknown gate; use application, semantic or runtime');
  let evidence=input;
  if(object(input)&&('result' in input||'jsonrpc' in input)){
    requireValue(!input.error&&object(input.result)&&input.result.isError!==true,'MCP response is an error or missing result');
    const result=input.result;
    if(object(result.structuredContent))evidence=result.structuredContent;
    else {
      requireValue(Array.isArray(result.content),'MCP response has no evidence content');
      const text=result.content.filter(c=>c?.type==='text');
      requireValue(text.length===1&&typeof text[0].text==='string','Expected one JSON evidence text item');
      evidence=JSON.parse(text[0].text);
    }
  }
  requireValue(object(evidence)&&typeof evidence.evidence_id==='string'&&evidence.evidence_id.length>0,'Unknown evidence schema');
  requireValue(object(evidence.subject)&&hash(evidence.subject.digest?.sha256)&&typeof evidence.subject.local_path==='string','Missing target identity');
  const n=evidence.normalized_result;
  requireValue(object(n),'Missing normalized_result');
  let stats,application,semantic,scope,view=null;
  if(evidence.operation==='analyze_javascript_application'){
    stats=n.statistics;application=n.graph?.coverage;semantic=n.semantic_graph?.coverage;
    requireValue(hash(n.root_artifact_sha256)&&n.root_artifact_sha256===evidence.subject.digest.sha256,'Target digest mismatch');
    scope={artifact:evidence.subject.local_path,sha256:n.root_artifact_sha256,sourceSelection:n.source_selection??evidence.parameters?.source_paths??null};
  }else if(evidence.operation==='inspect_analysis_view'){
    requireValue(n.kind==='summary'&&n.parent_operation==='analyze_javascript_application'&&object(n.summary),'Unsupported analysis view');
    stats=n.summary.statistics;application=n.summary.coverage?.application;semantic=n.summary.coverage?.semantic;
    requireValue(hash(n.artifact?.sha256)&&n.artifact.sha256===evidence.subject.digest.sha256,'Target digest mismatch');
    scope={artifact:n.artifact.path,sha256:n.artifact.sha256,sourceSelection:n.summary.source_selection??null};view=n.coverage?.status??null;
  }else throw Error('Unsupported evidence operation');
  requireValue(object(stats)&&['parsed_javascript_files','skipped_javascript_files','parse_failures','visited_ast_nodes'].every(k=>count(stats[k])),'Malformed or missing source statistics');
  for(const [label,c]of [['application',application],['semantic',semantic]]){
    requireValue(object(c)&&['complete','partial','unknown'].includes(c.status)&&typeof c.truncated==='boolean',`Malformed or missing ${label} coverage`);
  }
  requireValue(Array.isArray(semantic.families)&&semantic.families.every(f=>object(f)&&typeof f.family==='string'&&['complete','partial','unknown','not-applicable'].includes(f.status)),'Malformed semantic family coverage');
  const blockers=[];
  if(Array.isArray(n.integrity_contradictions)&&n.integrity_contradictions.length)blockers.push('Artifact integrity contradictions reported');
  if(application.omitted_count!==undefined&&application.omitted_count!==0)blockers.push('Application graph has omitted or unmeasured facts');
  if(stats.parsed_javascript_files===0)blockers.push('No JavaScript source was parsed');
  if(stats.skipped_javascript_files>0)blockers.push(`${stats.skipped_javascript_files} JavaScript sources skipped`);
  if(stats.parse_failures>0)blockers.push(`${stats.parse_failures} parse failures`);
  if(application.status!=='complete'||application.truncated)blockers.push('Application graph coverage is incomplete');
  if(gate==='semantic'&&(semantic.status!=='complete'||semantic.truncated||semantic.families?.some(f=>f.status!=='complete')))blockers.push('Semantic coverage is incomplete or unknown');
  if(gate==='runtime')blockers.push('Static REA evidence does not establish runtime behavior');
  const limitations=[...(Array.isArray(evidence.limitations)?evidence.limitations:[]),...(Array.isArray(n.limitations)?n.limitations:[])];
  return {schemaVersion:1,gate,passed:blockers.length===0,proofLevel:'static-artifact',scope,evidenceId:evidence.evidence_id,viewStatus:view,statistics:stats,coverage:{application:{status:application.status,truncated:application.truncated},semantic:{status:semantic.status,truncated:semantic.truncated}},blockers,limitations:[...new Set(limitations)],notice:'A passing application gate only establishes reported parsing and application-graph coverage for this exact artifact/selection. It does not establish semantic completeness, claim truth, runtime equivalence or full-app coverage.'};
}
async function cli(){
  const [file,gate='application',...extra]=process.argv.slice(2);requireValue(file&&!extra.length,'Usage: coverage.mjs <REA-evidence.json> [application|semantic|runtime]');
  const result=assessCoverage(JSON.parse(await fs.readFile(file,'utf8')),gate);console.log(JSON.stringify(result,null,2));if(!result.passed)process.exitCode=2;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)cli().catch(e=>{console.error(JSON.stringify({passed:false,error:e.message}));process.exitCode=1;});
