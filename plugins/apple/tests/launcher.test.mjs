import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
test('shipped MCP configuration launches the relocated payload without checkout paths',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'Blueprint shipped plugin '));
 try {
  for(const name of ['.codex-plugin/mcp.json','scripts/launch-mcp.sh','scripts/mcp-server.mjs','skills/apple/scripts/workbench.mjs','skills/apple/registry.json']){
   const target=path.join(dir,name);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(root,name),target);
  }
  const config=JSON.parse(fs.readFileSync(path.join(dir,'.codex-plugin/mcp.json'))).mcpServers['apple-blueprint'];
  assert.equal(config.command,'/bin/sh');
  assert.ok(config.args.every(value=>!value.includes('/Users/')));
  const messages=[{jsonrpc:'2.0',id:1,method:'initialize',params:{protocolVersion:'2024-11-05'}},{jsonrpc:'2.0',id:2,method:'tools/list'}];
  const result=spawnSync(config.command,config.args.map(value=>value.replaceAll('${PLUGIN_ROOT}',dir)),{cwd:os.tmpdir(),env:{...process.env,APPLE_BLUEPRINT_NODE:process.execPath},input:messages.map(JSON.stringify).join('\n')+'\n',encoding:'utf8',timeout:10000});
  assert.equal(result.status,0,result.stderr);
  const replies=result.stdout.trim().split('\n').map(JSON.parse);
  assert.equal(replies[0].result.serverInfo.name,'apple-blueprint');
  assert.equal(replies[1].result.tools.length,3);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
