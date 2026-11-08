// Project-local wrapper for the installed, pinned official CLI.
const {spawn}=require('child_process'),os=require('os');
try{os.setPriority(process.pid,os.constants.priority.PRIORITY_BELOW_NORMAL)}catch{}
const p=spawn(process.execPath,['C:/Users/Computs/AppData/Local/npm-cache/_npx/110f701c48e68d66/node_modules/hyperframes/bin/hyperframes.mjs',...process.argv.slice(2)],{cwd:__dirname,stdio:'inherit',windowsHide:true,env:{...process.env,HYPERFRAMES_TELEMETRY_DISABLED:'1'}});
try{os.setPriority(p.pid,os.constants.priority.PRIORITY_BELOW_NORMAL)}catch{}
p.on('exit',c=>process.exit(c??1));
