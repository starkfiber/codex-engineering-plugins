import path from 'node:path';
import {fileURLToPath} from 'node:url';
// Emit config for the current checkout and working runtime; never rewrite host settings.
const server=fileURLToPath(new URL('./mcp-server.mjs',import.meta.url));
console.log(JSON.stringify({mcpServers:{'apple-blueprint':{command:process.execPath,args:[path.resolve(server),'--stdio']}}},null,2));
