#!/usr/bin/env node
import fs from 'node:fs';import path from 'node:path';import {spawn} from 'node:child_process';
const directory=process.env.REVERSE_LAB_REA_DIRECTORY;
if(!directory||!path.isAbsolute(directory)){console.error('Set REVERSE_LAB_REA_DIRECTORY to your independently installed rea-agents6.8.0 package. Reverse Lab does not download an engine.');process.exit(1);}
const [major,minor,patch]=process.versions.node.split('.').map(Number);const compatible=major===22&&(minor>23||minor===23&&patch>=4)||major===24&&(minor>22||minor===22&&patch>=1)||major===26&&(minor>12||minor===12&&patch>=1)||major>26;
if(!compatible){console.error('REA6.8.0 requires Node ^22.23.4 || ^24.22.1 || >=26.12.1. Use an existing compatible runtime.');process.exit(1);}
let pkg;try{pkg=JSON.parse(fs.readFileSync(path.join(directory,'package.json'),'utf8'));}catch{console.error('Cannot read the selected REA package.');process.exit(1);}
if(pkg.name!=='rea-agents'||pkg.version!=='6.8.0'){console.error('This bridge qualifies rea-agents6.8.0 only. Review and test other versions before changing the pin.');process.exit(1);}
const entry=path.join(directory,'scripts/rea.mjs');if(!fs.statSync(entry).isFile())throw Error('REA entrypoint is not a regular file');
const child=spawn(process.execPath,[entry,'mcp'],{stdio:'inherit'});child.on('error',e=>{console.error(e.message);process.exitCode=1;});child.on('exit',(code,signal)=>{process.exitCode=code??(signal?1:0);});for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>{if(child.exitCode===null&&!child.killed)child.kill(signal);});
