// Offline editorial diagrams for abstract vocabulary and documentary names.
// No source meanings, curriculum eligibility, examples or IDs are modified.
import { readFile, writeFile, mkdir, readdir, unlink } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const read = async path => JSON.parse(await readFile(path, 'utf8'));
const hash = value => createHash('sha256').update(value).digest('hex');
const esc = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[char]));
const ink = '#315848', pale = '#e1eae2', accent = '#b34424', gold = '#ba8e36', soft = '#83998c';
const line = (x1, y1, x2, y2, color = ink, width = 14, extra = '') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" stroke-linecap="round" ${extra}/>`;
const circle = (x, y, r, fill = pale, stroke = ink, width = 10) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;
const rect = (x, y, w, h, fill = pale, stroke = ink, rx = 20, width = 10) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;
const path = (d, color = ink, width = 14, fill = 'none', extra = '') => `<path d="${d}" stroke="${color}" stroke-width="${width}" fill="${fill}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const text = (x, y, value, size = 42, color = ink, weight = 500, extra = '') => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Arial, PingFang SC, sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}" ${extra}>${esc(value)}</text>`;
const arrow = (x1, y1, x2, y2, color = accent, width = 18) => {
  const angle = Math.atan2(y2 - y1, x2 - x1), length = 30;
  return line(x1, y1, x2, y2, color, width) + path(`M ${x2 - length * Math.cos(angle - .6)} ${y2 - length * Math.sin(angle - .6)} L ${x2} ${y2} L ${x2 - length * Math.cos(angle + .6)} ${y2 - length * Math.sin(angle + .6)}`, color, width);
};
const person = (x, y, scale = 1, color = ink) => `<g transform="translate(${x} ${y}) scale(${scale})">${circle(0, 0, 40, pale, color, 9)}${path('M -65 150 L -55 80 Q 0 46 55 80 L 65 150', color, 15)}${line(-28, 150, -28, 230, color)}${line(28, 150, 28, 230, color)}</g>`;
const woman = (x, y, scale = 1, color = ink) => `<g transform="translate(${x} ${y}) scale(${scale})">${circle(0, 0, 40, pale, color, 9)}${path('M -40 70 Q 0 48 40 70 L 65 170 H -65 Z', color, 10, pale)}${line(-25, 175, -25, 235, color)}${line(25, 175, 25, 235, color)}</g>`;
const book = (x, y, scale = 1, color = ink) => `<g transform="translate(${x} ${y}) scale(${scale})">${path('M 0 0 Q 65 -25 130 8 L 130 170 Q 65 140 0 165 Z', color, 10, pale)}${path('M 130 8 Q 195 -25 260 0 L 260 165 Q 195 140 130 170 Z', color, 10, pale)}${line(130, 10, 130, 165, color, 8)}${line(26, 43, 99, 50, soft, 7)}${line(26, 76, 99, 83, soft, 7)}${line(163, 50, 233, 43, soft, 7)}${line(163, 83, 233, 76, soft, 7)}</g>`;
const house = (x, y, scale = 1) => `<g transform="translate(${x} ${y}) scale(${scale})">${path('M 0 100 L 125 0 L 250 100', ink, 14)}${path('M 28 90 L 28 255 L 222 255 L 222 90', ink, 12, pale)}${rect(93, 153, 65, 102, '#fffdf8', ink, 4, 8)}</g>`;
const school = (x, y, scale = 1) => `<g transform="translate(${x} ${y}) scale(${scale})">${rect(0, 45, 260, 240, pale, ink, 8)}${path('M 0 45 L 130 0 L 260 45', ink, 10)}${rect(105, 195, 50, 90, '#fffdf8', ink, 4, 7)}${[40, 105, 170].map(a => [85, 140].map(b => rect(a, b, 40, 32, '#fffdf8', soft, 3, 5)).join('')).join('')}</g>`;
const bubble = (x, y, w = 260, h = 145, fill = pale) => path(`M ${x + 24} ${y} H ${x + w - 24} Q ${x + w} ${y} ${x + w} ${y + 24} V ${y + h - 24} Q ${x + w} ${y + h} ${x + w - 24} ${y + h} H ${x + 95} L ${x + 47} ${y + h + 43} L ${x + 53} ${y + h} H ${x + 24} Q ${x} ${y + h} ${x} ${y + h - 24} V ${y + 24} Q ${x} ${y} ${x + 24} ${y} Z`, ink, 9, fill);
const check = (x, y, scale = 1, color = ink) => `<g transform="translate(${x} ${y}) scale(${scale})">${path('M 0 50 L 40 90 L 120 0', color, 21)}</g>`;
const label = value => text(360, 665, value, value.length > 26 ? 31 : value.length > 17 ? 37 : 45);

