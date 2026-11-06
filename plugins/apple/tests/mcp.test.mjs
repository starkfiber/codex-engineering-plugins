import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {dispatch} from '../scripts/mcp-server.mjs';
import {fileURLToPath} from 'node:url';
const server=fileURLToPath(new URL('../scripts/mcp-server.mjs',import.meta.url));
test('MCP exposes read-only tools and rejects invalid calls',async()=>{
 const list=await dispatch({jsonrpc:'2.0',id:1,method:'tools/list'});
 assert.equal(list.tools.length,3);assert.ok(list.tools.every(t=>t.annotations.readOnlyHint));
 const result=await dispatch({jsonrpc:'2.0',id:2,method:'tools/call',params:{name:'apple_route',arguments:{task:'SwiftUI accessibility',command:'erase'}}});
 assert.equal(result.isError,true);
});
test('MCP stdio initializes, routes and preserves protocol framing',()=>{
 const messages=[{jsonrpc:'2.0',id:1,method:'initialize',params:{protocolVersion:'2024-11-05',capabilities:{},clientInfo:{name:'fixture',version:'1'}}},{jsonrpc:'2.0',method:'notifications/initialized'},{jsonrpc:'2.0',id:2,method:'tools/call',params:{name:'apple_route',arguments:{task:'Build native SwiftUI watchOS app'}}}];
 const result=spawnSync(process.execPath,[server,'--stdio'],{input:messages.map(m=>JSON.stringify(m)).join('\n')+'\n',encoding:'utf8'});
 assert.equal(result.status,0);const replies=result.stdout.trim().split('\n').map(l=>JSON.parse(l));assert.equal(replies.length,2);assert.equal(replies[0].result.serverInfo.name,'apple-blueprint');
 assert.ok(JSON.parse(replies[1].result.content[0].text).references.includes('platforms.md'));
});
test('MCP registry and review prompt are discoverable',async()=>{
 const r=await dispatch({jsonrpc:'2.0',id:1,method:'resources/read',params:{uri:'apple://registry'}});assert.ok(JSON.parse(r.contents[0].text).modules.length);
 const p=await dispatch({jsonrpc:'2.0',id:2,method:'prompts/get',params:{name:'apple_native_review',arguments:{task:'review Mac settings'}}});assert.equal(p.messages[0].role,'user');
});
test('malformed MCP messages do not terminate the server',()=>{
 const result=spawnSync(process.execPath,[server,'--stdio'],{input:'null\n[]\ninvalid json\n'+JSON.stringify({jsonrpc:'2.0',id:9,method:'ping'})+'\n',encoding:'utf8'});
 assert.equal(result.status,0);const replies=result.stdout.trim().split('\n').map(l=>JSON.parse(l));
 assert.equal(replies.length,4);assert.equal(replies[0].error.code,-32600);assert.equal(replies[2].error.code,-32700);assert.equal(replies[3].id,9);
});
