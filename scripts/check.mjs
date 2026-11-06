import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url)),reverse=root+'plugins/reverse-lab';
const commands=[...['test-case-helper.mjs','test-case-regressions.mjs','test-evidence-v3.mjs','test-jobs-replay.mjs'].map(n=>[path.join(reverse,n)]),['--test',...fs.readdirSync(root+'plugins/apple/tests').filter(n=>n.endsWith('.test.mjs')).map(n=>root+'plugins/apple/tests/'+n)],[root+'scripts/smoke.mjs'],[root+'scripts/manifest.mjs']];
for(const args of commands){const r=spawnSync(process.execPath,args,{stdio:'inherit',cwd:root,timeout:120000});if(r.status!==0)process.exit(r.status??1);}

const thesis=spawnSync('python3',['-B','-m','unittest','discover','-s',root+'plugins/thesis-pro/tests','-v'],{stdio:'inherit',cwd:root,timeout:30000});if(thesis.status!==0)process.exit(thesis.status??1);
