import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {route,inspectIPSW} from '../skills/apple/scripts/apple.mjs';

const cases=[
 ['Build a macOS menu-bar download app',['platforms.md','engineering.md','verification.md']],
 ['Audit iPhone typography and accessibility',['design.md','platforms.md']],
 ['watchOS HealthKit workout companion',['platforms.md','frameworks.md']],
 ['Apple TV focus UI design',['platforms.md','design.md']],
 ['visionOS RealityKit volume',['platforms.md','frameworks.md']],
 ['Download IPSW firmware for iPhone 14',['firmware.md','engineering.md','platforms.md']],
 ['Compare source licenses',['sources.md']],
 ['Fix iPad StoreKit purchase error',['engineering.md','platforms.md','frameworks.md']]
];
for(const [task,refs] of cases) test(task,()=>{for(const ref of refs) assert.ok(route(task).includes(ref),ref);});
test('IPSW inspection lists entries without extracting and rejects traversal',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'apple-plugin-test-'));
 try {
  fs.writeFileSync(path.join(dir,'BuildManifest.plist'),'fixture');
  execFileSync('/usr/bin/zip',['-q','fixture.ipsw','BuildManifest.plist'],{cwd:dir});
  const result=inspectIPSW(path.join(dir,'fixture.ipsw'));
  assert.deepEqual(result.entries,['BuildManifest.plist']);
  assert.equal(result.signingStatus,'not checked');
  fs.mkdirSync(path.join(dir,'child'));
  execFileSync('/usr/bin/zip',['-q','bad.ipsw','../BuildManifest.plist'],{cwd:path.join(dir,'child')});
  assert.throws(()=>inspectIPSW(path.join(dir,'child/bad.ipsw')),/unsafe paths/);
  fs.writeFileSync(path.join(dir,'incomplete.ipsw'),'partial');
  assert.throws(()=>inspectIPSW(path.join(dir,'incomplete.ipsw')));
 } finally {fs.rmSync(dir,{recursive:true,force:true});}
});
