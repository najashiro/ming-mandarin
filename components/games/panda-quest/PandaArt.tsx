type ArtProps = { className?: string };

function PandaFigure() {
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="40" cy="72" rx="24" ry="5" fill="#294C3D" opacity=".14" />
      <rect x="53" y="36" width="17" height="26" rx="7" fill="#B56849" />
      <path d="M57 39v-4c0-5 8-5 8 0v4" fill="none" stroke="#854E3B" strokeWidth="3" />
      <path d="M58 45h9v10h-9z" fill="#D79062" />
      <path d="M30 58c-7 0-12 5-10 11 1 4 11 5 17 1l2-9M48 58c7 0 14 4 13 10-1 5-11 6-17 2l-2-9" fill="#293D38" />
      <ellipse cx="40" cy="52" rx="22" ry="19" fill="#293D38" />
      <ellipse cx="41" cy="53" rx="15" ry="18" fill="#FFF9E9" />
      <path d="M21 43c-7 4-9 12-5 15 4 3 10-3 14-8M59 43c7 4 9 10 5 14-3 3-8-2-12-7" fill="#293D38" />
      <circle cx="23" cy="17" r="10" fill="#293D38" />
      <circle cx="57" cy="17" r="10" fill="#293D38" />
      <circle cx="23" cy="17" r="5" fill="#54625A" />
      <circle cx="57" cy="17" r="5" fill="#54625A" />
      <path d="M40 12c-17 0-26 10-26 24 0 15 11 23 26 23s26-8 26-23c0-14-9-24-26-24Z" fill="#FFF9E9" />
      <path d="M18 43c5 10 14 13 24 13 10 0 18-3 23-12-3 10-12 15-25 15-12 0-21-5-24-14Z" fill="#EDE7D5" />
      <ellipse cx="29" cy="33" rx="8" ry="10" transform="rotate(27 29 33)" fill="#293D38" />
      <ellipse cx="51" cy="33" rx="8" ry="10" transform="rotate(-27 51 33)" fill="#293D38" />
      <ellipse cx="30" cy="33" rx="3" ry="4" fill="#FFFDF3" />
      <ellipse cx="50" cy="33" rx="3" ry="4" fill="#FFFDF3" />
      <circle cx="31" cy="34" r="2" fill="#172B25" />
      <circle cx="49" cy="34" r="2" fill="#172B25" />
      <circle cx="30" cy="32" r="1" fill="white" />
      <circle cx="48" cy="32" r="1" fill="white" />
      <ellipse cx="22" cy="43" rx="4" ry="2.5" fill="#EBA68A" opacity=".7" />
      <ellipse cx="58" cy="43" rx="4" ry="2.5" fill="#EBA68A" opacity=".7" />
      <path d="M35 42q5-4 10 0-1 5-5 5t-5-5" fill="#293D38" />
      <path d="M40 47v2m-5 0q5 5 10 0" fill="none" stroke="#293D38" strokeWidth="1.8" />
      <path d="m56 56-3 7" stroke="#B56849" strokeWidth="3" />
    </g>
  );
}

function BambooCluster() {
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="40" cy="72" rx="22" ry="4" fill="#294C3D" opacity=".13" />
      <path d="m27 70-1-48m15 49 2-62m11 60 5-42" fill="none" stroke="#579165" strokeWidth="6" />
      <path d="m24 34 4 0m-4 14 4 0m-3 14h4m11-41 5 0m-5 16 5 0m-5 16h4m-4 13h4m11-26 5 0m-7 16 5 0" fill="none" stroke="#BCD399" strokeWidth="2" />
      <path d="M43 22Q28 25 26 9q13 1 17 13M44 31Q50 13 65 17q-5 13-21 14M27 43Q11 44 8 30q12-2 19 13M29 54Q30 39 41 38q1 11-12 16M56 47Q62 29 74 33q-3 13-18 14M44 53Q32 52 32 41q10 0 12 12M57 61Q69 48 75 53q-4 11-18 8" fill="#357653" />
      <path d="M41 16Q48 5 54 8q-1 10-13 8M27 31Q14 25 18 17q11 2 9 14M58 38Q48 37 49 28q9-1 9 10" fill="#79A869" />
    </g>
  );
}

function ForestTree() {
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="40" cy="72" rx="23" ry="5" fill="#294C3D" opacity=".13" />
      <path d="m34 69 3-29h7l3 29-7 4Z" fill="#916E4C" />
      <path d="m40 52-10-9m11 3 10-9" fill="none" stroke="#916E4C" strokeWidth="5" />
      <path d="M14 48C2 41 8 26 18 23 17 11 29 4 40 10 52 1 66 13 62 25c14 4 16 21 4 28-7 5-17 3-22-1-10 8-23 6-30-4Z" fill="#3D7553" />
      <path d="M14 39c0-8 7-12 13-12-3-9 6-15 14-11 6-7 18-2 17 7 9 1 13 7 11 13-10 6-21 5-30 0-8 7-17 7-25 3Z" fill="#6A9B64" />
      <path d="M26 24q4-6 10-3m11-3q5-1 7 3" fill="none" stroke="#A0BA7D" strokeWidth="3" />
      <circle cx="20" cy="48" r="2" fill="#8BA96C" />
      <circle cx="59" cy="45" r="3" fill="#8BA96C" />
    </g>
  );
}

