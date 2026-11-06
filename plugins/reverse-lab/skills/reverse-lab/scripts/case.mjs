#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';

async function fingerprint(file) {
  const hash = createHash('sha256');
  let bytes = 0;
  for await (const chunk of createReadStream(file)) { hash.update(chunk); bytes += chunk.length; }
  return { sha256: hash.digest('hex'), bytes };
}
function validateEvidence(evidence) {
  if (!Array.isArray(evidence)) throw Error('Invalid evidence index: expected an array');
  const ids=new Set();
  for (let i=0;i<evidence.length;i++) {
    const e=evidence[i];
    if (!e || typeof e!=='object' || !/^E[0-9]+$/.test(e.id) || !Number.isSafeInteger(Number(e.id.slice(1))) || ids.has(e.id) || typeof e.path!=='string' || !path.isAbsolute(e.path) || !/^[a-f0-9]{64}$/.test(e.sha256) || !Number.isSafeInteger(e.bytes) || e.bytes<0 || typeof e.description!=='string' || !e.description.trim() || typeof e.recordedAt!=='string' || !Number.isFinite(Date.parse(e.recordedAt))) throw Error('Invalid evidence index entry '+i+': require unique ID, absolute path, SHA-256, byte count, description and timestamp');
    ids.add(e.id);
  }
  return evidence;
}
async function main() {
  const [command, inputDir, ...args] = process.argv.slice(2);
  let dir = inputDir;
  if (!['init', 'record', 'verify'].includes(command) || !dir || !path.isAbsolute(dir))
    throw Error('Usage: case.mjs init|record|verify <absolute-case-directory> [arguments]');
  const file = name => path.join(dir, name);
  if (command === 'init') {
    if (!args.join(' ').trim()) throw Error('An objective is required');
    await fs.mkdir(path.dirname(dir), {recursive:true});
    await fs.mkdir(dir); // Exclusive creation: never overwrite an existing case.
    const now = new Date().toISOString();
    await fs.writeFile(file('case.json'), JSON.stringify({schemaVersion:1, createdAt:now, objective:args.join(' ')}, null, 2)+'\n', {flag:'wx'});
    await fs.writeFile(file('evidence.json'), '[]\n', {flag:'wx'});
    await fs.writeFile(file('checkpoint.md'), `# Investigation checkpoint\n\nObjective: ${args.join(' ')}\n\n## Target identity and completion criteria\nNot yet recorded.\n\n## Verified findings and evidence\nNone yet.\n\n## Hypotheses and unknowns\nNot yet assessed.\n\n## Changes and checks\nCase initialized; no target analyzed.\n\n## Failed approaches\nNone recorded.\n\n## Active jobs and cleanup\nNone started by the case helper.\n\n## Next step\nIdentify target and completion criteria, then collect relevant evidence.\n`, {flag:'wx'});
    console.log(JSON.stringify({caseDirectory:dir, initialized:true})); return;
  }
  dir = await fs.realpath(dir);
  const metadata = JSON.parse(await fs.readFile(file('case.json'), 'utf8'));
  if (metadata.schemaVersion !== 1) throw Error('Unsupported case schema');
  if (command === 'record') {
    const [target, ...description] = args;
    if (!target || !path.isAbsolute(target) || !description.join(' ').trim()) throw Error('Absolute evidence path and description required');
    const lockPath=file('.evidence.lock');
    const lock=await fs.open(lockPath,'wx');
    const temp=file(`.evidence-${process.pid}.tmp`);
    try {
      await lock.writeFile(JSON.stringify({pid:process.pid,startedAt:new Date().toISOString()}));
      const evidence=validateEvidence(JSON.parse(await fs.readFile(file('evidence.json'),'utf8')));
      if (!Array.isArray(evidence)) throw Error('Evidence index must be an array');
      const resolved=await fs.realpath(target);
      if (!(await fs.stat(resolved)).isFile()) throw Error('Evidence must be a regular file');
      if (['case.json','evidence.json','checkpoint.md','.evidence.lock'].some(n=>resolved===file(n))) throw Error('Record target/output evidence, not mutable case bookkeeping');
      const entry={id:`E${String(evidence.reduce((max,e)=>Math.max(max,Number(e.id.slice(1))),0)+1).padStart(4,'0')}`,path:resolved,recordedAt:new Date().toISOString(),description:description.join(' '),...await fingerprint(resolved)};
      evidence.push(entry);
      await fs.writeFile(temp,JSON.stringify(evidence,null,2)+'\n',{flag:'wx'});
      await fs.rename(temp,file('evidence.json'));
      console.log(JSON.stringify(entry));
    } finally { await fs.rm(temp,{force:true}); await lock.close(); await fs.unlink(lockPath); }
    return;
  }
  const evidence=validateEvidence(JSON.parse(await fs.readFile(file('evidence.json'),'utf8')));
  if (!Array.isArray(evidence)) throw Error('Evidence index must be an array');
  const results=[];
  for (const entry of evidence) {
    try {const current=await fingerprint(entry.path);results.push({id:entry.id,path:entry.path,status:current.sha256===entry.sha256&&current.bytes===entry.bytes?'unchanged':'changed'});}
    catch(error){results.push({id:entry.id,path:entry.path,status:'unreadable',reason:error.code||error.message});}
  }
  const evidencePresent=results.length>0;
  const ok=evidencePresent && results.every(r=>r.status==='unchanged');
  console.log(JSON.stringify({ok,evidencePresent,status:!evidencePresent?'empty':ok?'verified':'mismatch',checked:results.length,results},null,2));
  if (!ok) process.exitCode=2;
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
