'use client';
import { useId } from 'react';
import { findTile, pointKey, type Journey, type MapMission } from '@/data/directions-game';
import { DirectionReadout, useDirectionLearning } from './DirectionLearning';

export function CallerAvatar({ alternate = false }: { alternate?: boolean }) {
  return <svg viewBox="-30 -36 60 72" aria-hidden="true"><Person alternate={alternate}/></svg>;
}
function Person({ alternate = false }: { alternate?: boolean }) {
  return <g stroke="#233c36" strokeWidth="1.6" strokeLinejoin="round">
    <ellipse cy="27" rx="18" ry="4" fill="#18382c" opacity=".15" stroke="none"/>
    <path d="M-11 15v10h8l3-10 3 10h8V15" fill="#273f39"/>
    <rect x="-17" y="0" width="34" height="19" rx="9" fill={alternate ? '#e7aa52' : '#54a68b'}/>
    <path d="M-9 4v10M9 4v10" stroke="#f9e7bf" strokeWidth="3"/>
    <rect x="-18" y="-26" width="36" height="34" rx="16" fill="#f3ceaa"/>
    <path d={alternate ? 'M-18-10v-11q2-15 20-12 19 1 16 22L5-24-5-15-12-20Z' : 'M-18-7q-9-27 12-27 28-2 24 28l-7-13q-7 6-19-2l-5 15Z'} fill="#273c35"/>
    <path d="M-7-6v2M7-6v2" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M-3 0q3 3 6 0" fill="none" strokeLinecap="round"/>
    <ellipse cx="-12" cy="-1" rx="3" ry="1.5" fill="#e7a38d" stroke="none"/><ellipse cx="12" cy="-1" rx="3" ry="1.5" fill="#e7a38d" stroke="none"/>
    <rect x="14" y="-6" width="7" height="13" rx="2" fill="#365c50"/><path d="M17-3v5" stroke="#c0e5c1"/>
  </g>;
}
function Building({ kind, destination = false }: { kind: 'gate' | 'shop' | 'home'; destination?: boolean }) {
  return <g stroke="#405c50" strokeWidth="1.4" strokeLinejoin="round">
    <ellipse cy="15" rx="25" ry="5" fill="#254e3e" opacity=".12" stroke="none"/>
    <rect x="-20" y="-12" width="40" height="27" rx="2" fill={destination ? '#fce5ad' : '#e9e6cc'}/>
    <path d={kind === 'gate' ? 'M-24-14v-6h48v6ZM-16-14V15M16-14V15' : 'M-25-12 0-28 25-12Z'} fill={destination ? '#d77850' : '#6f9984'}/>
    {kind === 'shop' ? <path d="M-21-7h42v7h-42Z" fill="#e2a06b"/> : <path d="M-13-6h6v6h-6ZM7-6h6v6H7Z" fill="#98c2ad"/>}
    <path d="M-5 15V3H5v12" fill="#688d78"/>
    {destination && <><path d="M0-28v-16"/><path d="M0-44 17-40 0-35Z" fill="#ecaa43"/></>}
  </g>;
}
export function DirectionMap({ mission, journey, preview = false }: { mission: MapMission; journey: Journey; preview?: boolean }) {
  const id = useId().replace(/:/g, '');
  const goal = findTile(mission, 'G');
  const { showReading } = useDirectionLearning();
  return <div className="directions-map-stage"><svg className={`direction-map ${mission.theme}`} viewBox="0 0 540 540" role="img" aria-label={`Mapa de ${mission.destination}. Personaje en fila ${journey.position.y + 1}, columna ${journey.position.x + 1}. El norte está arriba.`}>
    <defs><pattern id={`${id}-grass`} width="30" height="30" patternUnits="userSpaceOnUse"><path d="m8 10 2-3 2 3m12 13 2-3" stroke="currentColor" strokeWidth="1.4" fill="none" opacity=".12"/></pattern></defs>
    <rect width="540" height="540" rx="22" className="map-grass"/>
    <rect width="540" height="540" rx="22" fill={`url(#${id}-grass)`}/>
    {mission.grid.flatMap((row, y) => [...row].map((tile, x) => {
      const key = pointKey({ x, y }), visited = journey.visited.includes(key);
      return <g key={key} transform={`translate(${x * 60 + 30} ${y * 60 + 30})`}>
        {tile === '#' ? <g aria-hidden="true">{(x * 3 + y) % 3 !== 0 && <>
          <ellipse cy="13" rx="16" ry="5" fill="#2b6144" opacity=".12"/>
          <path d="M0 0v14" stroke="#7c8160" strokeWidth="4"/>
          <ellipse cy="-4" rx={(x + y) % 2 ? 15 : 12} ry="18" className="map-tree"/>
          <path d="M-5-12q-6 7-3 12" stroke="#f4f4cc" opacity=".25" strokeWidth="3" fill="none" strokeLinecap="round"/>
        </>}{(x + y) % 7 === 0 && <g fill="#f7df9c"><circle cx="-17" cy="17" r="2"/><circle cx="-12" cy="13" r="2"/></g>}</g> : <>
          <rect x="-29" y="-29" width="58" height="58" rx="9" className="map-path"/>
          {visited && tile === '.' && !preview && <g fill="#859c79" opacity=".5"><ellipse cx="-3" cy="2" rx="2" ry="3"/><ellipse cx="4" cy="-3" rx="2" ry="3"/></g>}
          {tile === 'X' && <g><ellipse cy="3" rx="24" ry="16" fill="#bd976f"/><ellipse cy="1" rx="21" ry="13" fill="#293e37"/><ellipse cy="4" rx="14" ry="7" fill="#142c26"/><path d="m-21-13 7-5m5-2 8-1m6 1 8 4" stroke="#e6a03c" strokeWidth="5"/><path d="m-20-13 3-2m12-5 3-.5m13 2 3 1.5" stroke="#37483a" strokeWidth="5"/></g>}
          {tile === '*' && !journey.collected.includes(key) && <g className="map-star"><circle r="15" fill="#eeb852" stroke="#c18532" strokeWidth="2"/><path d="m0-9 3 6 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1Z" fill="#fff2ba"/></g>}
          {tile === 'C' && <g><circle r="20" fill="#a5cfad" opacity=".45"/><path d="M-16 12 0-15 16 12Z" fill="#6b9e78" stroke="#41634a" strokeWidth="1.5"/><path d="M-6 12 0-2 6 12" fill="#f9e5b1"/><path d="M0-15v-9l12 4-12 4" fill="#e3ab49" stroke="#41634a" strokeWidth="1.5"/></g>}
          {tile === 'G' && <Building kind={mission.id === 'canteen' ? 'shop' : 'home'} destination/>}
          {x === mission.landmark.at.x && y === mission.landmark.at.y && <Building kind={mission.landmark.kind}/>}
        </>}
      </g>;
    }))}
    <g className="map-player-position" style={{ transform: `translate(${journey.position.x * 60 + 30}px, ${journey.position.y * 60 + 28}px)` }}>
      <g className={journey.status === 'fallen' || journey.status === 'lost' ? 'map-player-falling' : journey.status === 'won' ? 'map-player-happy' : ''}>
        <circle cy="6" r="25" fill="#fff8e5" opacity=".7"/>
        <g transform="scale(.72)"><Person alternate={mission.caller === '大为'}/></g>
        {mission.relative && <g transform={`rotate(${journey.heading * 90})`}><path d="m0-37-7 10h14Z" fill="#e77b41" stroke="#fff4d6" strokeWidth="2"/></g>}
      </g>
    </g>
    <g transform="translate(270 26)" className="map-north" aria-hidden="true"><path d="m0-9-7 17 7-4 7 4Z" fill="currentColor"/></g>
  </svg>
    {[{ at: goal, text: mission.destination, target: true }, { at: mission.landmark.at, text: mission.landmark.hanzi, target: false }].map(label => <div key={label.text} className={`directions-map-label${label.target ? ' target' : ''}`} style={{ left: `clamp(58px, ${(label.at.x * 60 + 30) / 540 * 100}%, calc(100% - 58px))`, top: `${(label.at.y * 60 + 51) / 540 * 100}%` }}>{showReading && <span className="directions-map-label-kind">{label.target ? '⚑ DESTINO' : 'SALIDA'}</span>}<DirectionReadout text={label.text}/></div>)}
  </div>;
}
