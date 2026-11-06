import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const sample=path.join(root,'examples/BlueprintSample');
const matrix=[['macOS','macosx','arm64-apple-macosx15.0'],['iOS','iphonesimulator','arm64-apple-ios17.0-simulator'],['iPadOS','iphonesimulator','arm64-apple-ios17.0-simulator'],['watchOS','watchsimulator','arm64-apple-watchos10.0-simulator'],['tvOS','appletvsimulator','arm64-apple-tvos17.0-simulator'],['visionOS','xrsimulator','arm64-apple-xros1.0-simulator']];
const results=[];
for(const [platform,sdk,target] of matrix) {
 let sdkPath;
 try{sdkPath=execFileSync('/usr/bin/xcrun',['--sdk',sdk,'--show-sdk-path'],{encoding:'utf8',stdio:'pipe'}).trim();}
 catch(e){results.push({platform,status:'unavailable',detail:String(e.stderr).trim()});continue;}
 const sources=fs.readdirSync(path.join(sample,'Sources/BlueprintSample')).filter(f=>f.endsWith('.swift')).sort();
 const args=['--sdk',sdk,'swiftc','-typecheck','-swift-version','6','-strict-concurrency=complete','-sdk',sdkPath,'-target',target,...sources.map(f=>path.join(sample,'Sources/BlueprintSample',f))];
 try{execFileSync('/usr/bin/xcrun',args,{stdio:'pipe',timeout:120000});results.push({platform,status:'passed',check:'SwiftUI sample compiler typecheck',sdkPath,target,command:['xcrun',...args]});}
 catch(e){results.push({platform,status:'failed',detail:String(e.stderr)});}
}
const report={checkedAt:new Date().toISOString(),results,limitation:'Compiler checks only; app launch, simulator interaction and device behavior remain separate.'};
console.log(JSON.stringify(report,null,2));
if(results.some(r=>r.status==='failed'))process.exitCode=1;
