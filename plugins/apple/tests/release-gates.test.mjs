import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {assessStability,requiredV3Gates} from '../scripts/release-gates.mjs';

test('platform builds alone cannot mark V3 stable',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'blueprint-gates-'));
 try {
  fs.writeFileSync(path.join(root,'proof.log'),'synthetic test evidence');
  const common={exitCode:0,sourceDigest:'fixture',checkedAt:new Date().toISOString(),toolchain:'test fixture',log:'proof.log',logSha256:crypto.createHash('sha256').update('synthetic test evidence').digest('hex')};
  const builds={platforms:[{platform:'macOS',build:'passed',evidence:[{...common,kind:'build',platform:'macOS',command:['test-build']}]}]};
  const missing=assessStability(root,['macOS'],builds,null,'fixture');
  assert.deepEqual(missing.pendingPlatforms,[]);
  assert.deepEqual(missing.pendingV3Gates,requiredV3Gates);
  assert.equal(missing.stableReady,false);
  const workflow={gates:requiredV3Gates.map(gate=>({gate,status:'passed',evidence:[{...common,gate,kind:'acceptance',reviewer:'synthetic test reviewer'}]}))};
  assert.equal(assessStability(root,['macOS'],builds,workflow,'fixture').stableReady,true);
  workflow.gates[0].status='pending';
  assert.deepEqual(assessStability(root,['macOS'],builds,workflow,'fixture').pendingV3Gates,['runtime-adapter']);
  workflow.gates[0].status='passed';
  assert.equal(assessStability(root,['macOS'],builds,workflow,'changed-source').stableReady,false);
  fs.writeFileSync(path.join(root,'proof.log'),'tampered');
  assert.equal(assessStability(root,['macOS'],builds,workflow,'fixture').stableReady,false);
 } finally {fs.rmSync(root,{recursive:true,force:true});}
});

test('missing, empty or failed workflow evidence never implies acceptance',()=>{
 assert.equal(assessStability('/unused',[],{}, {gates:[]},'fixture').stableReady,false);
 const gates=requiredV3Gates.map(gate=>({gate,status:'passed',evidence:[]}));
 assert.equal(assessStability('/unused',[],{}, {gates},'fixture').stableReady,false);
 assert.equal(assessStability('/unused',[],{},null,'fixture').stableReady,false);
});
