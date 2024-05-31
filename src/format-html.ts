export function formatHtml(html: string) {
  const indentChar = "  ";
  let indentLevel = 0;
  return html
    .replace(/(<\/?[^>]+>)/g, (match) => {
      if (match.startsWith("</")) {
        indentLevel--;
      }
      const formatted = `${indentChar.repeat(indentLevel)}${match}\n`;
      if (
        match.startsWith("<") &&
        !match.startsWith("</") &&
        !match.endsWith("/>")
      ) {
        indentLevel++;
      }
      return formatted;
    })
    .trim();
}
