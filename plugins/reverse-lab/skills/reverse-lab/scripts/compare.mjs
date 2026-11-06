#!/usr/bin/env node
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const obj=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const nonempty=v=>typeof v==='string'&&v.trim().length>0;
const hash=v=>typeof v==='string'&&/^[a-f0-9]{64}$/.test(v);
function check(ok,message){if(!ok)throw Error(message);}
function manifest(m,label){
  check(obj(m)&&m.schemaVersion===1&&nonempty(m.target)&&nonempty(m.version)&&Array.isArray(m.artifacts),`Invalid ${label} manifest`);
  const ids=new Set();for(const a of m.artifacts){check(obj(a)&&nonempty(a.id)&&!ids.has(a.id)&&hash(a.sha256),`Invalid or duplicate artifact in ${label}`);ids.add(a.id);}return new Map(m.artifacts.map(a=>[a.id,a]));
}
export function compareClaims(before,after,claimDocument){
  const a=manifest(before,'before'),b=manifest(after,'after');check(before.target===after.target,'Cannot compare different targets');
  check(obj(claimDocument)&&claimDocument.schemaVersion===1&&Array.isArray(claimDocument.claims),'Invalid claims document');
  const changes=[];for(const id of new Set([...a.keys(),...b.keys()])){const old=a.get(id),next=b.get(id);changes.push({id,status:!old?'added':!next?'removed':old.sha256!==next.sha256?'changed':'unchanged',before:old?.sha256??null,after:next?.sha256??null});}
  const changed=new Map(changes.map(c=>[c.id,c]));const ids=new Set();
  const claims=claimDocument.claims.map(c=>{
    check(obj(c)&&nonempty(c.id)&&!ids.has(c.id)&&nonempty(c.statement)&&Array.isArray(c.dependsOn)&&c.dependsOn.length>0&&c.dependsOn.every(nonempty)&&new Set(c.dependsOn).size===c.dependsOn.length,'Invalid claim: unique id, statement and nonempty unique dependencies required');ids.add(c.id);
    const reasons=[];for(const id of c.dependsOn){if(!a.has(id))reasons.push({artifact:id,reason:'dependency-missing-from-baseline'});else if(!b.has(id))reasons.push({artifact:id,reason:'dependency-removed'});else if(changed.get(id).status==='changed')reasons.push({artifact:id,reason:'dependency-changed'});}
    return {id:c.id,statement:c.statement,dependsOn:c.dependsOn,status:reasons.length?'needs-revalidation':'unchanged-dependencies',reasons};
  });
  return {schemaVersion:1,target:before.target,fromVersion:before.version,toVersion:after.version,changes,claims,revalidationRequired:claims.some(c=>c.status==='needs-revalidation'),notice:'Manifest comparison does not read live files or verify claims. Unchanged dependencies preserve eligibility to reuse evidence, not proof of truth. Manifest generation must include every relevant dependency, configuration and runtime condition.'};
}
async function cli(){const [before,after,claims,...extra]=process.argv.slice(2);check(before&&after&&claims&&!extra.length,'Usage: compare.mjs <before.json> <after.json> <claims.json>');const documents=await Promise.all([before,after,claims].map(async f=>JSON.parse(await fs.readFile(f,'utf8'))));const result=compareClaims(...documents);console.log(JSON.stringify(result,null,2));if(result.revalidationRequired)process.exitCode=2;}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)cli().catch(e=>{console.error(JSON.stringify({error:e.message}));process.exitCode=1;});
