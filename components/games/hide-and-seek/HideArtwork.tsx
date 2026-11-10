import type { Animal, HidePosition } from '@/lib/hide-and-seek';

export function AnimalArt({ animal, className = '' }: { animal: Animal; className?: string }) {
  const color = animal === 'dog' ? '#d89451' : animal === 'cat' ? '#edb05f' : '#fff7e7';
  return <svg className={className} viewBox="0 0 140 150" fill="none" aria-hidden="true">
    <ellipse cx="70" cy="135" rx="44" ry="9" fill="#244c3a" opacity=".13"/>
    {animal === 'mouse' ? <>
      <path d="M94 123c35 21 48-9 30-18-10-5-15 1-11 7" stroke="#ceaaa0" strokeWidth="5" strokeLinecap="round"/>
      <ellipse cx="68" cy="111" rx="30" ry="28" fill="#a6aaa0"/>
      <ellipse cx="68" cy="116" rx="17" ry="20" fill="#ede9dc"/>
      <circle cx="39" cy="46" r="23" fill="#a6aaa0"/><circle cx="98" cy="46" r="23" fill="#a6aaa0"/>
      <circle cx="39" cy="46" r="15" fill="#e2b6ac"/><circle cx="98" cy="46" r="15" fill="#e2b6ac"/>
      <path d="M33 70c0-21 70-21 70 0 0 17-20 34-35 34S33 87 33 70Z" fill="#b9bcb1"/>
      <ellipse cx="68" cy="88" rx="19" ry="15" fill="#ede9dc"/>
      <circle cx="52" cy="73" r="4" fill="#34483b"/><circle cx="85" cy="73" r="4" fill="#34483b"/>
      <circle cx="51" cy="72" r="1.3" fill="white"/><circle cx="84" cy="72" r="1.3" fill="white"/>
      <ellipse cx="68" cy="85" rx="5" ry="4" fill="#c98d83"/>
      <path d="M68 89v4m-7 0q7 7 14 0m-31-8-16-4m16 10-17 1m65-7 16-4m-16 10 17 1" stroke="#747e70" strokeWidth="2" strokeLinecap="round"/>
      <ellipse cx="48" cy="134" rx="13" ry="6" fill="#ceaaa0"/><ellipse cx="87" cy="134" rx="13" ry="6" fill="#ceaaa0"/>
      <path d="m45 108 9 10m36-10-9 10" stroke="#8e9789" strokeWidth="3" strokeLinecap="round"/>
      <path d="m53 103 15 7 15-7-2 14-13-6-13 6Z" fill="#367e68"/>
    </> : <>
      {animal === 'cat' && <path d="M101 118c41 11 30-40 19-29" stroke={color} strokeWidth="15" strokeLinecap="round"/>}
      <ellipse cx="70" cy="110" rx="32" ry="30" fill={color}/><ellipse cx="70" cy="115" rx="18" ry="20" fill="#fff8e9"/>
      {animal === 'rabbit' && <><ellipse cx="49" cy="38" rx="12" ry="34" transform="rotate(-12 49 38)" fill={color}/><ellipse cx="88" cy="36" rx="12" ry="35" transform="rotate(9 88 36)" fill={color}/><ellipse cx="49" cy="33" rx="5" ry="21" transform="rotate(-12 49 33)" fill="#efb6ac"/><ellipse cx="89" cy="31" rx="5" ry="22" transform="rotate(9 89 31)" fill="#efb6ac"/><circle cx="105" cy="119" r="13" fill={color}/></>}
      {animal === 'cat' && <><path d="m35 67 2-39 28 24m11 0 29-24 1 40" fill={color}/><path d="m42 51 1-13 12 15m34 0 11-15 0 15" fill="#d7826c"/></>}
      <ellipse cx="70" cy="76" rx="37" ry="32" fill={color}/>
      {animal === 'dog' && <><ellipse cx="33" cy="66" rx="13" ry="27" transform="rotate(15 33 66)" fill="#875a3b"/><ellipse cx="107" cy="66" rx="13" ry="27" transform="rotate(-15 107 66)" fill="#875a3b"/><path d="M61 47q8-6 18 0l-5 29H64Z" fill="#fff8e9"/></>}
      <circle cx="55" cy="75" r="4" fill="#34483b"/><circle cx="86" cy="75" r="4" fill="#34483b"/><circle cx="54" cy="74" r="1.3" fill="white"/><circle cx="85" cy="74" r="1.3" fill="white"/>
      <ellipse cx="44" cy="86" rx="8" ry="5" fill="#eea99c" opacity=".65"/><ellipse cx="97" cy="86" rx="8" ry="5" fill="#eea99c" opacity=".65"/>
      <path d="m65 85 5 5 5-5" fill={animal === 'dog' ? '#34483b' : '#ca8c7b'}/><path d="M70 90v3m-9 0q5 7 9 0 5 7 10 0" stroke="#59604b" strokeWidth="2" strokeLinecap="round"/>
      {animal === 'cat' && <path d="m27 85 19 3m-20 6 19-2m51-4 19-3m-19 7 20 2M64 48l3 10m9-10-2 10" stroke="#a76c39" strokeWidth="2.5" strokeLinecap="round"/>}
      <ellipse cx="49" cy="134" rx="16" ry="7" fill={color}/><ellipse cx="90" cy="134" rx="16" ry="7" fill={color}/>
      <path d="m48 105 8 11m35-11-8 11" stroke={animal === 'rabbit' ? '#e3d8bf' : '#bd844b'} strokeWidth="3" strokeLinecap="round"/>
      <path d="m54 103 16 7 16-7-2 15-14-7-14 7Z" fill="#367e68"/>
    </>}
  </svg>;
}

