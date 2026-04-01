// Module-level loading counter — works outside React components (e.g. axios interceptors)
let activeRequests = 0;
let notify: ((loading: boolean) => void) | null = null;

export function registerLoadingNotifier(fn: (loading: boolean) => void) {
  notify = fn;
}

export function startLoading() {
  activeRequests++;
  notify?.(true);
}

export function stopLoading() {
  activeRequests = Math.max(0, activeRequests - 1);
  if (activeRequests === 0) notify?.(false);
}
