const HTML_TAG_RE = /<\/?[a-z][\s\S]*>/i;

const HTML_ENTITIES = {
  "&nbsp;": " ",
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
};

export const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const hasHtmlTags = (value = "") => HTML_TAG_RE.test(String(value));

export const toRichTextHtml = (value = "") => {
  const normalized = String(value ?? "").trim();
  if (!normalized) return "";
  if (hasHtmlTags(normalized)) return normalized;

  return escapeHtml(normalized).replace(/\r?\n/g, "<br />");
};

export const richTextToPlainText = (value = "") =>
  String(value ?? "")
    .replace(/<\/div>\s*<div>/gi, "\n")
    .replace(/<\/p>\s*<p>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(
      /&nbsp;|&amp;|&lt;|&gt;|&quot;|&#39;/g,
      (entity) => HTML_ENTITIES[entity] ?? entity
    )
    .trim();

