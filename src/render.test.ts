//vitest
import { expect, it, describe } from "vitest";
import { parse, render } from "./index";
import { RenderOptions } from "./render";
import { ParseOptions } from "./parse";

// Example usage
const markdown = `
# Heading 1

This is a paragraph with an ![image](image.png) inside it and a [link](http://www.google.com).

## Heading 2

Another paragraph with a \`code\` snippet inside.

\`\`\`javascript
console.log('Hello, world!');
\`\`\`

> This is a blockquote with a [link](http://www.google.com).

1. First item
2. Second item

| Header1 | Header2 |
| ------- | ------- |
| Cell1   | Cell2   |

---

This is a paragraph with an HTML block:

<div>
  <p>HTML content</p>
</div>

some \`inline\` code

http://www.google.com

![image](image.jpeg)

> [!info]
> info message
> info message [link](http://www.hello.com)

`;

const basics = [
  { markdown: `==marked text==`, html: `<p><mark>marked text</mark></p>` },
  {
    markdown: `start==marked text==end`,
    html: `<p>start<mark>marked text</mark>end</p>`,
  },
  {
    markdown: `hello there
  
  ==marked text==`,
    html: `<p>hello there</p>
<p><mark>marked text</mark></p>`,
  },
  { markdown: `**bold text**`, html: `<p><strong>bold text</strong></p>` },
  { markdown: `<b>bold text</b>`, html: `<p><b>bold text</b></p>` },
  { markdown: `__bold text__`, html: `<p><strong>bold text</strong></p>` },
  { markdown: `*emph text*`, html: `<p><em>emph text</em></p>` },
  { markdown: `_emph text_`, html: `<p><em>emph text</em></p>` },
  {
    markdown: `~~strikethrough text~~`,
    html: `<p><del>strikethrough text</del></p>`,
  },
  { markdown: `hello there!`, html: `<p>hello there!</p>` },
  { markdown: `# title`, html: `<h1>title</h1>` },
  { markdown: `## title`, html: `<h2>title</h2>` },
  {
    markdown: `![link](http://www.google.com/pic.jpg)`,
    html: `<figure>
  <img src="http://www.google.com/pic.jpg" alt="link" width="100" height="100">
  <figcaption>link</figcaption>
</figure>`,
  },
  {
    markdown: `![[http://www.google.com/pic.jpg]]`,
    html: `<figure>
  <img src="http://www.google.com/pic.jpg" alt="" width="100" height="100">
</figure>`,
  },
  {
    markdown: `![[http://www.google.com/pic.jpg|my caption]]`,
    html: `<figure>
  <img src="http://www.google.com/pic.jpg" alt="my caption" width="100" height="100">
  <figcaption>my caption</figcaption>
</figure>`,
  },
  {
    markdown: `[link](http://www.google.com)`,
    html: `<p><a href="http://www.google.com">link</a></p>`,
  },
  {
    markdown: `[[http:///www.google.com]]`,
    html: `<p><a href="http:///www.google.com">http:///www.google.com</a></p>`,
  },
  {
    markdown: `<div>
    <p>HTML content</p>
  </div>`,
    html: `<div>
    <p>HTML content</p>
  </div>`,
  },
  {
    markdown: `some \`inline\` code`,
    html: `<p>some <code>inline</code> code</p>`,
  },
  {
    markdown: `http://www.google.com`,
    html: `<p><a href="http://www.google.com">http://www.google.com</a></p>`,
  },
  {
    markdown: `![image](image.jpeg)`,
    html: `<figure>
  <img src="image.jpeg" alt="image" width="100" height="100">
  <figcaption>image</figcaption>
</figure>`,
  },
  {
    markdown: `| Header1 | Header2 |
| ------- | ------- |
| Cell1   | Cell2   |`,
    html: `<table>
  <thead>
  <tr>
    <th>Header1</th><th>Header2</th>
  </tr>
  </thead>
  <tbody>
    <tr><td>Cell1</td><td>Cell2</td></tr>
  </tbody>
</table>`,
  },
  {
    markdown: `> [!info]
> info message [link](http://www.hello.com)`,
    html: `<div class="callout" data-callout="info">
  <div class="callout-content">info message <a href="http://www.hello.com">link</a></div>
</div>`,
  },
  {
    markdown: `> [!warning] title
> info message`,
    html: `<div class="callout" data-callout="warning">
  <div class="callout-title">title</div>
  <div class="callout-content">info message</div>
</div>`,
  },
  {
    markdown: `> [!warning] title`,
    html: `<div class="callout" data-callout="warning">
  <div class="callout-title">title</div>
</div>`,
  },

  {
    markdown: `![](https://www.youtube.com/watch?v=dQw4w9WgXcQ)`,
    html: `<iframe width="900" height="600" class="embed embed-youtube" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen=""></iframe>`,
  },
];

const renderOptions: RenderOptions = {
  lazyLoadImages: false,
  embedYoutubeDimensions: {
    width: 900,
    height: 600,
  },
};
const parseOptions: ParseOptions = {
  getImageDimensions: (src) => {
    return { width: 100, height: 100 };
  },
};

describe("parse to blocks", () => {
  it("parses basics", async () => {
    basics.forEach(({ markdown, html }) => {
      const { blocks } = parse(markdown, parseOptions);

      expect(render(blocks, {}, renderOptions)).toBe(html);
    });
  });
});

describe("parse custom <mark> markdown", () => {
  it("parses custom markdown", async () => {
    const markdown = `This is some text

with a ==marked== word`;
    const { blocks } = parse(markdown);

    expect(render(blocks, {})).toBe(`<p>This is some text</p>
<p>with a <mark>marked</mark> word</p>`);
  });
});