function ForestGate({ open = false }: { open?: boolean }) {
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="40" cy="73" rx="31" ry="4" fill="#294C3D" opacity=".13" />
      <path d="m21 64 19-8 20 8v6l-20 9-19-9Z" fill="#DDD1AE" />
      <path d="m21 64 19-8 20 8-20 9Z" fill="#F7EDCA" />
      <path d="M20 25h7v42h-7zM53 25h7v42h-7z" fill="#B2684E" />
      <path d="M25 29h30v6H25z" fill="#CC8159" />
      <path d="M20 65h9v5H18v-5Zm32 0h10v5H51v-5Z" fill="#8B5142" />
      <path d="M12 26q15-4 28-15 13 11 28 15l-4 8H16Z" fill="#3B6C50" />
      <path d="M9 22q17 2 31-12 14 14 31 12l-4 7q-15-1-27-10-12 9-27 10Z" fill="#6F9670" />
      <path d="M9 22q17 2 31-12 14 14 31 12" fill="none" stroke="#A7BB85" strokeWidth="2" />
      <rect x="31" y="27" width="18" height="9" rx="2" fill="#E8CB8E" />
      <path d="M37 31h6" stroke="#9A6D42" strokeWidth="2" />
      <path d="M18 35v6m44-6v6" stroke="#B2684E" strokeWidth="2" />
      <ellipse cx="18" cy="45" rx="5" ry="6" fill="#DC9970" />
      <ellipse cx="62" cy="45" rx="5" ry="6" fill="#DC9970" />
      <path d="M17 51v4m46-4v4" stroke="#D7AD65" strokeWidth="2" />
      {open ? (
        <g fill="#F2CA72">
          <path d="m40 43 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" />
          <circle cx="33" cy="59" r="2" />
          <circle cx="48" cy="41" r="1.5" />
        </g>
      ) : (
        <g>
          <path d="M29 43h22v20H29Z" fill="#A67951" />
          <path d="m29 44 22 17m0-17L29 61M40 44v19" fill="none" stroke="#D4AB75" strokeWidth="3" />
          <rect x="36" y="49" width="8" height="9" rx="2" fill="#E9C67D" />
          <path d="M38 49v-2a2 2 0 0 1 4 0v2" fill="none" stroke="#E9C67D" strokeWidth="2" />
          <circle cx="40" cy="53" r="1.3" fill="#926B41" />
        </g>
      )}
    </g>
  );
}

export function PandaSprite({ className }: ArtProps) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" aria-hidden="true" focusable="false">
      <PandaFigure />
    </svg>
  );
}

export function QuestTileArt({ kind, className }: ArtProps & { kind: 'tree' | 'gate' | 'bamboo' | 'exit' }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" aria-hidden="true" focusable="false">
      {kind === 'tree' && <ForestTree />}
      {kind === 'bamboo' && <BambooCluster />}
      {(kind === 'gate' || kind === 'exit') && <ForestGate open={kind === 'exit'} />}
    </svg>
  );
}

