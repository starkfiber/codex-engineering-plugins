#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
export const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const alive = pid => { if (!Number.isSafeInteger(pid)||pid<=0) return false; try {process.kill(pid,0);return true;}catch(e){return e.code==='EPERM';} };
const groupAlive = pid => {if(process.platform==='win32')return null; try{process.kill(-pid,0);return true;}catch(e){if(e.code==='ESRCH')return false;return null;}};
const write = async(dir,value)=>{const temp=path.join(dir,`.state-${process.pid}.tmp`);await fs.writeFile(temp,JSON.stringify(value,null,2)+'\n');await fs.rename(temp,path.join(dir,'job.json'));};
export function validateSpec(spec){
 if(!spec||typeof spec!=='object'||!path.isAbsolute(spec.command||'')||!Array.isArray(spec.args)||!spec.args.every(x=>typeof x==='string')||!path.isAbsolute(spec.cwd||''))throw Error('Job requires absolute command and cwd, plus string args array');
 if(Object.keys(spec).some(k=>!['command','args','cwd'].includes(k)))throw Error('Unsupported job field (shell and environment overrides are not accepted)');
}
export async function runJob(dir,spec){
 validateSpec(spec);if(!path.isAbsolute(dir))throw Error('Absolute job directory required');
 await fs.mkdir(path.dirname(dir),{recursive:true});await fs.mkdir(dir); // permanent exclusive dispatch reservation
 let state={schemaVersion:1,state:'starting',ownerPid:process.pid,childPid:null,startedAt:new Date().toISOString(),spec,exitCode:null,signal:null,cleanupVerified:false,cleanupScope:'process-group; deliberately detached descendants cannot be proved absent'};
 await write(dir,state);
 const stdout=await fs.open(path.join(dir,'stdout.log'),'wx');const stderr=await fs.open(path.join(dir,'stderr.log'),'wx');let child;
 try{
  child=spawn(spec.command,spec.args,{cwd:spec.cwd,shell:false,detached:process.platform!=='win32',stdio:['ignore',stdout.fd,stderr.fd]});
  const exit=new Promise(resolve=>{child.once('error',error=>resolve({error:error.message,code:null,signal:null}));child.once('exit',(code,signal)=>resolve({code,signal}));});
  state={...state,state:'running',childPid:child.pid??null};await write(dir,state);
  const result=await exit;
  const absent=child.pid?groupAlive(child.pid):false;
  state={...state,state:result.error?'failed-to-start':result.code===0?'completed':'failed',finishedAt:new Date().toISOString(),exitCode:result.code,signal:result.signal,error:result.error??null,directChildExited:true,cleanupVerified:result.error?true:absent===false,cleanupScope:process.platform==='win32'?'direct child only; descendant cleanup unverified':state.cleanupScope};
  await write(dir,state);return state;
 }finally{await stdout.close();await stderr.close();}
}
export async function statusJob(dir,reconcile=false){
 if(!path.isAbsolute(dir))throw Error('Absolute job directory required');
 const state=JSON.parse(await fs.readFile(path.join(dir,'job.json'),'utf8'));
 if(state.schemaVersion!==1||!Number.isSafeInteger(state.ownerPid))throw Error('Invalid job ledger');
 const observation={observedAt:new Date().toISOString(),ownerPidExists:alive(state.ownerPid),childPidExists:alive(state.childPid),processGroupExists:state.childPid?groupAlive(state.childPid):null};
 // PID existence is conservative, never proof of ownership. Never signal a recovered PID.
 if(reconcile&&['starting','running'].includes(state.state)&&!observation.ownerPidExists){
  const recovered={...state,state:observation.childPidExists||observation.processGroupExists===true?'orphan-running':'interrupted',exitCode:null,cleanupVerified:!!state.childPid&&observation.processGroupExists===false,reconciliation:observation};
  // Different reconcilers cannot dispatch anything; last identical conservative observation wins.
  await write(dir,recovered);return recovered;
 }
 if(reconcile&&['orphan-running','interrupted'].includes(state.state)){
  const recovered={...state,state:observation.childPidExists||observation.processGroupExists===true?'orphan-running':'interrupted',cleanupVerified:!!state.childPid&&observation.processGroupExists===false,reconciliation:observation};await write(dir,recovered);return recovered;
 }
 if(reconcile&&['completed','failed'].includes(state.state)&&state.childPid&&!state.cleanupVerified&&observation.processGroupExists===false){const recovered={...state,cleanupVerified:true,reconciliation:observation};await write(dir,recovered);return recovered;}
 return {...state,observation};
}
async function main(){const [cmd,dir,specPath,flag,review]=process.argv.slice(2);let result;
 if(cmd==='start'){const raw=await fs.readFile(specPath);if(flag!=='--review-sha256'||review!==digest(raw))throw Error('Review the command specification, then supply its exact --review-sha256');result=await runJob(dir,JSON.parse(raw));}
 else if(cmd==='status'||cmd==='reconcile')result=await statusJob(dir,cmd==='reconcile');else throw Error('Usage: jobs.mjs start ABS_DIR SPEC.json --review-sha256 SHA | status ABS_DIR | reconcile ABS_DIR');
 console.log(JSON.stringify(result,null,2));if(result.state!=='completed'||result.cleanupVerified!==true)process.exitCode=2;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(e=>{console.error(e.message);process.exitCode=1});
