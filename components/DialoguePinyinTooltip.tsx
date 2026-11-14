'use client';

import { useEffect, useId, useRef, type RefObject } from 'react';

export function DialoguePinyinTooltip({ reader }: { reader: RefObject<HTMLDivElement | null> }) {
  const id = useId();
  const tooltip = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = reader.current;
    const tip = tooltip.current;
    if (!root || !tip) return;
    const controller = new AbortController();
    const { signal } = controller;
    let active: HTMLElement | null = null;
    let press: { glyph: HTMLElement; pointerId: number; x: number; y: number; timer: number } | undefined;
    let held: HTMLElement | null = null;

    const glyphAt = (target: EventTarget | null) => target instanceof Element && root.contains(target)
      ? target.closest<HTMLElement>('[data-dialogue-pinyin]') : null;

    const hide = () => {
      active?.removeAttribute('aria-describedby');
      active = null;
      tip.hidden = true;
    };

    const position = () => {
      if (!active) return;
      const rect = active.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return hide();
      const width = tip.offsetWidth;
      const left = rect.left + (rect.width - width) / 2;
      tip.style.left = `${Math.max(4, Math.min(left, document.documentElement.clientWidth - width - 4))}px`;
      tip.style.top = `${rect.top >= tip.offsetHeight ? rect.top - tip.offsetHeight : rect.bottom}px`;
    };

    const show = (glyph: HTMLElement) => {
      if (glyph === active) return;
      active?.removeAttribute('aria-describedby');
      active = glyph;
      tip.textContent = glyph.dataset.dialoguePinyin ?? '';
      tip.hidden = false;
      position();
      if (active) glyph.setAttribute('aria-describedby', id);
    };

    function cancelPress() {
      if (press) window.clearTimeout(press.timer);
      press = undefined;
    }

    root.addEventListener('pointerover', event => {
      const glyph = glyphAt(event.target);
      if (!press && event.pointerType !== 'touch' && glyph) show(glyph);
    }, { signal });
    root.addEventListener('pointerout', event => {
      if (press || event.pointerType === 'touch' || event.relatedTarget === tip || glyphAt(event.relatedTarget) === active) return;
      const focused = glyphAt(document.activeElement);
      if (focused?.matches(':focus-visible')) show(focused);
      else hide();
    }, { signal });
    root.addEventListener('focusin', event => {
      const glyph = glyphAt(event.target);
      if (glyph) show(glyph);
    }, { signal });
    root.addEventListener('focusout', hide, { signal });
    document.addEventListener('keydown', event => {
      held = null;
      if (event.key === 'Escape') hide();
    }, { signal });

    // A short touch follows the existing link. Only a completed hold consumes its click.
    document.addEventListener('pointerdown', event => {
      cancelPress();
      held = null;
      const glyph = glyphAt(event.target);
      if (!glyph) return hide();
      if (!event.isPrimary || event.pointerType !== 'touch') return;
      hide();
      const timer = window.setTimeout(() => {
        held = glyph;
        show(glyph);
      }, 450);
      press = { glyph, pointerId: event.pointerId, x: event.clientX, y: event.clientY, timer };
    }, { signal });
    root.addEventListener('pointermove', event => {
      if (press?.pointerId === event.pointerId && Math.hypot(event.clientX - press.x, event.clientY - press.y) > 10) cancelPress();
    }, { signal });
    const endPress = (event: PointerEvent) => {
      if (press?.pointerId === event.pointerId) cancelPress();
    };
    document.addEventListener('pointerup', endPress, { signal });
    document.addEventListener('pointercancel', endPress, { signal });
    root.addEventListener('contextmenu', event => {
      const glyph = glyphAt(event.target);
      if (glyph && (glyph === press?.glyph || glyph === held)) event.preventDefault();
    }, { signal });
    document.addEventListener('click', event => {
      if (!held || glyphAt(event.target) !== held || event.detail === 0) return;
      held = null;
      event.preventDefault();
      event.stopPropagation();
    }, { capture: true, signal });
    window.addEventListener('scroll', position, { passive: true, signal });
    window.addEventListener('resize', position, { signal });
    return () => {
      cancelPress();
      hide();
      controller.abort();
    };
  }, [reader, id]);

  return <div ref={tooltip} id={id} role="tooltip" lang="zh-Latn-pinyin" className="dialogue-pinyin-tooltip" hidden/>;
}
