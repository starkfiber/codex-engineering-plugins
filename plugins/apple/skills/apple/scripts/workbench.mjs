import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

export const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const registry = JSON.parse(fs.readFileSync(path.join(skillRoot,'registry.json'),'utf8'));
export function explainRoute(text) {
 const value=text.toLowerCase();
 const selected=registry.modules.map(module=>({...module,matches:module.terms.filter(term=>new RegExp('(^|[^a-z])'+term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'([^a-z]|$)').test(value))})).filter(m=>m.matches.length);
 if(!selected.length) selected.push({...registry.modules[0],matches:[]});
 return {references:selected.map(m=>m.reference),decisions:selected.map(m=>({module:m.id,matchedTerms:m.matches,confidence:m.matches.length?'keyword-match':'fallback',reason:m.matches.length?`Matched ${m.matches.join(', ')}`:'No specific topic found; inspect engineering context'})),note:'Confidence describes lexical matching, not a calibrated probability.'};
}

function walk(root, cap=10000) {
 const result=[]; const pending=[root];
 while(pending.length) {const dir=pending.pop(); for(const entry of fs.readdirSync(dir,{withFileTypes:true})) {
  if(entry.isSymbolicLink()||['.git','.build','DerivedData','node_modules','review','dist'].includes(entry.name))continue;
  const p=path.join(dir,entry.name); if(entry.isDirectory()) pending.push(p); else result.push(p);
  if(result.length>cap)throw Error('Project exceeds 10000 files; select a narrower root');
 }} return result;
}

export function inspectProject(root) {
 root=fs.realpathSync(root); if(!fs.statSync(root).isDirectory())throw Error('Select a project directory');
 const files=walk(root); const configs=files.filter(p=>/Package\.swift$|project\.pbxproj$|\.entitlements$|Info\.plist$|\.xcconfig$/.test(p));
 const findings=[]; const configuration=[];
 for(const file of configs) {
  if(fs.statSync(file).size>2*1024*1024)continue;
  let text=fs.readFileSync(file,'utf8');
  if (/\.plist$|\.entitlements$/.test(file)) {
   try { text=execFileSync('/usr/bin/plutil',['-convert','xml1','-o','-',file],{encoding:'utf8',maxBuffer:2*1024*1024}); }
   catch { findings.push({id:'unreadable-plist',severity:'review',file:path.relative(root,file),message:'Property list could not be decoded'}); }
  }
  const entries=text.split('\n').flatMap((line,i)=>/DEPLOYMENT_TARGET|SWIFT_VERSION|SWIFT_STRICT_CONCURRENCY|SWIFT_DEFAULT_ACTOR_ISOLATION|CODE_SIGN|PRODUCT_BUNDLE_IDENTIFIER|com\.apple\.security|NS\w+UsageDescription|\.macOS\(|\.iOS\(|\.watchOS\(|\.tvOS\(|\.visionOS\(/.test(line)?[{line:i+1,value:line.trim()}]:[]);
  configuration.push({file:path.relative(root,file),entries});
 }
 const rules=[
  ['legacy-navigation',/\bNavigationView\s*\{/,'Review NavigationView against the deployment target; preserve compatible behavior.'],
  ['unstructured-work',/Task\.detached\s*\{/,'Review cancellation, actor isolation and captured state across detached work.'],
  ['blocking-ui',/Data\(contentsOf:/,'Review synchronous file/network loading on UI execution paths.'],
  ['forced-operation',/\btry!\s/,'Review crash behavior and recoverable failure handling.'],
  ['fixed-font',/\.font\(\.system\(size:/,'Check text scaling for this fixed size; this may be intentional.'],
  ['hardcoded-color',/Color\(red:/,'Consider a semantic token and supported appearance contrast.']
 ];
 const swift=files.filter(p=>p.endsWith('.swift'));
 for(const file of swift) {if(fs.statSync(file).size>2*1024*1024)continue; const lines=fs.readFileSync(file,'utf8').split('\n'); lines.forEach((line,i)=>{for(const [id,pattern,message] of rules)if(pattern.test(line)&&!line.trim().startsWith('//'))findings.push({id,severity:'review',file:path.relative(root,file),line:i+1,message});});}
 return {schemaVersion:1,root,swiftFileCount:swift.length,configuration,findings,limitations:['Heuristic source review; comments, strings and platform availability may produce false positives.','No compiler, accessibility or runtime result is inferred.','Secrets and unrelated file contents are not included.']};
}

export function hashFile(file, expected) {
 const resolved=path.resolve(file); if(!fs.statSync(resolved).isFile())throw Error('Expected a regular file');
 if(expected&&!/^[a-f0-9]{64}$/i.test(expected))throw Error('Expected SHA-256 must contain 64 hexadecimal digits');
 return new Promise((resolve,reject)=>{const hash=crypto.createHash('sha256');const stream=fs.createReadStream(resolved);stream.on('error',reject);stream.on('data',data=>hash.update(data));stream.on('end',()=>{const sha256=hash.digest('hex');resolve({file:resolved,sha256,matches:expected?sha256===expected.toLowerCase():null,signingStatus:'not checked'});});});
}

export function verificationPlan() {
 return {schemaVersion:1,platforms:registry.platforms.map(platform=>({platform,source:'pending',static:'pending',build:'pending',unit:'pending',simulator:'pending',device:'pending',distribution:'pending',evidence:[]})),rule:'A status becomes passed only with matching evidence; unavailable checks remain pending or unavailable.'};
}
