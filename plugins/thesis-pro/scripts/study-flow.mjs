import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import readline from 'node:readline';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';

const option = name => {const at=process.argv.indexOf(name);return at<0?undefined:process.argv[at+1];};
const root=path.resolve(option('--plugin-root')??fileURLToPath(new URL('../',import.meta.url)));
let workspace=path.resolve(option('--workspace')??fs.mkdtempSync(path.join(os.tmpdir(),'thesis-study-')));
if(fs.existsSync(workspace)){
 if(fs.lstatSync(workspace).isSymbolicLink()||!fs.statSync(workspace).isDirectory()||fs.readdirSync(workspace).length)throw Error('Use an empty, non-symlink demonstration workspace; existing research is refused.');
}else fs.mkdirSync(workspace,{recursive:true});
workspace=fs.realpathSync(workspace);
const verificationNote=option('--source-check-note')??'Synthetic verification-record demonstration only; no independent scholarly review is implied.';
const version=JSON.parse(fs.readFileSync(path.join(root,'.codex-plugin/plugin.json'),'utf8')).version;
const transcript=[];
function start(){
 const child=spawn('/bin/sh',[path.join(root,'scripts/launch-mcp.sh')],{env:{...process.env,THESIS_PRO_HOME:workspace},stdio:['pipe','pipe','pipe']});
 let next=1,stderr='';const pending=new Map();
 const fail=error=>{for(const p of pending.values()){clearTimeout(p.timer);p.reject(error);}pending.clear();};
 child.on('error',fail);child.on('exit',(code)=>fail(Error('Server exited '+code+' '+stderr)));
 child.stderr.on('data',data=>{stderr=(stderr+data).slice(-4000);});
 const lines=readline.createInterface({input:child.stdout});
 lines.on('line',line=>{try{const reply=JSON.parse(line),p=pending.get(reply.id);if(!p)return;clearTimeout(p.timer);pending.delete(reply.id);p.resolve(reply);}catch(error){fail(error);}});
 return {
  async request(method,params){
   const id=next++;
   const reply=await new Promise((resolve,reject)=>{const timer=setTimeout(()=>{pending.delete(id);reject(Error('MCP timeout: '+method));},10000);pending.set(id,{resolve,reject,timer});child.stdin.write(JSON.stringify({jsonrpc:'2.0',id,method,params})+'\n');});
   transcript.push({method,tool:params?.name,requestId:id,result:reply.result,error:reply.error});
   return reply;
  },
  async tool(name,args){const reply=await this.request('tools/call',{name,arguments:args});assert(!reply.error,JSON.stringify(reply.error));assert(!reply.result?.isError);return reply.result.structuredContent;},
  async close(){child.stdin.end();await new Promise((resolve,reject)=>{if(child.exitCode!==null){resolve();return;}const timer=setTimeout(()=>{child.kill();reject(Error('Server shutdown timeout'));},5000);child.once('exit',code=>{clearTimeout(timer);code===0?resolve():reject(Error('Server exit '+code));});});lines.close();}
 };
}
async function initialize(client){
 const reply=await client.request('initialize',{protocolVersion:'2025-06-18'});
 assert.equal(reply.result.serverInfo.version,version);
 const discovery=await client.request('tools/list',{});assert.equal(discovery.result.tools.length,12);
}

