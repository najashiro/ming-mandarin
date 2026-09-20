'use client';
import { useState } from 'react';
import { Hanzi } from '@/components/Hanzi';

export function AnswerBlocks({ blocks, onChange, disabled = false }: { blocks: string[]; onChange: (answer: string) => void; disabled?: boolean }) {
  const [order, setOrder] = useState<number[]>([]);
  // Stable scrambled tray: duplicated words retain separate identities.
  const tray = blocks.map((_, index) => index).reverse();
  function update(next: number[]) { setOrder(next); onChange(next.map(index => blocks[index]).join('')); }
  return <div className="answer-blocks"><p>Toca para colocar; toca un bloque colocado para retirarlo.</p><div className="blocks-target" aria-label="Tu oración">{order.length === 0 && <span>Construye aquí…</span>}{order.map(index => <button disabled={disabled} key={index} onClick={() => update(order.filter(id => id !== index))}><Hanzi>{blocks[index]}</Hanzi></button>)}</div><div className="blocks-tray">{tray.map(index => <button disabled={disabled || order.includes(index)} key={index} onClick={() => update([...order, index])}><Hanzi>{blocks[index]}</Hanzi></button>)}</div></div>;
}
