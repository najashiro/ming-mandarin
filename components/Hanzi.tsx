import { Children, Fragment, isValidElement, type ReactNode } from 'react';

const hanziRun = /([\p{Script=Han}\u2e80-\u2eff\u2f00-\u2fdf\u3000-\u303f\uff01\uff08\uff09\uff0c\uff1a\uff1b\uff1f]+)/u;

/** Preserve mixed text verbatim; only Chinese runs receive the hosted font. */
export function Hanzi({ children }: { children: ReactNode }) {
  return Children.map(children, (child) => {
    // Conditional stroke labels contain fragments alongside PinyinText.
    // Recurse into fragments while preserving other components unchanged.
    if (isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment) {
      return <Hanzi>{child.props.children}</Hanzi>;
    }
    return typeof child === 'string' ? child.split(hanziRun).map((part, index) => index % 2
      ? <span className="font-hanzi hanzi-run" lang="zh-CN" key={index}>{part}</span>
      : part)
      : child;
  });
}

/** Native inputs cannot contain spans; retain their original font for pinyin. */
export function hanziInputClass(value: string) {
  return /\p{Script=Han}/u.test(value) ? 'font-hanzi' : '';
}
