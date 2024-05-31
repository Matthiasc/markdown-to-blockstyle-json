import {
  Block,
  BlockCallout,
  BlockCode,
  BlockHeading,
  BlockImage,
  BlockList,
  BlockParagraph,
  BlockQuote,
  BlockTable,
  BlockHtml,
  BlockDelimiter,
} from "./types";

const defaultRenderFunctions = Object.freeze({
  paragraph: renderParagraph,
  header: renderHeader,
  image: renderImage,
  code: renderCode,
  quote: renderQuote,
  list: renderList,
  table: renderTable,
  delimiter: renderDelimiter,
  html: renderHtml,
  callout: renderCallout,
});

export function render(
  blocks: Block[],
  renderFunctions = defaultRenderFunctions
) {
  renderFunctions = { ...defaultRenderFunctions, ...renderFunctions };

  return blocks
    .map((b) => {
      const renderFunction = renderFunctions[b.type];
      if (renderFunction) return renderFunction(b);
      return "";
    })
    .join("\n");
}

export function renderParagraph(block: BlockParagraph) {
  return `<p>${block.data.text}</p>`;
}

export function renderHeader(block: BlockHeading) {
  return `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
}

export function renderImage(block: BlockImage) {
  return `<img src="${block.data.src}" alt="${block.data.caption}">`;
}

export function renderCode(block: BlockCode) {
  return `<pre><code>${block.data.text}</code></pre>`;
}

export function renderQuote(block: BlockQuote) {
  return `<blockquote>${block.data.text}</blockquote>`;
}

export function renderList(block: BlockList) {
  const tag = block.data.style === "ordered" ? "ol" : "ul";
  return `<${tag}>
${block.data.items.map((item) => `<li>${item}</li>`).join("\n")}
</${tag}>`;
}

export function renderTable(block: BlockTable) {
  return `<table>
  <thead>
  <tr>
    ${block.data.header.map((cell) => `<th>${cell}</th>`).join("")}
  </tr>
  </thead>
  <tbody>
    ${block.data.rows
      .map(
        (row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`
      )
      .join("")}
  </tbody>
</table>`;
}

export function renderDelimiter(block: BlockDelimiter) {
  return `<hr>`;
}

export function renderHtml(block: BlockHtml) {
  return block.data.html;
}

export function renderCallout(block: BlockCallout) {
  const hasTitle = block.data.title !== "";

  return `<div class="callout" data-callout="${block.data.kind}">${
    hasTitle ? `\n  <div class="callout-title">${block.data.title}</div>` : ""
  }
  <div class="callout-content">${block.data.text}</div>
</div>`.trim();
}
