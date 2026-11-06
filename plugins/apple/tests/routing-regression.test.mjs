import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {explainRoute} from '../skills/apple/scripts/workbench.mjs';
const cases=JSON.parse(fs.readFileSync(new URL('./fixtures/routing.json',import.meta.url),'utf8'));
test('routing regression corpus retains every required module',()=>{
 for(const fixture of cases){
  const actual=explainRoute(fixture.task).references;
  for(const reference of fixture.required)assert.ok(actual.includes(reference),`${fixture.task}: missing ${reference}`);
 }
});
