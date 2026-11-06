import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
test('MCP config and stdio survive relocation into a path with spaces',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'apple relocated '));
 try {
  for(const name of ['scripts/mcp-server.mjs','scripts/mcp-config.mjs','skills/apple/scripts/workbench.mjs','skills/apple/registry.json']) {
   const target=path.join(dir,name);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(root,name),target);
  }
  const configProcess=spawnSync(process.execPath,[path.join(dir,'scripts/mcp-config.mjs')],{encoding:'utf8',timeout:10000});
  assert.equal(configProcess.status,0);
  const config=JSON.parse(configProcess.stdout).mcpServers['apple-blueprint'];
  assert.equal(config.command,process.execPath);assert.equal(fs.realpathSync(config.args[0]),fs.realpathSync(path.join(dir,'scripts/mcp-server.mjs')));
  const requests=[{jsonrpc:'2.0',id:1,method:'initialize',params:{protocolVersion:'2024-11-05'}},{jsonrpc:'2.0',id:2,method:'tools/call',params:{name:'apple_route',arguments:{task:'SwiftUI accessibility'}}}];
  const server=spawnSync(config.command,config.args,{input:requests.map(JSON.stringify).join('\n')+'\n',encoding:'utf8',timeout:10000,cwd:dir});
  assert.equal(server.status,0);
  const replies=server.stdout.trim().split('\n').map(line=>JSON.parse(line));
  assert.equal(replies[0].result.serverInfo.name,'apple-blueprint');
  assert.ok(JSON.parse(replies[1].result.content[0].text).references.includes('design.md'));
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
