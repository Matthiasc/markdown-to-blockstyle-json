export function removeOuterHTMLTags(htmlString: string) {
  return htmlString.replace(/^\s*<[^>]+>\s*|\s*<\/[^>]+>\s*$/g, "").trim();
}
