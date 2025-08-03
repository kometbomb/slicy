export let safeDocument: Document | null = null;
export let safeWindow: Window | null = null;

if (typeof window !== "undefined") {
  safeDocument = document;
  safeWindow = window;
}
