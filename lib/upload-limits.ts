// Safe to import from both server and client code (no Node built-ins here).
// Kept comfortably under the 20mb Server Action body limit in next.config.ts,
// to leave headroom for the rest of the form (text fields, multipart overhead).
export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
export const MAX_UPLOAD_MB = MAX_UPLOAD_BYTES / 1024 / 1024;
