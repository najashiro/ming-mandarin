import { timeTokens } from '@/data/time-game';
const syllables = new Map(timeTokens.map(t=>[t.pinyin.normalize('NFD').replace(/[\u0300-\u036f]/g,''),t.hanzi]));
const aliases:Record<string,string> = {liang:'两',er:'二',ling:'零',dian:'点',fen:'分',ban:'半',ke:'刻',cha:'差',shi:'十',yi:'一'};
export function normalizeTimeSpeech(transcript:string):string[] {
  const hanzi=transcript.replace(/现在/g,'').replace(/點/g,'点').replace(/兩/g,'两').replace(/分鐘/g,'分').replace(/[^\u3400-\u9fff]/g,'');
  if(hanzi) return [...hanzi].every(char=>timeTokens.some(token=>token.hanzi===char))?[...hanzi]:[];
  const latin=transcript.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/xian\s*zai/g,'').replace(/[^a-z ]/g,' ').trim();
  if(!latin) return [];
  const words=latin.split(/\s+/);
  const keys=[...new Set([...syllables.keys(),...Object.keys(aliases)])].sort((a,b)=>b.length-a.length);
  const mapped:string[]=[];
  for(const word of words) {
    const parse=(rest:string):string[]|null=>{
      if(!rest)return [];
      for(const key of keys){if(!rest.startsWith(key))continue;const tail=parse(rest.slice(key.length));if(tail)return [syllables.get(key)??aliases[key],...tail];}
      return null;
    };
    const chars=parse(word);if(!chars)return [];
    mapped.push(...chars);
  }
  return mapped;
}