let client=start();let result;
try{
 await initialize(client);
 const project=(await client.tool('create_project',{title:'Synthetic library catalogue accessibility proposal',degree:"Master's",target_words:5000,discipline:'Human-computer interaction'})).project;
 const project_id=project.id;
 assert.equal((await client.tool('list_projects',{})).projects.length,1);
 const initial=await client.tool('audit_project',{project_id});assert.equal(initial.passed,false);
 await client.tool('update_research_design',{project_id,fields:{
  problem:'Provisional: a library catalogue may have keyboard interaction barriers; no observed prevalence is claimed.',
  gap:'Provisional local evaluation question, not a claimed gap in all published literature.',
  aim:'Plan a repeatable keyboard-accessibility evaluation of a synthetic catalogue.',
  objectives:'Define tasks, observe keyboard operation, document barriers and propose testable repairs.',
  questions:'Can representative catalogue tasks be completed using only the keyboard?',
  methodology:'Proposal only: task-based interface evaluation; participant recruitment requires later ethics review and consent.',
  expected_contribution:'A proposed evaluation protocol; no empirical contribution is claimed yet.',
  ethics:'No participants, personal data or field results in this demonstration.'
 }});
 const source=(await client.tool('add_source',{project_id,citation:'World Wide Web Consortium. (2024). Web Content Accessibility Guidelines (WCAG) 2.2. Recommendation, 12 December 2024. Success Criterion 2.1.1.',url_or_doi:'https://www.w3.org/TR/2024/REC-WCAG22-20241212/#keyboard',type:'standard',verified:false})).source;
 const claim=(await client.tool('add_claim',{project_id,claim:'WCAG 2.2 defines a keyboard-operation criterion with a path-dependent input exception.',location:'Proposal rationale'})).claim;
 const unresolved=await client.tool('audit_project',{project_id});assert(unresolved.issues.some(x=>x.area==='sources'));assert(unresolved.issues.some(x=>x.area==='evidence'));
 await client.tool('update_source',{project_id,source_id:source.id,verified:true,notes:verificationNote});
 await client.tool('update_claim',{project_id,claim_id:claim.id,source_ids:[source.id]});
 const intro='This synthetic proposal demonstrates the notebook workflow. No participants were recruited and no empirical findings exist. A library catalogue is used as a provisional evaluation context. WCAG 2.2 provides a keyboard-operation criterion with a path-dependent input exception (W3C, 2024, SC 2.1.1). The proposed study would examine representative search and record-selection tasks. It does not claim that any actual library has failed the criterion, or that all accessibility needs are covered by keyboard testing.';
 await client.tool('save_section',{project_id,chapter:1,section_title:'Proposal and rationale',content:intro,status:'draft'});
 await client.tool('save_section',{project_id,chapter:3,section_title:'Planned method',content:'Define catalogue tasks before evaluation, record keyboard actions and task outcomes, and retain reproducible barrier descriptions. Participant research requires an approved ethics and consent process before recruitment. Sampling, analysis and accessibility review remain to be designed with the researcher. No data or results are supplied by this example.',status:'draft'});
 await client.tool('save_section',{project_id,chapter:6,section_title:'Reference',content:source.citation+' '+source.url_or_doi,status:'draft'});
 assert.equal((await client.tool('get_section',{project_id,chapter:1,section_title:'Proposal and rationale'})).section.content,intro);
 const dashboard=await client.tool('get_dashboard',{project_id});assert(dashboard.words>0&&dashboard.reference_words>0);assert.equal(dashboard.words+dashboard.reference_words,dashboard.total_section_words);
 const audit=await client.tool('audit_project',{project_id});assert.equal(audit.passed,true);assert.equal(audit.word_budget_met,false);assert.equal(audit.scope,'structure_and_recorded_flags_only');
 const exported=await client.tool('export_markdown',{project_id,filename:'synthetic-proposal.md'});
 assert.equal(exported.main_text_words,dashboard.words);assert(path.resolve(exported.path).startsWith(workspace+path.sep));
 const manuscript=fs.readFileSync(exported.path,'utf8');assert(manuscript.includes('No participants were recruited'));assert(manuscript.includes('Recorded source ledger'));assert(manuscript.includes(source.id));
 const rejected=await client.request('tools/call',{name:'export_markdown',arguments:{project_id,filename:'../escape.md'}});assert(rejected.error);assert(!fs.existsSync(path.join(workspace,'escape.md')));
 await client.close();client=start();await initialize(client);
 assert((await client.tool('list_projects',{})).projects.some(p=>p.id===project_id));
 const reopened=await client.tool('get_dashboard',{project_id});assert.equal(reopened.words,dashboard.words);
 assert.equal((await client.tool('get_section',{project_id,chapter:1,section_title:'Proposal and rationale'})).section.content,intro);
 const again=await client.tool('export_markdown',{project_id,filename:'reopened-proposal.md'});assert.equal(fs.readFileSync(again.path,'utf8'),manuscript);
 result={version,workspace,project_id,actualMcp:true,tools:12,initialAuditPassed:initial.passed,correctedStructuralAuditPassed:audit.passed,wordBudgetMet:audit.word_budget_met,mainTextWords:dashboard.words,referenceWords:dashboard.reference_words,export:exported.path,sha256:crypto.createHash('sha256').update(manuscript).digest('hex'),restartPersistence:true,unsafeExportRejected:true,researchRootUsed:false,note:'Synthetic proposal; structural checks and recorded verification flags are not academic acceptance.'};
}finally{await client.close();}
fs.writeFileSync(path.join(workspace,'flow-transcript.json'),JSON.stringify(transcript,null,2)+'\n');
fs.writeFileSync(path.join(workspace,'flow-result.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