// Each plan is an explicit editorial choice, never a default visual category.
const plans = new Map();
const assign = (words, kind, options = {}) => words.split('|').forEach(hanzi => plans.set(`v-${hanzi}`, { kind, ...options }));
assign('马大为|宋华|丁力波|林娜|陈|王小云|陆雨平|马丽|张华|大卫|宋|力波|大为|小云|王|陆|梅西|李|张王冉|成龙|巩俐|姚明|马云|林|玛丽|陈明|林强', 'name');
assign('吗', 'particle', { mark: '?', caption: 'pregunta' });
assign('呢', 'particle', { mark: '?', caption: '¿y…?' });
assign('吧', 'particle', { mark: '…', caption: 'sugerencia' });
assign('啊', 'particle', { mark: '!', caption: 'confirmación' });
assign('的', 'possessive');
assign('不|没|别', 'negative');
assign('了', 'change');
assign('特别', 'special');
assign('语法', 'grammar');
assign('汉字', 'hanzi');
assign('下|下边', 'spatial', { direction: 'below', caption: 'abajo' });
assign('对了', 'topic');
assign('对|行', 'correct');
assign('时间', 'clock');
assign('一起|跟', 'together');
assign('恐怕', 'estimate');
assign('差', 'missing');
assign('回', 'return', { destination: 'origin', caption: 'regresar' });
assign('回家', 'return', { destination: 'home', caption: 'volver a casa' });
assign('回学校', 'return', { destination: 'school', caption: 'volver al colegio' });
assign('回国', 'return', { destination: 'country', caption: 'volver al país' });
assign('活动', 'event');
assign('男', 'male');
assign('意思', 'meaning');
assign('来', 'motion', { arrival: true });
assign('走', 'motion', { arrival: false });
assign('专业', 'speciality');
assign('容易', 'difficulty', { hard: false });
assign('难', 'difficulty', { hard: true });
assign('事|事儿', 'task');
assign('有点儿', 'small-amount');
assign('部', 'classifier', { object: 'film' });
assign('门', 'subject-or-door');
assign('条', 'classifier', { object: 'long' });
assign('翻译', 'translation');
assign('里卡多帕尔玛大学', 'institution', { confucius: false });
assign('里卡多帕尔玛大学孔子学院', 'institution', { confucius: true });
assign('数学', 'math');
assign('思想政治', 'civics');
assign('觉得', 'feeling');
assign('功夫熊猫', 'film-title');
assign('每天', 'week', { days: [0, 1, 2, 3, 4, 5, 6], caption: 'todos los días' });
assign('周末', 'week', { days: [5, 6], caption: 'fin de semana' });
assign('星期', 'week', { days: [0, 1, 2, 3, 4, 5, 6], caption: 'una semana' });
assign('综合汉语', 'integrated');
assign('星期日|星期天', 'week', { days: [6], caption: 'domingo' });
assign('星期一', 'week', { days: [0], caption: 'lunes' });
assign('星期二', 'week', { days: [1], caption: 'martes' });
assign('星期三', 'week', { days: [2], caption: 'miércoles' });
assign('星期四', 'week', { days: [3], caption: 'jueves' });
assign('星期五', 'week', { days: [4], caption: 'viernes' });
assign('星期六', 'week', { days: [5], caption: 'sábado' });
assign('日', 'day');
assign('号', 'date');
assign('月', 'month', { month: null });
for (const [i, hanzi] of ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'].entries()) plans.set(`v-${hanzi}`, { kind: 'month', month: i + 1 });
assign('属', 'zodiac');
assign('就', 'exact');
assign('常常|常', 'frequency');
assign('一会儿', 'short-time');
assign('咱们', 'inclusive');
assign('前天', 'timeline', { unit: 'day', offset: -2, caption: 'anteayer' });
assign('后天', 'timeline', { unit: 'day', offset: 2, caption: 'pasado mañana' });
assign('上星期一', 'timeline', { unit: 'week', offset: -1, caption: 'el lunes pasado' });
assign('下星期一', 'timeline', { unit: 'week', offset: 1, caption: 'el próximo lunes' });
assign('上个月', 'timeline', { unit: 'month', offset: -1, caption: 'el mes pasado' });
assign('下个月', 'timeline', { unit: 'month', offset: 1, caption: 'el próximo mes' });
assign('新', 'new');
assign('右边|右', 'spatial', { direction: 'right', caption: 'derecha' });
assign('左边|左', 'spatial', { direction: 'left', caption: 'izquierda' });
assign('上边', 'spatial', { direction: 'above', caption: 'arriba' });
assign('里边|里', 'spatial', { direction: 'inside', caption: 'dentro' });
assign('外边', 'spatial', { direction: 'outside', caption: 'afuera' });
assign('旁边|边', 'spatial', { direction: 'beside', caption: 'al lado' });
assign('北边|北', 'compass', { direction: 'N', caption: 'norte' });
assign('南边|南', 'compass', { direction: 'S', caption: 'sur' });
assign('西边|西', 'compass', { direction: 'O', caption: 'oeste' });
assign('东边|东', 'compass', { direction: 'E', caption: 'este' });
assign('给', 'give');
assign('先', 'first');
assign('地方', 'place');
assign('知道', 'know');
assign('前边|前', 'front-back', { front: true });
assign('后边|后', 'front-back', { front: false });
assign('对面', 'opposite');
assign('不客气', 'you-are-welcome');
assign('听说', 'heard');
// Replacements prepared for previously withdrawn or regeneration-requested media.
// Publication/review DB decisions are handled separately by the authorized release.
assign('上', 'class-or-above');
assign('也', 'also');
assign('什么', 'what');
assign('们', 'plural');
assign('你', 'addressed', { plural: false });
assign('你们', 'addressed', { plural: true });
assign('最近', 'recent');
assign('只', 'animal-or-only');
assign('叫', 'called');
assign('名字', 'name-concept');
assign('在', 'located');
assign('太', 'degree', { excessive: true });
assign('很', 'degree', { excessive: false });
assign('好', 'evaluation', { level: 'good' });
assign('还行', 'evaluation', { level: 'okay' });
assign('马马虎虎', 'evaluation', { level: 'so-so' });
assign('姓', 'surname');
assign('学', 'study');
assign('怎么样', 'how');
assign('早', 'early');
assign('请', 'please');
assign('请问', 'polite-question');
assign('问', 'question');
assign('他', 'third-person', { female: false });
assign('她', 'third-person', { female: true });
assign('早上', 'morning');

function draw(word, plan) {
  const { kind } = plan;
  switch (kind) {
    case 'name': {
      const name = word.hanzi, surname = /apellido/.test(word.spanish);
      return path('M 175 190 L 225 90 H 495 L 545 190 V 495 Q 545 530 510 530 H 210 Q 175 530 175 495 Z', ink, 12, pale) + circle(360, 150, 20, 'none', ink, 7) + text(360, 335, name, name.length > 3 ? 68 : 88) + text(360, 422, word.pinyin, word.pinyin.length > 16 ? 32 : 39) + label(surname ? 'apellido' : 'nombre propio');
    }
    case 'particle':
      return person(160, 300, .7) + bubble(265, 130, 350, 240) + text(440, 295, plan.mark, 145, accent) + label(plan.caption);
    case 'possessive':
      return person(135, 245, .8) + book(440, 310, .65) + arrow(235, 355, 405, 355) + text(330, 285, word.hanzi, 72, accent) + label('posesión / modificación');
    case 'negative':
      return bubble(130, 165, 460, 280) + circle(360, 305, 90, 'none', accent, 16) + line(295, 240, 425, 370, accent, 18) + label(word.hanzi === '别' ? 'no hacer' : 'no');
    case 'change':
      return circle(160, 330, 78, 'none', soft, 12) + arrow(275, 330, 430, 330) + circle(550, 330, 78, pale) + check(504, 290, .7) + text(160, 485, 'antes', 42) + text(550, 485, 'ahora', 42) + label('cambio / acción completada');
    case 'special':
      return [130, 280, 450, 600].map((x, i) => circle(x, 335, i === 2 ? 74 : 44, i === 2 ? accent : pale, i === 2 ? accent : soft, 8)).join('') + [0, 1, 2, 3].map(i => { const a = i * Math.PI / 2; return line(450 + Math.cos(a) * 104, 335 + Math.sin(a) * 104, 450 + Math.cos(a) * 138, 335 + Math.sin(a) * 138, gold, 10); }).join('') + label('especialmente');
    case 'grammar':
      return [105, 280, 455].map((x, i) => rect(x, 235, 145, 145) + text(x + 72, 332, ['A', 'B', 'C'][i], 72)).join('') + path('M 135 440 V 480 H 570 V 440', ink, 10) + check(310, 510, .75) + label('orden y relaciones');
    case 'hanzi':
      return ['汉', '字'].map((glyph, i) => rect(135 + i * 240, 200, 220, 250, 'none', soft, 2, 7) + line(245 + i * 240, 200, 245 + i * 240, 450, soft, 4, 'stroke-dasharray="12 12"') + line(135 + i * 240, 325, 355 + i * 240, 325, soft, 4, 'stroke-dasharray="12 12"') + text(245 + i * 240, 380, glyph, 150)).join('') + label('caracteres chinos');
    case 'topic':
      return bubble(85, 170, 240, 155) + text(205, 275, '…', 86) + bubble(410, 355, 225, 160) + text(522, 465, '!', 96, accent) + path('M 350 230 Q 520 220 520 315', accent, 18) + arrow(520, 290, 520, 330) + label('cambio de tema');
    case 'correct':
      return circle(360, 330, 160, pale) + check(260, 265, 1.55) + label(word.hanzi === '行' ? 'está bien' : 'correcto');
    case 'clock':
      return circle(360, 330, 190, pale) + Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return line(360 + Math.sin(a) * 158, 330 - Math.cos(a) * 158, 360 + Math.sin(a) * 172, 330 - Math.cos(a) * 172, ink, 9); }).join('') + line(360, 330, 360, 200, ink, 18) + line(360, 330, 450, 380, accent, 18) + circle(360, 330, 14, ink, ink, 0) + label('tiempo');
    case 'together':
      return person(235, 230, 1) + person(475, 230, 1) + line(297, 355, 415, 355, accent, 16) + path('M 140 520 Q 360 600 580 520', accent, 12) + label(word.hanzi === '跟' ? 'con' : 'juntos');
    case 'estimate':
      return person(260, 345, .9) + circle(350, 285, 12, pale, soft, 4) + circle(390, 250, 20, pale, soft, 5) + bubble(400, 90, 230, 150) + text(515, 193, '?', 100, accent) + label('me temo que…');
    case 'missing':
      return [120, 275, 430].map(x => rect(x, 250, 125, 155)).join('') + rect(585, 250, 90, 155, 'none', accent, 16, 8).replace('stroke-width="8"', 'stroke-width="8" stroke-dasharray="16 12"') + arrow(630, 510, 630, 440) + label('falta una parte');
    case 'return': {
      let destination = circle(190, 350, 90, pale);
      if (plan.destination === 'home') destination = house(90, 230, .9);
      if (plan.destination === 'school') destination = school(85, 220, .9);
      if (plan.destination === 'country') destination = circle(200, 350, 110, pale) + path('M 130 275 L 185 285 L 215 245 L 260 290 L 235 340 L 260 395 L 210 430 L 170 390 L 135 365 Z', ink, 7, soft);
      return destination + person(550, 310, .75) + path('M 515 220 Q 350 90 210 190', soft, 10, 'none', 'stroke-dasharray="16 16"') + arrow(440, 400, 330, 400) + label(plan.caption);
    }
    case 'event':
      return path('M 70 140 Q 360 245 650 140', ink, 8) + [130, 250, 370, 490, 610].map((x, i) => path(`M ${x - 30} ${165 + (i === 2 ? 20 : 0)} L ${x + 30} ${170 + (i === 2 ? 20 : 0)} L ${x} ${235 + (i === 2 ? 20 : 0)} Z`, i % 2 ? accent : ink, 5, i % 2 ? accent : pale)).join('') + [190, 360, 530].map(x => person(x, 320, .75)).join('') + label('actividad / evento');
    case 'male':
      return circle(310, 360, 130, 'none', ink, 20) + arrow(405, 265, 555, 115, ink, 20) + label('masculino');
    case 'meaning':
      return bubble(95, 220, 245, 190) + text(218, 340, '…', 95) + arrow(390, 315, 510, 315) + circle(580, 315, 75, pale) + check(532, 280, .75) + label('significado');
    case 'motion':
      return person(plan.arrival ? 540 : 185, 270, .9) + circle(plan.arrival ? 170 : 555, 475, 35, pale, accent, 8) + arrow(plan.arrival ? 460 : 270, 390, plan.arrival ? 240 : 470, 390) + text(plan.arrival ? 170 : 185, 570, plan.arrival ? 'aquí' : 'aquí', 40) + label(plan.arrival ? 'venir' : 'marcharse');
    case 'speciality':
      return [0, 1, 2].map(i => book(75 + i * 205, 300, .6, i === 1 ? accent : soft)).join('') + arrow(360, 120, 360, 250) + label('especialidad');
    case 'difficulty':
      return circle(120, 460, 22, ink, ink, 0) + circle(600, 200, 22, accent, accent, 0) + (plan.hard ? path('M 120 460 H 215 V 210 H 310 V 480 H 405 V 210 H 500 V 355 H 600 V 200', ink, 20) : arrow(160, 440, 560, 220, ink, 20)) + label(plan.hard ? 'difícil' : 'fácil');
    case 'task':
      return rect(185, 155, 350, 400) + rect(285, 115, 150, 65, '#fffdf8', ink, 12, 9) + [260, 355, 450].map(y => circle(250, y, 13, accent, accent, 0) + line(300, y, 470, y, ink, 11)).join('') + label('asunto / cosa');
    case 'small-amount':
      return path('M 185 160 H 535 L 495 530 H 225 Z', ink, 12, 'none') + path('M 220 440 H 500 L 490 515 H 230 Z', accent, 0, accent) + line(550, 440, 610, 440, accent, 11) + label('un poco');
    case 'classifier': {
      let object = '';
      if (plan.object === 'film') object = rect(220, 220, 350, 250, pale, ink, 12, 10) + [245, 310, 375, 440, 505].map(x => rect(x, 238, 37, 30, '#fffdf8', ink, 2, 4) + rect(x, 420, 37, 30, '#fffdf8', ink, 2, 4)).join('') + path('M 355 295 L 355 390 L 435 342 Z', ink, 8, ink);
      if (plan.object === 'subject') object = [0, 1, 2].map(i => rect(275 + i * 78, 220 - i * 18, 70, 280, i % 2 ? pale : '#f0e3c7', ink, 8, 8)).join('');
      if (plan.object === 'long') object = path('M 245 450 C 325 100 430 540 570 215', ink, 34) + path('M 245 450 C 325 100 430 540 570 215', pale, 18);
      return text(130, 385, '1', 145, accent) + object + label(plan.object === 'film' ? 'películas / obras' : plan.object === 'subject' ? 'asignaturas' : 'largo y estrecho');
    }
    case 'subject-or-door':
      return [0, 1, 2].map(i => rect(95 + i * 60, 240 - i * 12, 54, 225, i % 2 ? pale : '#f0e3c7', ink, 7, 7)).join('') + text(190, 535, 'asignaturas', 35) + line(360, 195, 360, 550, soft, 6, 'stroke-dasharray="12 12"') + rect(445, 195, 170, 290, 'none', ink, 7, 10) + path('M 460 215 L 585 250 V 468 L 460 470 Z', ink, 8, pale) + circle(560, 355, 9, accent, accent, 0) + text(530, 535, 'puerta', 39) + label('dos usos según el contexto');
    case 'translation':
      return bubble(85, 150, 240, 170) + text(205, 263, '中文', 64) + bubble(410, 350, 240, 170) + text(530, 455, 'español', 43) + arrow(345, 270, 430, 350) + arrow(375, 390, 290, 310, soft, 13) + label('traducir');
    case 'institution':
      return school(230, 155, 1) + text(360, 520, 'URP', 65, accent) + (plan.confucius ? text(360, 580, 'Instituto Confucio', 38) : text(360, 580, 'Ricardo Palma', 42)) + label('esquema institucional');
    case 'math':
      return text(195, 275, '2', 110) + text(360, 275, '+', 95, accent) + text(525, 275, '3', 110) + line(130, 350, 590, 350, soft, 8) + text(360, 505, '= 5', 125) + label('matemáticas');
    case 'civics':
      return line(360, 185, 360, 500, ink, 14) + path('M 165 250 Q 360 195 555 250', ink, 13) + [210, 510].map(x => line(x, 240, x - 55, 390, ink, 8) + line(x, 240, x + 55, 390, ink, 8) + path(`M ${x - 65} 390 Q ${x} 480 ${x + 65} 390 Z`, ink, 9, pale)).join('') + line(280, 520, 440, 520, ink, 20) + label('ideas y vida pública');
    case 'feeling':
      return person(275, 300, .9) + bubble(390, 110, 220, 150) + path('M 495 160 C 470 120 425 165 495 220 C 565 165 520 120 495 160 Z', accent, 7, accent) + label('sentir / opinar');
    case 'film-title':
      return rect(110, 170, 500, 330, pale, ink, 15, 12) + [140, 230, 320, 410, 500].map(x => rect(x, 190, 50, 32, '#fffdf8', ink, 3, 5) + rect(x, 450, 50, 32, '#fffdf8', ink, 3, 5)).join('') + text(360, 335, 'Kung Fu', 66) + text(360, 410, 'Panda', 66) + label('título de película');
    case 'week': {
      const names = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
      return names.map((day, i) => { const x = 65 + i * 86, active = plan.days.includes(i); return text(x + 32, 230, day, 42, active ? accent : soft) + rect(x, 270, 65, 125, active ? pale : 'none', active ? accent : soft, 12, active ? 9 : 6) + (active ? circle(x + 32, 332, 12, accent, accent, 0) : ''); }).join('') + path('M 70 445 V 485 H 650 V 445', ink, 10) + label(plan.caption);
    }
    case 'integrated':
      return circle(360, 330, 195, 'none', soft, 8) + bubble(255, 105, 210, 115) + text(360, 188, '…', 80) + book(90, 320, .7) + path('M 490 330 L 530 370 L 440 470 L 400 480 L 410 440 Z', ink, 10, pale) + text(360, 570, 'escuchar · hablar', 38) + text(360, 620, 'leer · escribir', 38) + label('chino integral');
    case 'day':
      return circle(230, 320, 70, '#f0e3c7', gold, 10) + Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4; return line(230 + Math.cos(a) * 100, 320 + Math.sin(a) * 100, 230 + Math.cos(a) * 125, 320 + Math.sin(a) * 125, gold, 8); }).join('') + path('M 530 225 C 410 250 430 400 550 405 C 465 430 410 380 410 310 C 410 250 460 210 530 225 Z', ink, 10, pale) + label('un día');
    case 'date':
      return calendarFrame() + circle(390, 390, 56, pale, accent, 10) + text(390, 410, '15', 52, accent) + text(360, 605, 'día del mes', 45) + label('fecha / talla');
    case 'month': {
      const month = plan.month;
      return calendarFrame() + (month ? text(360, 420, String(month).padStart(2, '0'), 150, accent) : [0, 1, 2, 3].map(i => [0, 1, 2, 3, 4, 5, 6].map(j => circle(205 + j * 52, 310 + i * 53, 9, ink, ink, 0)).join('')).join('')) + text(360, 605, month ? word.spanish : 'mes', 43) + (month ? Array.from({ length: 12 }, (_, i) => circle(118 + i * 44, 690, i + 1 === month ? 14 : 8, i + 1 === month ? accent : soft, 'none', 0)).join('') : '');
    }
    case 'zodiac':
      return circle(360, 330, 200, 'none', soft, 7) + Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6 - Math.PI / 2, x = 360 + Math.cos(a) * 200, y = 330 + Math.sin(a) * 200; return circle(x, y, 32, i === 0 ? accent : pale, i === 0 ? accent : ink, 5) + text(x, y + 12, i + 1, 32, i === 0 ? '#fffdf8' : ink); }).join('') + person(360, 270, .65) + label('signo del horóscopo chino');
    case 'exact':
      return [170, 112, 52].map((r, i) => circle(360, 330, r, i === 2 ? accent : 'none', i === 2 ? accent : ink, 12)).join('') + arrow(600, 115, 365, 325) + label('exactamente');
    case 'frequency':
      return Array.from({ length: 7 }, (_, i) => circle(100 + i * 85, 320, 30, [0, 1, 3, 4, 6].includes(i) ? ink : 'none', soft, 6)).join('') + arrow(90, 440, 635, 440, soft, 10) + label('a menudo');
    case 'short-time':
      return circle(360, 330, 180, 'none', ink, 12) + path('M 360 330 L 360 150 A 180 180 0 0 1 450 175 Z', accent, 0, accent) + line(360, 330, 450, 175, ink, 14) + circle(360, 330, 14, ink, ink, 0) + label('un momento');
    case 'inclusive':
      return circle(360, 350, 245, 'none', accent, 10) + person(235, 240, .82) + person(485, 240, .82) + text(235, 520, 'yo', 44) + text(485, 520, 'tú', 44) + text(360, 345, '+', 67, accent) + label('nosotros: tú también');
    case 'timeline': {
      const slots = plan.unit === 'day' ? [-2, -1, 0, 1, 2] : [-1, 0, 1];
      const positions = slots.map((_, i) => 95 + i * (530 / (slots.length - 1)));
      return arrow(70, 370, 660, 370, soft, 10) + slots.map((slot, i) => circle(positions[i], 370, slot === plan.offset ? 35 : 21, slot === plan.offset ? accent : slot === 0 ? ink : pale, slot === plan.offset ? accent : ink, 6) + text(positions[i], 465, slot === 0 ? plan.unit === 'day' ? 'hoy' : 'actual' : String(slot > 0 ? `+${slot}` : slot), slot === 0 ? 31 : 43, slot === plan.offset ? accent : ink)).join('') + text(360, 220, plan.unit === 'week' ? 'lunes · semanas' : plan.unit === 'month' ? 'meses' : 'días', 44) + label(plan.caption);
    }
    case 'new':
      return path('M 170 285 L 360 200 L 550 285 L 360 370 Z', ink, 12, pale) + path('M 170 285 V 485 L 360 570 L 550 485 V 285 M 360 370 V 570', ink, 12, 'none') + path('M 455 160 L 480 110 L 505 160 L 555 185 L 505 210 L 480 260 L 455 210 L 405 185 Z', gold, 6, '#f0e3c7') + label('nuevo');
    case 'spatial': {
      const positions = { left: [130, 350], right: [590, 350], above: [360, 150], below: [360, 550], inside: [360, 350], outside: [595, 350], beside: [575, 390] };
      const [x, y] = positions[plan.direction];
      return rect(230, 235, 260, 230, 'none', ink, 12, 12) + circle(x, y, 47, accent, accent, 0) + (plan.direction === 'left' ? arrow(400, 120, 130, 120, accent, 14) : plan.direction === 'right' ? arrow(300, 120, 590, 120, accent, 14) : '') + label(plan.caption);
    }
    case 'compass': {
      const points = { N: [360, 150], E: [540, 330], S: [360, 510], O: [180, 330] };
      const labels = { N: [360, 95], E: [615, 345], S: [360, 595], O: [100, 345] };
      return circle(360, 330, 170, 'none', soft, 8) + Object.entries(points).map(([direction, [x, y]]) => direction === plan.direction ? arrow(360, 330, x, y, accent, 24) : line(360, 330, x, y, soft, 8)).join('') + Object.entries(labels).map(([direction, [x, y]]) => text(x, y, direction, 58, direction === plan.direction ? accent : ink, direction === plan.direction ? 700 : 400)).join('') + circle(360, 330, 17, ink, ink, 0) + label(plan.caption);
    }
    case 'give':
      return person(150, 260, .85) + person(570, 260, .85) + rect(310, 275, 100, 100, '#f0e3c7', ink, 9, 8) + line(360, 275, 360, 375, accent, 10) + line(310, 325, 410, 325, accent, 10) + arrow(285, 440, 465, 440) + label('a / para');
    case 'first':
      return [0, 1, 2].map(i => circle(150 + i * 210, 330, 72, i === 0 ? accent : pale, i === 0 ? accent : ink, 8) + text(150 + i * 210, 360, i + 1, 84, i === 0 ? '#fffdf8' : ink) + (i < 2 ? arrow(242 + i * 210, 330, 268 + i * 210, soft, 10) : '')).join('') + arrow(150, 150, 150, 225, accent, 14) + label('primero');
    case 'place':
      return path('M 100 315 L 265 260 L 450 315 L 620 260 V 525 L 450 580 L 265 525 L 100 580 Z', ink, 10, pale) + line(265, 270, 265, 520, soft, 7) + line(450, 325, 450, 570, soft, 7) + path('M 360 440 C 195 255 295 125 360 125 C 425 125 525 255 360 440 Z', accent, 10, accent) + circle(360, 235, 48, '#fffdf8', '#fffdf8', 0) + label('lugar');
    case 'know':
      return person(275, 310, .95) + circle(475, 220, 90, pale) + check(420, 180, .85) + label('saber');
    case 'front-back': {
      // The car has a visible nose/headlamp to establish its direction.
      return path('M 200 390 L 220 305 L 385 305 L 455 370 L 515 390 V 460 H 190 V 390 Z', ink, 12, pale) + circle(255, 460, 35, ink, ink, 0) + circle(450, 460, 35, ink, ink, 0) + rect(470, 390, 35, 30, '#f0e3c7', gold, 4, 5) + arrow(250, 190, 475, 190, soft, 12) + circle(plan.front ? 605 : 95, 415, 43, accent, accent, 0) + label(plan.front ? 'delante' : 'detrás');
    }
    case 'opposite':
      return rect(300, 155, 120, 390, pale, soft, 0, 5) + line(360, 180, 360, 520, '#fffdf8', 10, 'stroke-dasharray="24 20"') + person(140, 270, .85) + person(580, 270, .85) + arrow(230, 350, 485, 350, accent, 12) + arrow(490, 410, 235, 410, accent, 12) + label('enfrente');
    case 'you-are-welcome':
      return bubble(65, 120, 260, 165) + text(195, 230, '谢谢', 72) + bubble(380, 340, 290, 165) + text(525, 450, '不客气', 72) + arrow(330, 280, 405, 335) + label('de nada');
    case 'heard':
      return person(510, 305, .9) + bubble(70, 150, 260, 165) + text(200, 260, '…', 90) + arrow(340, 260, 440, 260) + path('M 470 315 Q 435 290 430 325 Q 425 355 447 365 L 450 390', accent, 10) + label('escuchar / enterarse');
    case 'class-or-above':
      return book(75, 340, .7) + person(175, 230, .55) + text(175, 565, 'asistir a clase', 33) + line(360, 165, 360, 570, soft, 5, 'stroke-dasharray="12 12"') + rect(445, 340, 170, 130, 'none', ink, 10, 9) + circle(530, 235, 35, accent, accent, 0) + arrow(640, 440, 640, 220, accent, 10) + text(530, 565, 'arriba / anterior', 33) + label('usos según el contexto');
    case 'also':
      return person(180, 250, .85) + person(540, 250, .85) + check(135, 130, .7) + check(495, 130, .7, accent) + text(360, 390, '+', 105, accent) + path('M 100 520 Q 360 595 620 520', ink, 10) + label('también');
    case 'what':
      return person(150, 310, .75) + bubble(100, 100, 230, 150) + text(215, 205, '?', 100, accent) + book(445, 355, .7) + arrow(335, 240, 490, 310, accent, 12) + label('¿qué?');
    case 'plural':
      return person(130, 250, .8) + arrow(255, 340, 350, 340, accent, 12) + [425, 515, 605].map(x => person(x, 250, .65)).join('') + path('M 390 475 V 510 H 640 V 475', accent, 10) + text(130, 580, 'uno', 38) + text(515, 580, 'varios', 38) + label('sufijo plural');
    case 'addressed': {
      const subjects = plan.plural ? [450, 545, 640].map(x => person(x, 310, .65, accent)).join('') : person(540, 300, .9, accent);
      return person(135, 330, .85) + bubble(55, 95, 235, 145) + text(172, 194, '…', 84) + arrow(305, 250, plan.plural ? 440 : 510, 250, accent, 15) + subjects + (plan.plural ? path('M 405 505 V 535 H 685 V 505', accent, 8) : '') + text(135, 590, 'hablante', 34) + text(plan.plural ? 545 : 540, 590, plan.plural ? 'ustedes' : 'tú', 45, accent) + label('a quien se habla');
    }
    case 'recent':
      return arrow(75, 350, 655, 350, soft, 10) + path('M 275 315 H 560', accent, 20) + [120, 240, 360, 480, 600].map((x, i) => circle(x, 350, i === 4 ? 27 : 18, i >= 2 ? accent : pale, i >= 2 ? accent : soft, 5)).join('') + text(600, 445, 'hoy', 42) + text(120, 445, 'antes', 38) + path('M 295 215 V 245 H 570 V 215', accent, 9) + label('recientemente');
    case 'animal-or-only':
      return text(180, 180, 'zhī', 48, accent) + text(80, 390, '1', 90, accent) + path('M 150 330 L 145 275 L 185 305 Q 210 288 235 305 L 275 275 L 270 335 Q 290 385 250 420 Q 310 480 265 510 H 160 Q 115 470 165 420 Q 130 385 150 330 Z', ink, 8, pale) + circle(180, 350, 6, ink, ink, 0) + circle(240, 350, 6, ink, ink, 0) + text(185, 570, 'animales', 37) + line(360, 140, 360, 595, soft, 5, 'stroke-dasharray="12 12"') + text(530, 180, 'zhǐ', 48, accent) + [450, 530, 610].map((x, i) => circle(x, 370, i === 1 ? 32 : 20, i === 1 ? accent : 'none', i === 1 ? accent : soft, 7)).join('') + arrow(530, 245, 530, 310, accent, 12) + text(530, 570, 'solo', 42) + label('dos lecturas y usos');
    case 'called':
      return person(170, 315, .85) + bubble(300, 145, 350, 180) + text(475, 245, 'nombre', 51) + text(475, 292, '…', 65, accent) + arrow(290, 400, 445, 340, accent, 12) + label('llamarse / llamar');
    case 'name-concept':
      return path('M 135 235 L 205 135 H 555 V 510 H 135 Z', ink, 12, pale) + circle(205, 205, 18, 'none', ink, 7) + text(365, 330, 'nombre', 64) + line(220, 415, 495, 415, accent, 12) + label('identificación personal');
    case 'located':
      return path('M 130 420 L 295 365 L 460 420 L 610 365 V 550 L 460 605 L 295 550 L 130 605 Z', soft, 8, pale) + line(295, 375, 295, 545, soft, 6) + line(460, 430, 460, 595, soft, 6) + person(360, 190, 1, accent) + circle(360, 460, 55, 'none', accent, 9) + label('estar en un lugar');
    case 'degree': {
      const fillHeight = plan.excessive ? 350 : 260, top = 530 - fillHeight;
      return rect(245, 160, 230, 390, 'none', ink, 20, 10) + rect(268, top, 184, fillHeight, plan.excessive ? accent : ink, 'none', 7, 0) + line(210, 245, 510, 245, gold, 10, 'stroke-dasharray="18 12"') + (plan.excessive ? arrow(550, 270, 550, 145, accent, 14) + text(570, 360, '+', 74, accent) : arrow(550, 525, 550, 290, ink, 14)) + label(plan.excessive ? 'demasiado' : 'muy');
    }
    case 'evaluation': {
      const levels = { good: 3, okay: 2, 'so-so': 1 }, amount = levels[plan.level];
      const mouth = plan.level === 'good' ? path('M 270 340 Q 360 440 450 340', ink, 14) : plan.level === 'okay' ? path('M 290 365 Q 360 400 430 365', ink, 14) : line(295, 380, 425, 380, ink, 14);
      return circle(360, 305, 155, pale) + circle(305, 270, 12, ink, ink, 0) + circle(415, 270, 12, ink, ink, 0) + mouth + [0, 1, 2].map(i => rect(185 + i * 125, 520, 100, 35, i < amount ? ink : 'none', soft, 12, 5)).join('') + label(plan.level === 'good' ? 'bueno / bien' : plan.level === 'okay' ? 'no está mal' : 'más o menos');
    }
    case 'surname':
      return path('M 130 235 L 200 135 H 590 V 505 H 130 Z', ink, 12, pale) + circle(200, 205, 18, 'none', ink, 7) + rect(165, 290, 210, 90, accent, accent, 12, 0) + text(270, 350, 'apellido', 44, '#fffdf8') + text(480, 350, 'nombre', 42, soft) + arrow(270, 445, 270, 400, accent, 11) + label('apellido / apellidarse');
    case 'study':
      return person(360, 180, 1) + book(190, 385, 1.3) + line(230, 310, 200, 405, ink, 13) + line(490, 310, 520, 405, ink, 13) + label('estudiar');
    case 'how':
      return person(150, 330, .8) + bubble(280, 130, 350, 180) + text(455, 245, '¿cómo?', 66, accent) + circle(500, 445, 72, pale) + circle(475, 430, 6, ink, ink, 0) + circle(525, 430, 6, ink, ink, 0) + path('M 467 460 Q 500 490 533 460', ink, 8) + label('cómo es / cómo está');
    case 'early':
      return circle(360, 330, 180, 'none', ink, 12) + [0, 1, 2, 3].map(i => { const a = i * Math.PI / 2; return line(360 + Math.sin(a) * 145, 330 - Math.cos(a) * 145, 360 + Math.sin(a) * 162, 330 - Math.cos(a) * 162, ink, 9); }).join('') + line(360, 330, 360, 195, ink, 16) + line(360, 330, 360, 425, accent, 18) + circle(360, 330, 12, ink, ink, 0) + path('M 140 465 Q 100 350 145 240', gold, 13) + arrow(145, 250, 165, 215, gold, 11) + label('temprano');
    case 'please':
      return person(170, 270, .9) + person(560, 270, .9) + path('M 215 365 L 325 405 L 390 375', accent, 13) + path('M 360 375 L 390 375 L 390 345', accent, 10) + bubble(80, 80, 240, 125) + text(200, 160, 'por favor', 43) + label('solicitar / invitar');
    case 'polite-question':
      return person(160, 340, .75) + person(555, 340, .75) + bubble(95, 110, 240, 155) + text(215, 215, '?', 100, accent) + text(500, 180, 'disculpe…', 42) + arrow(355, 255, 495, 255, accent, 12) + label('podría preguntar');
    case 'question':
      return person(150, 340, .75) + person(560, 340, .75) + bubble(120, 110, 265, 170) + text(252, 225, '?', 105, accent) + arrow(410, 270, 520, 270, accent, 12) + label('preguntar');
    case 'third-person':
      return person(115, 350, .6) + person(280, 350, .6) + bubble(65, 130, 210, 135) + text(170, 222, '…', 80) + path('M 175 365 L 225 320 L 420 250', accent, 12) + arrow(380, 265, 440, 245, accent, 12) + (plan.female ? woman(565, 230, 1, accent) : person(565, 230, 1, accent)) + text(200, 590, 'conversación', 34) + text(565, 590, plan.female ? 'ella' : 'él', 48, accent) + label('persona de la que se habla');
    case 'morning':
      return path('M 180 430 A 180 180 0 0 1 540 430 Z', gold, 10, '#f0e3c7') + line(100, 430, 620, 430, ink, 12) + line(140, 485, 580, 485, soft, 8) + [-2, -1, 0, 1, 2].map(i => { const a = i * Math.PI / 6; return line(360 + Math.sin(a) * 215, 430 - Math.cos(a) * 215, 360 + Math.sin(a) * 260, 430 - Math.cos(a) * 260, gold, 10); }).join('') + arrow(360, 385, 360, 285, accent, 14) + label('por la mañana');
    default: throw new Error(`No diagram renderer for ${word.id}: ${kind}`);
  }
}

