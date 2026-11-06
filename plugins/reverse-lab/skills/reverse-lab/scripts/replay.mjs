#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import {createReadStream} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {runJob,digest,validateSpec} from './jobs.mjs';
async function hash(file){const h=createHash('sha256');for await(const part of createReadStream(file))h.update(part);return h.digest('hex');}
async function canonicalDestination(destination){
 let current=path.resolve(destination),suffix=[];
 for(;;){try{return path.join(await fs.realpath(current),...suffix);}catch(error){if(error.code!=='ENOENT')throw error;const parent=path.dirname(current);if(parent===current)throw error;suffix.unshift(path.basename(current));current=parent;}}
}
async function verifyInputs(artifacts){const results=[];for(const a of artifacts){try{const actual=await hash(a.path);results.push({path:a.path,expected:a.sha256,actual,unchanged:actual===a.sha256});}catch(error){results.push({path:a.path,unchanged:false,error:error.code||error.message});}}return results;}
export async function replay(packPath,out,review){
 const raw=await fs.readFile(packPath);if(digest(raw)!==review)throw Error('Review the entire replay pack and supply its exact SHA-256 with --review-sha256');
 const p=JSON.parse(raw);if(p.schemaVersion!==1||typeof p.name!=='string'||!p.name||!Array.isArray(p.artifacts)||p.artifacts.length===0||!Array.isArray(p.steps)||p.steps.length===0)throw Error('Pack requires schemaVersion 1, name, nonempty artifacts and steps');
 if(!path.isAbsolute(out))throw Error('Absolute output directory required');
 const pluginRoot=await fs.realpath(path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..'));
 out=await canonicalDestination(out);
 if(out===pluginRoot||out.startsWith(pluginRoot+path.sep))throw Error('Use an absolute output directory outside the installed plugin');
 const ids=new Set();for(const step of p.steps){if(!/^[a-z0-9][a-z0-9-]*$/.test(step.id)||ids.has(step.id))throw Error('Unique simple step IDs required');ids.add(step.id);validateSpec(step.spec);}
 const checks=[];for(const a of p.artifacts){if(!path.isAbsolute(a.path||'')||!/^[a-f0-9]{64}$/.test(a.sha256||''))throw Error('Artifact requires absolute path and SHA-256');if(!(await fs.stat(a.path)).isFile())throw Error('Artifact must be a regular file');const actual=await hash(a.path);if(actual!==a.sha256)throw Error('Artifact changed: '+a.path);let version=null;
  if(a.version){if(typeof a.version.field!=='string'||typeof a.version.expected!=='string')throw Error('Invalid version assertion');let v=JSON.parse(await fs.readFile(a.path,'utf8'));for(const part of a.version.field.split('.'))v=v?.[part];if(v!==a.version.expected)throw Error('Artifact version mismatch: '+a.path);version=v;}checks.push({path:a.path,sha256:actual,version});}
 await fs.mkdir(path.dirname(out),{recursive:true});await fs.mkdir(out);await fs.writeFile(path.join(out,'reviewed-pack.json'),raw,{flag:'wx'});
 const result={schemaVersion:1,name:p.name,packSha256:review,startedAt:new Date().toISOString(),artifacts:checks,steps:[],ok:false};
 for(const step of p.steps){const state=await runJob(path.join(out,'jobs',step.id),step.spec);const inputs=await verifyInputs(p.artifacts);result.steps.push({id:step.id,state:state.state,exitCode:state.exitCode,cleanupVerified:state.cleanupVerified,inputIntegrity:inputs.every(a=>a.unchanged),inputChecks:inputs});await fs.writeFile(path.join(out,'results.json'),JSON.stringify(result,null,2)+'\n');if(state.state!=='completed'||!state.cleanupVerified||!inputs.every(a=>a.unchanged))break;}
 result.artifactPostflight=await verifyInputs(p.artifacts);
 result.ok=result.steps.length===p.steps.length&&result.steps.every(s=>s.state==='completed'&&s.cleanupVerified&&s.inputIntegrity)&&result.artifactPostflight.every(a=>a.unchanged);result.finishedAt=new Date().toISOString();await fs.writeFile(path.join(out,'results.json'),JSON.stringify(result,null,2)+'\n');return result;
}
async function main(){const [pack,out,flag,review]=process.argv.slice(2);if(flag!=='--review-sha256')throw Error('Usage: replay.mjs PACK.json ABS_OUTPUT --review-sha256 SHA');const result=await replay(pack,out,review);console.log(JSON.stringify(result,null,2));if(!result.ok)process.exitCode=2;}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(e=>{console.error(e.message);process.exitCode=1});
