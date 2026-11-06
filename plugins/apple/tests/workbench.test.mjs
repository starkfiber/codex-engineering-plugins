import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {explainRoute,inspectProject,hashFile,verificationPlan} from '../skills/apple/scripts/workbench.mjs';
import {execFileSync} from 'node:child_process';
test('router avoids substring collisions and explains mixed work',()=>{
 assert.deepEqual(explainRoute('signature cosmos').references,['engineering.md']);
 const result=explainRoute('Build watchOS HealthKit app');
 assert.ok(result.references.includes('frameworks.md')); assert.ok(result.references.includes('platforms.md'));
 assert.ok(result.decisions.some(d=>d.matchedTerms.includes('healthkit')));
});
test('verification never fabricates passed checks',()=>{
 const plan=verificationPlan();assert.equal(plan.platforms.length,6);
 assert.ok(plan.platforms.every(p=>p.build==='pending'&&p.device==='pending'&&p.evidence.length===0));
});
test('inspection skips dependencies and symlinks and reports source locations',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'apple-inspect-'));
 try {
 fs.writeFileSync(path.join(dir,'Screen.swift'),'// try! ignored\nlet x = try! load()\n');
 fs.mkdirSync(path.join(dir,'node_modules')); fs.writeFileSync(path.join(dir,'node_modules','ignored.swift'),'try! load()');
 fs.symlinkSync('/Users',path.join(dir,'outside'));
 const report=inspectProject(dir);assert.equal(report.swiftFileCount,1);assert.equal(report.findings[0].line,2);assert.equal(report.findings.length,1);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('streamed SHA256 matches known digest and identifies corruption',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'apple-hash-'));
 try {const file=path.join(dir,'fixture');fs.writeFileSync(file,'abc');
 assert.equal((await hashFile(file,'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')).matches,true);
 assert.equal((await hashFile(file,'0'.repeat(64))).matches,false);
 assert.throws(()=>hashFile(file,'bad'),/64 hexadecimal/);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('binary property lists expose entitlement keys without changing the source',{skip:process.platform!=='darwin'},()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'apple-plist-'));
 try {
 const file=path.join(dir,'Example.entitlements');
 fs.writeFileSync(file,'<?xml version="1.0"?><plist version="1.0"><dict><key>com.apple.security.app-sandbox</key><true/></dict></plist>');
 execFileSync('/usr/bin/plutil',['-convert','binary1',file]);
 const before=fs.readFileSync(file);
 assert.ok(inspectProject(dir).configuration[0].entries.some(e=>e.value.includes('com.apple.security.app-sandbox')));
 assert.deepEqual(fs.readFileSync(file),before);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
