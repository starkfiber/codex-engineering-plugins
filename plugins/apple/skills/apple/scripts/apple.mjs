import { execFileSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import {explainRoute,inspectProject,hashFile,verificationPlan} from './workbench.mjs';

export function route(text) {
  return explainRoute(text).references;
}

function probe(command, args) {
  try { return { available: true, output: execFileSync(command, args, {encoding:'utf8', timeout:15000, stdio:['ignore','pipe','pipe']}).trim() }; }
  catch (e) { return { available: false, detail: String(e.stderr || e.message).trim().slice(0,1000) }; }
}

export function inspectIPSW(file) {
  const resolved = path.resolve(file);
  if (!existsSync(resolved) || !statSync(resolved).isFile()) throw new Error('IPSW file does not exist');
  if (path.extname(resolved).toLowerCase() !== '.ipsw') throw new Error('Expected an .ipsw archive');
  const entries = execFileSync('/usr/bin/unzip', ['-Z1', resolved], {encoding:'utf8', timeout:30000, maxBuffer:16*1024*1024}).trim().split('\n');
  if (entries.some(name => name.startsWith('/') || name.split(/[\\/]/).includes('..'))) throw new Error('Archive contains unsafe paths');
  return { path: resolved, bytes: statSync(resolved).size, entries, signingStatus:'not checked', contentIntegrity:'not checked; directory listing only' };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const [command, ...args] = process.argv.slice(2);
    let result;
    if (command === 'route') result = explainRoute(args.join(' '));
    else if (command === 'inspect-project' && args.length === 1) result = inspectProject(args[0]);
    else if (command === 'sha256' && args.length >= 1 && args.length <= 2) { result = await hashFile(...args); if(result.matches===false) process.exitCode=2; }
    else if (command === 'verification-plan') result = verificationPlan();
    else if (command === 'doctor') result = { checkedAt: new Date().toISOString(), swift:probe('/usr/bin/swift',['--version']), developerDirectory:probe('/usr/bin/xcode-select',['-p']), xcode:probe('/usr/bin/xcodebuild',['-version']), simulator:probe('/usr/bin/xcrun',['--find','simctl']) };
    else if (command === 'inspect-ipsw' && args.length === 1) result = inspectIPSW(args[0]);
    else throw new Error('Usage: apple.mjs doctor | route "task" | inspect-project DIRECTORY | verification-plan | sha256 FILE [EXPECTED] | inspect-ipsw FILE');
    process.stdout.write(JSON.stringify(result,null,2)+'\n');
  } catch (error) { process.stderr.write(error.message+'\n'); process.exitCode = 1; }
}
