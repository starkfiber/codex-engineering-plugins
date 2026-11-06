import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export function sourceDigest(root) {
 const hash=crypto.createHash('sha256');
 function visit(dir) {
  for(const name of fs.readdirSync(dir).sort()) {
   if(['.git','.build','node_modules','dist'].includes(name))continue;
   const file=path.join(dir,name);const stat=fs.lstatSync(file);
   if(stat.isSymbolicLink())throw Error('Source tree contains a symlink: '+file);
   if(stat.isDirectory())visit(file);
   else if(stat.isFile()){hash.update(path.relative(root,file).split(path.sep).join('/')+'\0');hash.update(fs.readFileSync(file));hash.update('\0');}
  }
 }
 for(const name of ['.codex-plugin','skills','scripts','tests','examples'])if(fs.existsSync(path.join(root,name)))visit(path.join(root,name));
 return hash.digest('hex');
}

export function validBuildEvidence(root,platform,records,digest) {
 return validEvidence(root,records,digest,record=>record.platform===platform&&record.kind==='build',true);
}

export function validAcceptanceEvidence(root,gate,records,digest) {
 return validEvidence(root,records,digest,record=>record.gate===gate&&record.kind==='acceptance'&&typeof record.reviewer==='string'&&record.reviewer.trim().length>0,false);
}

function validEvidence(root,records,digest,matches,requireCommand) {
 if(!Array.isArray(records))return false;
 return records.some(record=>{
  if(!record||!matches(record)||record.exitCode!==0||record.sourceDigest!==digest)return false;
  if(requireCommand&&(!Array.isArray(record.command)||!record.command.length||!record.command.every(s=>typeof s==='string')))return false;
  if(typeof record.toolchain!=='string'||!record.toolchain.trim()||!Number.isFinite(Date.parse(record.checkedAt))||Date.parse(record.checkedAt)>Date.now()+60000)return false;
  if(typeof record.log!=='string'||path.isAbsolute(record.log))return false;
  const file=path.resolve(root,record.log);
  if(!file.startsWith(path.resolve(root)+path.sep)||!fs.existsSync(file))return false;
  const real=fs.realpathSync(file);
  if(!real.startsWith(fs.realpathSync(root)+path.sep)||!fs.statSync(real).isFile())return false;
  const contents=fs.readFileSync(real);
  return contents.length>0&&crypto.createHash('sha256').update(contents).digest('hex')===record.logSha256;
 });
}
