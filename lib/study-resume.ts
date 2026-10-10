const KEY = 'ming-last-study-v1';
const routePattern = /^\/study\/(l1|l2|l3|l4|l1-l2|l1-l2-l3|l1-l2-l3-l4)(?:\/(vocabulary|dialogues|grammar|hanzi|radicals|games|daily|exam|readings|exercises))?$/;

export function getLastStudy(): string {
  try {
    const value = window.localStorage.getItem(KEY) ?? '';
    return routePattern.test(value) ? value : '';
  } catch { return ''; }
}
export function rememberStudy(path: string) {
  if (!routePattern.test(path)) return;
  try {
    window.localStorage.setItem(KEY, path);
    window.dispatchEvent(new Event('ming-study-change'));
  } catch { /* Studying remains available when storage is disabled. */ }
}
export function subscribeToStudy(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('ming-study-change', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('ming-study-change', callback);
  };
}
