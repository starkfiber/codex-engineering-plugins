import {spawnSync} from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';

const root=await fs.mkdtemp(path.join(os.tmpdir(),'reverse-lab-regressions-'));
const tool=fileURLToPath(new URL('./skills/reverse-lab/scripts/case.mjs',import.meta.url));
const dir=path.join(root,'new-project','.reverse-lab','real-app');
const target=path.join(root,'target.js');
const checks=[];
function run(label,args,status=0,cwd=root) {
  const result=spawnSync(process.execPath,[tool,...args],{cwd,encoding:'utf8'});
  assert.equal(result.status,status,`${label}: ${result.stderr}`);
  checks.push(label);
  return result;
}
const writeIndex=entries=>fs.writeFile(path.join(dir,'evidence.json'),JSON.stringify(entries,null,2)+'\n');
try {
  run('Fresh nested case creation',['init',dir,'Investigate shipped app']);
  const initial=await fs.readFile(path.join(dir,'case.json'),'utf8');
  run('Repeat initialization rejected',['init',dir,'Overwrite objective'],1);
  assert.equal(await fs.readFile(path.join(dir,'case.json'),'utf8'),initial);
  const empty=JSON.parse(run('Empty evidence fails verification',['verify',dir],2).stdout);
  assert.equal(empty.ok,false); assert.equal(empty.evidencePresent,false); assert.equal(empty.status,'empty');
  await fs.writeFile(target,'export const value = 1;\n');
  run('First record',['record',dir,target,'Initial artifact']);
  const first=JSON.parse(await fs.readFile(path.join(dir,'evidence.json'),'utf8'))[0];
  const elsewhere=path.join(root,'unrelated-cwd'); await fs.mkdir(elsewhere);
  const a=JSON.parse(run('Verify from case cwd',['verify',dir],0,dir).stdout);
  const b=JSON.parse(run('Verify from unrelated cwd',['verify',dir],0,elsewhere).stdout);
  assert.deepEqual(a,b); assert.equal(a.status,'verified');
  for(const [label,index] of [
    ['Relative path',[{...first,path:'target.js'}]],
    ['Null entry',[null]],
    ['Duplicate ID',[first,{...first}]],
    ['Invalid hash',[{...first,sha256:'wrong'}]],
    ['Invalid bytes',[{...first,bytes:-1}]],
  ]) {
    await writeIndex(index);
    const before=await fs.readFile(path.join(dir,'evidence.json'),'utf8');
    assert.match(run(`${label} rejected on verify`,['verify',dir],1).stderr,/Invalid evidence index/);
    assert.match(run(`${label} rejected on record`,['record',dir,target,'Append'],1).stderr,/Invalid evidence index/);
    assert.equal(await fs.readFile(path.join(dir,'evidence.json'),'utf8'),before);
    await assert.rejects(fs.access(path.join(dir,'.evidence.lock')));
  }
  await writeIndex([first]);
  run('Second record',['record',dir,target,'Second artifact']);
  const full=JSON.parse(await fs.readFile(path.join(dir,'evidence.json'),'utf8'));
  await writeIndex([full[1]]); // A valid prune retains a higher evidence ID.
  const appended=JSON.parse(run('Allocate ID after valid prune',['record',dir,target,'Third artifact']).stdout);
  assert.equal(appended.id,'E0003');
  run('Pruned index verifies',['verify',dir]);
  console.log(JSON.stringify({passed:checks.length,checks},null,2));
} finally { await fs.rm(root,{recursive:true,force:true}); }