function calendarFrame() {
  return rect(140, 155, 440, 385, 'none', ink, 28, 12) + path('M 140 240 H 580', ink, 12) + line(235, 115, 235, 190, accent, 20) + line(485, 115, 485, 190, accent, 20);
}

const corpora = await Promise.all(['lessons123', 'lesson4', 'lesson5', 'lesson6'].map(name => read(`data/${name}-public.json`)));
const words = new Map();
for (const corpus of corpora) for (const word of corpus.vocabulary) if (!words.has(word.id)) words.set(word.id, word);
const directory = 'public/images/vocabulary/corpus-completion-diagrams';
await mkdir(directory, { recursive: true });
const entries = [], reviews = [];
for (const [wordId, plan] of plans) {
  const word = words.get(wordId);
  if (!word) throw new Error(`Unknown documentary ID: ${wordId}`);
  const drawing = draw(word, plan);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1618" height="1000" viewBox="0 0 1618 1000"><title>${esc(`Apoyo visual: ${word.spanish}`)}</title><g transform="translate(780 140)">${drawing}</g></svg>`;
  const sourceSha256 = hash(svg), slug = [...word.hanzi].map(char => char.codePointAt(0).toString(16)).join('-');
  const sourceFilename = `${slug}-${sourceSha256.slice(0, 12)}.svg`;
  const bytes = await sharp(Buffer.from(svg)).webp({ lossless: true }).toBuffer();
  const digest = hash(bytes), filename = `${slug}-${digest.slice(0, 12)}.webp`;
  const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (const pixel of [0, info.width - 1, (info.height - 1) * info.width, info.width * info.height - 1]) if (data[pixel * 4 + 3] !== 0) throw new Error(`Opaque diagram corner: ${wordId}`);
  // The protected language zone is x < 740 on the complete canvas.
  let visible = 0, safeZonePixels = 0;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) if (data[(y * info.width + x) * 4 + 3] > 8) { visible++; if (x < 740) safeZonePixels++; }
  if (!visible || safeZonePixels) throw new Error(`Invalid diagram framing: ${wordId}`);
  await writeFile(`${directory}/${sourceFilename}`, svg);
  await writeFile(`${directory}/${filename}`, bytes);
  const description = `Diagrama editorial de apoyo para ${word.hanzi}: ${word.spanish}.`;
  const prompt = `Diagrama didáctico editorial Míng para ${word.hanzi} (${word.pinyin}): ${word.spanish}. Plan visual explícito: ${JSON.stringify(plan)}. Lienzo 1618 × 1000, fondo realmente transparente, composición en el lado derecho, zona de texto izquierda libre. Etiquetas pedagógicas y símbolos, sin atribuir el dibujo al libro; no usar como quiz visual de respuesta oculta.`;
  const review = '2026-11-19 · Diagrama determinista; alfa, zona de texto y contenido visual revisados por el modelo. Sin revisión humana independiente.';
  entries.push({ wordId, sense: word.spanish, hintType: 'image', src: `/images/vocabulary/corpus-completion-diagrams/${filename}`, sha256: digest, alt: description, description, status: 'approved', presentation: 'transparent-cutout', visualMode: 'visual_grammar', imageQuizEligible: false, ambiguityRisk: 'high', width: 1618, height: 1000, promptSha256: hash(prompt), model: 'deterministic-svg', quality: 'lossless', review, provenance: 'Diagrama editorial Míng. Etiquetas de apoyo visual; no imagen del libro ni evidencia de identidad. Plan y fuente SVG en docs/corpus-completion-diagrams-review.json.' });
  reviews.push({ wordId, hanzi: word.hanzi, spanish: word.spanish, prompt, promptSha256: hash(prompt), plan, source: `${directory}/${sourceFilename}`, sourceSha256, src: entries.at(-1).src, sha256: digest, bytes: bytes.length, width: info.width, height: info.height, transparentCorners: true, safeZonePixels, visiblePixels: visible, review });
}
await writeFile('data/corpus-completion-diagrams-media.json', `${JSON.stringify(entries, null, 2)}\n`);
await writeFile('docs/corpus-completion-diagrams-review.json', `${JSON.stringify({ schema_version: 1, style: 'ming-vocabulary-transparent-subject-golden-v2', generatedAt: '2026-11-19', method: 'Offline SVG diagrams with lossless transparent WebP derivatives; no paid API calls.', constraints: ['No curriculum changes', 'No invented documentary examples', 'Names shown as labels, never invented portraits', 'Images with explanatory labels excluded from visual quizzes'], entries: reviews }, null, 2)}\n`);
// This dedicated directory is owned by this generator; discard its superseded outputs.
const retained = new Set(reviews.flatMap(entry => [entry.source.split('/').at(-1), entry.src.split('/').at(-1)]));
for (const name of await readdir(directory)) if (/^[\da-f-]+\.(svg|webp)$/.test(name) && !retained.has(name)) await unlink(`${directory}/${name}`);
console.log(JSON.stringify({ diagrams: entries.length, bytes: reviews.reduce((sum, entry) => sum + entry.bytes, 0), transparentCorners: true, safeZonePixels: 0 }));