export function PandaLandscape({ className }: ArtProps) {
  return (
    <svg className={className} viewBox="0 0 640 360" fill="none" aria-hidden="true" focusable="false">
      <path d="M0 0h640v360H0z" fill="#E9EDDB" />
      <circle cx="481" cy="66" r="31" fill="#EDCC83" />
      <circle cx="481" cy="66" r="45" stroke="#F3E3B6" strokeWidth="1.5" />
      <path d="M0 180 72 101q13-13 26 0l68 67 72-88q12-14 23 1l80 103 57-70q10-14 22 0l55 66 67-56q14-10 23 2l75 71v96H0Z" fill="#CBDAC4" />
      <path d="m0 215 76-52q12-8 24 0l72 56 62-70q13-13 24 0l71 71 74-58q15-10 27 2l64 52 76-53q13-9 24 3l46 47v98H0Z" fill="#B6CCB4" />
      <path d="M0 268q113-57 218-10t222-7q112-47 200 0v109H0Z" fill="#D6E2CB" />
      <g fill="#FAF8EB" opacity=".85">
        <path d="M84 57c-3-14 17-20 24-9 10-7 24 0 21 10 17-5 28 4 26 9H65c-2-8 9-14 19-10Z" />
        <path d="M346 48c-2-9 10-13 15-6 7-4 16 0 14 7 11-3 18 3 17 6h-59c-2-5 5-9 13-7Z" />
        <path d="M527 119c-2-11 12-16 18-7 8-5 19 0 17 8 13-4 22 3 20 7h-72c-2-6 7-11 17-8Z" />
      </g>
      <g stroke="#6F9573" strokeWidth="2" strokeLinecap="round">
        <path d="m302 67 5-3 5 3m10 8 4-2 4 2" />
      </g>
      <ellipse cx="330" cy="317" rx="220" ry="22" fill="#A9C4A8" opacity=".45" />
      <path d="M129 217 303 135q24-11 46 1l203 105v27q0 13-17 20L351 346q-22 8-44-2l-160-74q-18-8-18-22Z" fill="#B59870" />
      <path d="m349 166 203 75v27q0 13-17 20l-184 58q-12 4-24 3V238Z" fill="#A98660" />
      <path d="m158 252 165 77q14 7 32 1l180-60" stroke="#C3A681" strokeWidth="5" strokeLinecap="round" />
      <path d="M145 198 303 122q24-12 47 0l188 98q30 16-1 32l-182 79q-22 10-45 0l-163-80q-31-16-2-31Z" fill="#72A17A" />
      <path d="m145 198 158-76q24-12 47 0l188 98q27 14 2 29l-187 81q-20 9-43 0l-163-80q-26-14-8-27" stroke="#A4C48E" strokeWidth="5" strokeLinejoin="round" />
      <path d="M328 320q-29-24-3-42l53-31q23-15 0-27l-49-25q-31-16 0-37l32-19" stroke="#DFD3A4" strokeWidth="28" strokeLinecap="round" />
      <path d="M328 320q-29-24-3-42l53-31q23-15 0-27l-49-25q-31-16 0-37l32-19" stroke="#EFE3B9" strokeWidth="20" strokeLinecap="round" />
      <g fill="#A7C68E">
        <ellipse cx="197" cy="237" rx="26" ry="11" />
        <ellipse cx="425" cy="261" rx="24" ry="10" />
        <ellipse cx="266" cy="185" rx="21" ry="9" />
        <ellipse cx="477" cy="231" rx="20" ry="9" />
      </g>
      <g stroke="#E5D6A6" strokeWidth="4" strokeLinecap="round">
        <path d="m359 263 8-4m-40 28 8-4m22-65 8 4m-36-51 6-4" />
      </g>
      <path d="m73 224 42-21 47 25v14l-40 23-49-25Z" fill="#B0946F" />
      <path d="m73 224 42-21 47 25-40 24Z" fill="#91B486" />
      <path d="m147 232 37-19m-34 26 38-19" stroke="#A87952" strokeWidth="4" />
      <path d="m153 224 8 13m1-18 8 13m1-17 8 12m1-17 8 13" stroke="#D7B88B" strokeWidth="5" />
      <g transform="translate(80 164) scale(.82)"><BambooCluster /></g>
      <g transform="translate(226 106) scale(1.18)"><ForestTree /></g>
      <g transform="translate(157 153) scale(1.12)"><BambooCluster /></g>
      <g transform="translate(394 139) scale(.93)"><BambooCluster /></g>
      <g transform="translate(448 157) scale(1.08)"><ForestTree /></g>
      <g transform="translate(316 96) scale(1.16)"><ForestGate open /></g>
      <g transform="translate(270 232) scale(1.04)"><PandaFigure /></g>
      <g transform="translate(403 238) scale(.82)"><BambooCluster /></g>
      <g transform="translate(221 237) scale(.66)"><ForestTree /></g>
      <g fill="#EECF8B">
        <path d="m378 203 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z" />
        <path d="m333 175 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" />
        <circle cx="363" cy="237" r="3" />
      </g>
      <g fill="#E9B094">
        <circle cx="194" cy="244" r="3" /><circle cx="201" cy="248" r="2" />
        <circle cx="450" cy="255" r="3" /><circle cx="457" cy="251" r="2" />
        <circle cx="282" cy="206" r="2.5" />
      </g>
      <g stroke="#528963" strokeWidth="2" strokeLinecap="round">
        <path d="m208 220 1-6m0 6 5-3m-5 3-4-3m195-55 1-6m0 6 4-3m-4 3-4-3m-142 97 1-6m0 6 4-3m-4 3-4-3m244-20 1-6m0 6 4-3m-4 3-4-3" />
      </g>
      <path d="m526 300 34-14 29 15v10l-34 14-29-15Z" fill="#B59B78" />
      <path d="m526 300 34-14 29 15-34 15Z" fill="#97B98C" />
      <g transform="translate(534 256) scale(.62)"><BambooCluster /></g>
      <path d="M71 303q16-7 31-2m466-111q13-7 27-3" stroke="#F7F6E7" strokeWidth="3" strokeLinecap="round" opacity=".7" />
    </svg>
  );
}
