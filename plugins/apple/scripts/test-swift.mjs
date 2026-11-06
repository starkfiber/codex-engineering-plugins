import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const sample=fileURLToPath(new URL('../examples/BlueprintSample/',import.meta.url));
const args=['test','--package-path',sample,'--disable-xctest','--enable-swift-testing'];
if(process.platform==='darwin'){
 const selected=spawnSync('/usr/bin/xcode-select',['-p'],{encoding:'utf8'});
 if(selected.status!==0)throw Error('Select an existing compatible Apple developer toolchain first.');
 const developer=selected.stdout.trim();
 if(path.basename(developer)==='CommandLineTools'){
  const frameworks=path.join(developer,'Library/Developer/Frameworks');
  const runtime=path.join(developer,'Library/Developer/usr/lib');
  if(!fs.existsSync(path.join(frameworks,'Testing.framework'))||!fs.existsSync(path.join(runtime,'lib_TestingInterop.dylib')))throw Error('Selected Command Line Tools lacks the required built-in Swift Testing framework/runtime. No dependencies or toolchains were changed.');
  args.push('-Xswiftc','-F','-Xswiftc',frameworks,'-Xlinker','-F'+frameworks,'-Xlinker','-rpath','-Xlinker',frameworks,'-Xlinker','-rpath','-Xlinker',runtime);
 }
}
const result=spawnSync('swift',args,{stdio:'inherit',timeout:180000});
if(result.error)throw result.error;
process.exitCode=result.status??1;