export function GardenBackdrop() {
  return <svg className="hide-backdrop" viewBox="0 0 800 540" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="800" height="540" fill="#e4efe0"/>
    <circle cx="655" cy="83" r="42" fill="#ffe4a0"/>
    <path d="M0 213Q121 96 254 210T515 183 800 171V540H0Z" fill="#bdd5b5"/>
    <path d="M0 268Q180 163 379 250T800 224V540H0Z" fill="#cfe0bf"/>
    <path d="M0 343Q198 287 414 342T800 312V540H0Z" fill="#dde7bd"/>
    <path d="M370 540q160-100 53-156t-18-141" fill="none" stroke="#efe4c4" strokeWidth="79"/>
    <g stroke="#a4bd93" strokeWidth="9" strokeLinecap="round" opacity=".75"><path d="M25 226v65m54-76v65m54-77v65m54-75v65m430-52v65m54-76v65m54-77v65m54-75v65"/><path d="m0 247 215-38m390 37 195-30" strokeWidth="6"/></g>
    <g fill="#98bc8f"><ellipse cx="32" cy="150" rx="61" ry="80"/><ellipse cx="755" cy="178" rx="82" ry="88"/></g>
    <g fill="#739e7c"><ellipse cx="0" cy="210" rx="56" ry="59"/><ellipse cx="800" cy="253" rx="59" ry="66"/></g>
    <g fill="#fffbed" opacity=".8"><path d="M116 83c-7-16 20-28 31-11 16-25 45-6 39 8 31 1 31 23 8 23h-78c-24-1-24-18 0-20Z"/><path d="M370 54c-5-13 16-22 24-9 13-19 36-4 31 7 24 0 24 18 6 18h-61c-19-1-19-14 0-16Z"/></g>
    <ellipse cx="402" cy="384" rx="172" ry="29" fill="#718b57" opacity=".13"/>
    {[ [75,425], [195,470], [650,460], [728,390], [224,332], [570,491], [99,360] ].map(([x,y],i) => <g key={x} transform={`translate(${x} ${y})`}><path d="M0 0v-15m0 12-7-6m7 3 7-7" stroke="#7ca16d" strokeWidth="2" strokeLinecap="round"/><circle cy="-18" r="6" fill={i%2 ? '#f4ba9c' : '#fff9db'}/><circle cy="-18" r="2" fill="#d5a34c"/></g>)}
    <g fill="#90ac77"><path d="m29 491 7-16 1 17 9-11-5 13m688 14 7-16 1 17 9-11-5 13m-551-95 7-16 1 17 9-11-5 13"/></g>
    <path d="m245 101 7-5 7 5m289 30 7-5 7 5" stroke="#7d9b86" strokeWidth="2" fill="none" strokeLinecap="round"/>
  </svg>;
}
export function PicnicTable() {
  return <svg className="hide-table" viewBox="0 0 800 540" aria-hidden="true">
    <path d="m291 258-5 89h17l8-89m175 0 6 89h17l-3-89" fill="#9b6a44"/>
    <path d="m264 287-13 101h19l19-101m204 0 13 101h19l-8-101" fill="#b47c4c"/>
    <path d="M273 344h233v12H273Z" fill="#a57349"/>
    <path d="M270 228h240l55 55H225Z" fill="#deb582"/>
    <path d="M225 283h340v17H225Z" fill="#b88350"/>
    <path d="m262 240 260 0m-273 14h287m-301 15h315" stroke="#c59461" strokeWidth="2"/>
    <path d="M229 284h332" stroke="#eecb96" strokeWidth="3"/>
    <path d="m280 260 38-2-3 21-37 1Z" fill="#f3eee0"/><path d="m286 255 36 1-5 19-35-1Z" fill="#6c9c89"/><path d="m287 259 31 1" stroke="#aac6b3" strokeWidth="2"/>
    <path d="m474 249 5-22h14l5 22Z" fill="#cf8363"/><path d="M486 228v-24m0 13q-18 2-14-13 14 0 14 13m0-5q17-2 14-15-15 1-14 15" stroke="#5a8d64" strokeWidth="3" fill="#76a275"/>
  </svg>;
}
export function HidingPlace({ position, open }: { position: HidePosition; open: boolean }) {
  const bush = ['left','right','behind','front'].includes(position);
  return <svg className={`hide-cover ${open ? 'is-open' : ''}`} viewBox="0 0 140 95" aria-hidden="true">
    <ellipse cx="70" cy="84" rx="60" ry="9" fill="#3a6340" opacity=".16"/>
    {bush ? <><path d="M14 78C-2 58 21 29 42 41 40 9 91 7 100 40c28-15 51 21 29 38Z" fill={position === 'behind' ? '#6e9d74' : '#7ea56a'}/><path d="M17 78C5 59 28 49 43 61 53 32 86 39 94 59c22-19 47 2 33 19Z" fill="#92b478"/><path d="m38 70 5-9m16 12 6-12m32 9-5-11" stroke="#6a965e" strokeWidth="3" strokeLinecap="round"/><g fill="#edc19c"><circle cx="31" cy="57" r="3"/><circle cx="88" cy="39" r="3"/><circle cx="114" cy="64" r="3"/></g></> : <><path d="m21 43 9 38h80l10-38Z" fill={position === 'above' ? '#c5925a' : '#b48367'}/><path d="M31 53h78M34 65h73m-58-20 4 35m18-35v35m18-35-4 35" stroke="#e6bb7f" strokeWidth="3" opacity=".8"/><g className="hide-basket-lid"><path d="M18 40q52-39 104 0v9H18Z" fill="#e4bd83"/><path d="M58 21v-6h24v6" stroke="#976d42" strokeWidth="5" strokeLinejoin="round"/><path d="M25 41h90" stroke="#f2d6a4" strokeWidth="3"/></g></>}
  </svg>;
}
