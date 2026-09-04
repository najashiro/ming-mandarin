import type { HTMLAttributes } from 'react';
import { normalizePinyin } from '@/lib/pinyin';

type PinyinTextProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  children: string;
};

export function PinyinText({ children, className = '', ...props }: PinyinTextProps) {
  const classes = ['pinyin-text', className].filter(Boolean).join(' ');
  return <span {...props} className={classes} lang="zh-Latn-pinyin">{normalizePinyin(children)}</span>;
}
