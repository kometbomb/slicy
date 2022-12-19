export let safeDocument: Document | null = null;
if (typeof window !== "undefined") {
  safeDocument = document;
}
