const http=require('http'),fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'../../public');
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.ico':'image/x-icon'};
http.createServer((req,res)=>{
if(req.url.split('?')[0]==='/api/signup'){res.writeHead(503,{'Content-Type':'application/json; charset=utf-8'});return res.end(JSON.stringify({error:'로컬 디자인 미리보기에서는 사전신청을 접수하지 않습니다.'}));}
let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400);return res.end()}
const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end()}
fs.readFile(file,(err,b)=>{if(err){res.writeHead(404);return res.end('Not found')}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(b)});
}).listen(4184,'127.0.0.1',()=>console.log('Formu design preview: http://127.0.0.1:4184 — signup disabled.'));
