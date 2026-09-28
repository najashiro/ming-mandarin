// Local-only fake Supabase; production authentication remains unchanged.
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
const rows = new Map();
let offline = false;
const backend = createServer(async (request, response) => {
  const url = new URL(request.url,'http://127.0.0.1');
  const send = (status, body) => { response.writeHead(status,{'content-type':'application/json'}); response.end(JSON.stringify(body)); };
  let raw=''; for await (const chunk of request) raw+=chunk;
  if(url.pathname==='/reset') {rows.clear();offline=false;return send(200,{});}
  if(url.pathname==='/offline') {offline=JSON.parse(raw).offline;return send(200,{});}
  if(url.pathname==='/auth/v1/user') {
    if(request.headers.authorization!=='Bearer image-review-test-admin') return send(401,{});
    return send(200,{id:'11111111-1111-4111-8111-111111111111',email:'reviewer@example.test',app_metadata:{role:'admin'},user_metadata:{full_name:'Revisor de prueba'}});
  }
  if(offline) return send(503,{message:'Storage unavailable'});
  if(url.pathname==='/rest/v1/vocabulary_image_reviews') return send(200,[...rows.values()]);
  if(url.pathname==='/rest/v1/rpc/save_vocabulary_image_review') {
    const input=JSON.parse(raw), previous=rows.get(input.p_word_id);
    if((previous?.revision??0)!==input.p_expected_revision) return send(200,{conflict:true});
    const row={word_id:input.p_word_id,status:input.p_status,prompt:input.p_prompt,
      asset_sha256:input.p_asset_sha256,prompt_sha256:input.p_prompt_sha256,
      reviewed_at:new Date().toISOString(),revision:input.p_expected_revision+1};
    rows.set(row.word_id,row);return send(200,{row});
  }
  return send(200,[]);
});
backend.listen(4401,'127.0.0.1');
const app=spawn(process.execPath,['node_modules/next/dist/bin/next','start','-p','3103'],{
  stdio:'inherit',env:{...process.env,SUPABASE_URL:'http://127.0.0.1:4401',
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:'local-fixture',SUPABASE_SECRET_KEY:'local-fixture'},
});
const stop=()=>{app.kill();backend.close();};
process.on('SIGTERM',stop);process.on('SIGINT',stop);
app.on('exit',()=>backend.close());
