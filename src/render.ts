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

export type RenderFunctions = {
  paragraph?: (block: BlockParagraph) => string;
  header?: (block: BlockHeading) => string;
  image?: (block: BlockImage) => string;
  code?: (block: BlockCode) => string;
  quote?: (block: BlockQuote) => string;
  list?: (block: BlockList) => string;
  table?: (block: BlockTable) => string;
  delimiter?: (block: BlockDelimiter) => string;
  html?: (block: BlockHtml) => string;
  callout?: (block: BlockCallout) => string;
};

export type RenderOptions = {
  lazyLoadImages?: boolean;
};

const defaultRenderOptions = Object.freeze({
  lazyLoadImages: true,
});

export function render(
  blocks: Block[],
  renderFunctions?: RenderFunctions,
  options?: RenderOptions
) {
  renderFunctions = { ...defaultRenderFunctions, ...renderFunctions };
  options = { ...defaultRenderOptions, ...options };

  return blocks
    .map((b) => {
      const renderFunction:
        | undefined
        | ((b: any, options: RenderOptions) => string) =
        renderFunctions[b.type];
      if (renderFunction) return renderFunction(b, options);
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

export function renderImage(block: BlockImage, options?: RenderOptions) {
  const { lazyLoadImages = true } = options || {};

  return `<figure>
  <img src="${block.data.src}" alt="${block.data.caption}"${
    lazyLoadImages ? " loading='lazy'" : ""
  }>
  ${
    block.data.caption?.length
      ? `<figcaption>${block.data.caption}</figcaption>`
      : ""
  }
</figure>`;
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
