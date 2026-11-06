import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {explainRoute} from '../skills/apple/scripts/workbench.mjs';
const fixtures=JSON.parse(fs.readFileSync(fileURLToPath(new URL('../tests/fixtures/routing.json',import.meta.url))));
const results=fixtures.map(f=>{const actual=explainRoute(f.task).references;return {...f,actual,missing:f.required.filter(r=>!actual.includes(r))};});
const passed=results.filter(r=>!r.missing.length).length;
console.log(JSON.stringify({corpus:'local routing regression corpus',threshold:1,passed,total:results.length,requiredModuleRecall:results.reduce((n,r)=>n+r.required.length-r.missing.length,0)/results.reduce((n,r)=>n+r.required.length,0),results,limitation:'Local fixture regression, not an independent model-quality or design benchmark. Extra selections are not scored.'},null,2));
if(passed!==results.length)process.exitCode=1;
