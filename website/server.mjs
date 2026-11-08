import http from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = fileURLToPath(new URL('./public/', import.meta.url));
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.ttf':'font/ttf','.mp4':'video/mp4','.jpg':'image/jpeg','.webp':'image/webp','.vtt':'text/vtt; charset=utf-8'};
const server=http.createServer(async(req,res)=>{
  try {
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
    if(!file.startsWith(root)) {res.writeHead(403).end();return;}
    const info=await stat(file); if(!info.isFile()) {res.writeHead(404).end();return;}
    const data=await readFile(file);
    const headers={'Content-Type':types[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':'no-cache','Accept-Ranges':'bytes'};
    const range=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
    if(range){const start=Number(range[1]),end=Math.min(range[2]?Number(range[2]):data.length-1,data.length-1);if(start>end){res.writeHead(416,{'Content-Range':`bytes */${data.length}`}).end();return;}res.writeHead(206,{...headers,'Content-Length':end-start+1,'Content-Range':`bytes ${start}-${end}/${data.length}`});res.end(req.method==='HEAD'?undefined:data.subarray(start,end+1));return;}
    res.writeHead(200,{...headers,'Content-Length':data.length});res.end(req.method==='HEAD'?undefined:data);
  }catch{res.writeHead(404).end('Not found');}
});
server.listen(4190,'127.0.0.1',()=>console.log('VISION preview: http://127.0.0.1:4190'));
