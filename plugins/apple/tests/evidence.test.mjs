import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {sourceDigest,validBuildEvidence} from '../scripts/evidence.mjs';
test('release evidence is tied to source and log contents',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'apple-evidence-'));
 try {
 fs.mkdirSync(path.join(root,'scripts'));fs.writeFileSync(path.join(root,'scripts','example.mjs'),'original');
 fs.writeFileSync(path.join(root,'build.log'),'compiler exited successfully');
 const digest=sourceDigest(root);
 const record={platform:'macOS',kind:'build',exitCode:0,sourceDigest:digest,command:['swift','build'],toolchain:'fixture toolchain',checkedAt:new Date().toISOString(),log:'build.log',logSha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'build.log'))).digest('hex')};
 assert.ok(validBuildEvidence(root,'macOS',[record],digest));
 assert.equal(validBuildEvidence(root,'iOS',[record],digest),false);
 assert.equal(validBuildEvidence(root,'macOS',['build.log'],digest),false);
 fs.writeFileSync(path.join(root,'build.log'),'changed');assert.equal(validBuildEvidence(root,'macOS',[record],digest),false);
 fs.writeFileSync(path.join(root,'scripts','example.mjs'),'changed');assert.notEqual(sourceDigest(root),digest);
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
