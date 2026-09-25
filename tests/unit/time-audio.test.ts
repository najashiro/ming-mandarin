import { describe,expect,it,vi,afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { audioForMandarinText } from '@/lib/mandarin-audio';
import { buildAcceptedTimeAnswers } from '@/lib/time-game';
import { timeAudioFile, timeAudioKey } from '@/lib/time-audio-key.mjs';
import { playTimeAudio, stopTimeAudio } from '@/lib/time-audio';
import manifest from '@/data/time-audio.json';

afterEach(()=>{stopTimeAudio();vi.unstubAllGlobals();});
describe('time audio manifest',()=>{
  it('reuses recorded tokens and resolves the question and whole phrase',()=>{
    expect(audioForMandarinText('三')).toMatch(/^\/audio\/mandarin\//);
    expect(audioForMandarinText('现在')).toMatch(/^\/audio\/mandarin\//);
    expect(audioForMandarinText('现在几点？')).toBe(`/audio/mandarin/${timeAudioFile('现在几点？','q')}`);
    expect(audioForMandarinText('现在三点一刻')).toBe(`/audio/mandarin/${timeAudioFile('现在三点一刻','s')}`);
    expect(timeAudioKey('现在三点一刻')).toBe(timeAudioKey('现在三点一刻'));
  });
  it('covers every accepted answer once with stable keys and contextual pinyin',()=>{
    const entries=new Map(manifest.clips.map(clip=>[clip.input,clip]));
    expect(entries.size).toBe(manifest.clips.length);
    for(let hour=1;hour<=12;hour++)for(let minute=0;minute<60;minute++)for(const answer of buildAcceptedTimeAnswers(hour,minute)){
      const text=`现在${answer.hanzi}`;
      expect(entries.get(text)?.file).toBe(timeAudioFile(text,'s'));
      expect(entries.get(text)?.expectedPinyin).toBe(`xiànzài ${answer.pinyin}`);
    }
    expect(entries.get('现在三点一刻')?.expectedPinyin).toContain('yí kè');
  });
  it('synchronizes deterministically',()=>{
    const before=readFileSync('data/time-audio.json','utf8');
    execFileSync(process.execPath,['scripts/sync-time-audio-manifest.mjs']);
    expect(JSON.parse(readFileSync('data/time-audio.json','utf8'))).toEqual(JSON.parse(before));
  });
});
describe('time playback',()=>{
  it('waits for ended before resolving and uses the selected whole phrase',async()=>{
    const ended:{current:(()=>void)|null}={current:null};
    const source:string[]=[];
    class MockAudio {
      onended:(()=>void)|null=null;onerror:(()=>void)|null=null;
      constructor(src:string){source.push(src);}
      play(){ended.current=()=>this.onended?.();return Promise.resolve();}
      pause(){}
    }
    vi.stubGlobal('window',{setTimeout,cancelAnimationFrame:()=>{},speechSynthesis:{cancel:()=>{}}});vi.stubGlobal('Audio',MockAudio);
    let resolved=false;
    const pending=playTimeAudio('现在三点一刻').then(()=>{resolved=true;});
    await Promise.resolve();expect(resolved).toBe(false);
    expect(source[0]).toBe(audioForMandarinText('现在三点一刻'));
    ended.current?.();await pending;expect(resolved).toBe(true);
  });
  it('falls back to an explicit Chinese voice after a missing MP3',async()=>{
    const voice={lang:'zh-CN'};
    const spoken:string[]=[];
    class BrokenAudio {onended=null;onerror=null;play(){return Promise.reject(new Error('404'));}pause(){}}
    class Utterance {lang='';voice:unknown;rate=1;onend:(()=>void)|null=null;onerror:null=null;constructor(public text:string){}}
    vi.stubGlobal('window',{setTimeout,speechSynthesis:{getVoices:()=>[voice],cancel:()=>{},speak:(u:Utterance)=>{spoken.push(u.text);queueMicrotask(()=>u.onend?.());}}});
    vi.stubGlobal('Audio',BrokenAudio);vi.stubGlobal('SpeechSynthesisUtterance',Utterance);
    await playTimeAudio('现在三点一刻');expect(spoken).toEqual(['现在三点一刻']);
  });
});
