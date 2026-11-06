import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {hashFile} from '../skills/apple/scripts/workbench.mjs';
import {firmwarePlan} from '../skills/apple/scripts/firmware-plan.mjs';
test('offline firmware preflight verifies checksum without claiming restore eligibility',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'apple-firmware-plan-'));
 try {
 for(const name of ['BuildManifest.plist','Restore.plist'])fs.writeFileSync(path.join(dir,name),'fixture');
 execFileSync('/usr/bin/zip',['-q','fixture.ipsw','BuildManifest.plist','Restore.plist'],{cwd:dir});
 const file=path.join(dir,'fixture.ipsw');const {sha256}=await hashFile(file);
 const result=await firmwarePlan({file,sha256,productType:'iPhone14,7',ecid:'123abc'});
 assert.equal(result.restoreReady,false);assert.deepEqual(result.hardwareActions,[]);
 await assert.rejects(()=>firmwarePlan({file,sha256:'0'.repeat(64),productType:'iPhone14,7',ecid:'123abc'}),/checksum mismatch/);
 await assert.rejects(()=>firmwarePlan({file,sha256,productType:'first device',ecid:'123abc'}),/product type/);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
