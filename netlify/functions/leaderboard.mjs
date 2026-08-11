import { neon } from "@neondatabase/serverless";
const CONNECTION = process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL || process.env.NEON_DATABASE_URL || "";
const sql = CONNECTION ? neon(CONNECTION) : null;
const GAMES = { g2048:"desc", termo:"desc", mines:"asc", snake:"desc", memory:"asc", velha:"desc", lights:"asc", liga4:"desc", breakout:"desc" };
const CORS = { "content-type":"application/json; charset=utf-8","access-control-allow-origin":"*","access-control-allow-methods":"GET,POST,OPTIONS","access-control-allow-headers":"content-type","cache-control":"no-store" };
let ready=false;
async function ensureTable(){ if(ready)return; await sql`CREATE TABLE IF NOT EXISTS scores (game text NOT NULL, player_id text NOT NULL, name text NOT NULL, value integer NOT NULL, ts bigint NOT NULL, PRIMARY KEY (game, player_id))`; ready=true; }
function sanitizeName(s){ s=String(s==null?"":s).replace(/[\u0000-\u001f\u007f]/g,"").replace(/\s+/g," ").trim(); return s.slice(0,16)||"Anônimo"; }
function json(b,st=200){ return new Response(JSON.stringify(b),{status:st,headers:CORS}); }
export default async (req)=>{
  if(req.method==="OPTIONS") return new Response("",{headers:CORS});
  if(!sql) return json({error:"database not configured",configured:false},503);
  try{
    await ensureTable(); const url=new URL(req.url);
    if(req.method==="GET"){
      const game=url.searchParams.get("game"); if(!GAMES[game]) return json({error:"invalid game"},400);
      let limit=parseInt(url.searchParams.get("limit")||"50",10); if(!Number.isFinite(limit))limit=50; limit=Math.max(1,Math.min(limit,100));
      const rows = GAMES[game]==="asc"
        ? await sql`SELECT player_id,name,value,ts FROM scores WHERE game=${game} ORDER BY value ASC, ts ASC LIMIT ${limit}`
        : await sql`SELECT player_id,name,value,ts FROM scores WHERE game=${game} ORDER BY value DESC, ts ASC LIMIT ${limit}`;
      return json({rows:rows.map(r=>({playerId:r.player_id,name:r.name,value:Number(r.value),ts:Number(r.ts)}))});
    }
    if(req.method==="POST"){
      const body=await req.json().catch(()=>null); if(!body) return json({error:"bad json"},400);
      const game=body.game; if(!GAMES[game]) return json({error:"invalid game"},400);
      const playerId=String(body.playerId||"").slice(0,64); const name=sanitizeName(body.name); const value=Math.round(Number(body.value));
      if(!playerId||!Number.isFinite(value)) return json({error:"invalid payload"},400);
      const ts=Date.now();
      if(GAMES[game]==="asc"){
        await sql`INSERT INTO scores (game,player_id,name,value,ts) VALUES (${game},${playerId},${name},${value},${ts}) ON CONFLICT (game,player_id) DO UPDATE SET name=EXCLUDED.name, value=EXCLUDED.value, ts=EXCLUDED.ts WHERE EXCLUDED.value < scores.value`;
      } else {
        await sql`INSERT INTO scores (game,player_id,name,value,ts) VALUES (${game},${playerId},${name},${value},${ts}) ON CONFLICT (game,player_id) DO UPDATE SET name=EXCLUDED.name, value=EXCLUDED.value, ts=EXCLUDED.ts WHERE EXCLUDED.value > scores.value`;
      }
      return json({ok:true});
    }
    return json({error:"method not allowed"},405);
  }catch(e){ return json({error:String((e&&e.message)||e)},500); }
};
export const config = { path: "/api/leaderboard" };
