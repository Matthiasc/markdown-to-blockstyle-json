//vitest
import { expect, it, describe } from "vitest";
import { parse, render } from "./index";
import {
  BlockCallout,
  BlockHeading,
  BlockParagraph,
  BlockQuote,
} from "./types";

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

const basics: { [key: string]: string[] } = {
  paragraph: ["hello there!", "hello there with [link](http://google.com)"],
  code: [
    `\`\`\`javascript
var name = "me"
\`\`\`
  `,
  ],
  header: ["# title", "## title "],
  image: ["![link](pic.jpg)", "![[pic.jpg]]"],
  quote: [
    "> This is a blockquote.",
    `> quote on two
  > lines`,
  ],
  html: [
    `<div>
    <p>HTML content</p>
  </div>`,
  ],
  table: [
    `| Header1 | Header2 |
  | ------- | ------- |
  | Cell1   | Cell2   |`,
  ],
  list: [
    `1. First item
    2. Second item`,
  ],
  callout: [
    `> [!info]
> Here's a callout block [link](http://www.google.com).`,
    `> [! info] with title!
> Here's a callout block.`,
  ],
};

describe("parse to blocks", () => {
  it("parses basics", async () => {
    Object.entries(basics).forEach(([type, values]: [string, string[]]) => {
      values.forEach((s) => {
        const { blocks } = parse(s);
        const res = render(blocks);
        console.log(res);
        expect(res).toBeDefined();
      });
    });
  });
});
