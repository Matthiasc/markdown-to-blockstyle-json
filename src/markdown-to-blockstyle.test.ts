//vitest
import { expect, it, describe } from "vitest";
import markdownToBlockStyle, { BlockImage, BlockTable } from "./index";

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

const markdown_2 = `
# title with a [link](http://www.google.com)

hello this is  an ![image](image.png) for you!

This is a paragraph with a [link](http://www.google.com).`;

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
  //   it("parses basics", async () => {
  //     Object.entries(basics).forEach(([type, values]: [string, string[]]) => {
  //       values.forEach((s) => {
  //         const { blocks } = markdownToBlockStyle(s);
  //         console.log(blocks);
  //         expect(blocks[0].type).toBe(type);
  //       });
  //     });
  //   });
  //   // it("parses title", async () => {
  //   //   const markdown = `# title`;
  //   //   const { blocks } = markdownToBlockStyle(markdown);
  //   //   console.log(JSON.stringify(blocks, null, 2));
  //   //   expect(blocks[0].type).toBe(`header`);
  //   //   expect(blocks[0].data.level).toBe(1);
  //   //   expect(blocks[0].data.text).toBe("title");
  //   // });
  //   it("TEST", async () => {
  //     const markdown = `title [link](http://www.hi.com) ![img](image.png)`;
  //     const { blocks } = markdownToBlockStyle(markdown);
  //     console.log(JSON.stringify(blocks, null, 2));
  //     expect(blocks[0].type).toBe(`paragraph`);
  //   });
  //   it("parses title", async () => {
  //     const markdown = `# title`;
  //     const { blocks } = markdownToBlockStyle(markdown);
  //     expect(blocks[0].type).toBe(`header`);
  //     expect(blocks[0].data.level).toBe(1);
  //     expect(blocks[0].data.text).toBe("title");
  //   });
  //   it("parses quote", async () => {
  //     const markdown = `> saying`;
  //     const { blocks } = markdownToBlockStyle(markdown);
  //     expect(blocks[0].type).toBe(`quote`);
  //     // expect(blocks[0].data.level).toBe(1);
  //     expect(blocks[0].data.text).toBe("saying");
  //   });
  //   it("parses callout", async () => {
  //     const markdown = `> [! info] with title!
  // > a callout block.`;
  //     const { blocks } = markdownToBlockStyle(markdown);
  //     expect(blocks[0].type).toBe(`callout`);
  //     // expect(blocks[0].data.level).toBe(1);
  //     expect(blocks[0].data.title).toBe("with title!");
  //     expect(blocks[0].data.kind).toBe("info");
  //     expect(blocks[0].data.text).toBe("a callout block.");
  //   });
  //   it("parses paragraph", async () => {
  //     const markdown = `hello there [link](http://google.com)`;
  //     const { blocks } = markdownToBlockStyle(markdown);
  //     expect(blocks[0].type).toBe(`paragraph`);
  //     expect(blocks[0].data.text).toBe(
  //       `hello there <a href=\"http://google.com\">link</a>`
  //     );
  //   });
  //   //parse image and table
  it("parses image", async () => {
    const markdown = `![image](image.png)`;
    const { blocks } = markdownToBlockStyle(markdown);
    const block = blocks[0] as BlockImage;
    expect(block.type).toBe(`image`);
    expect(block.data.src).toBe("image.png");
  });

  it("parses table", async () => {
    const markdown = `| Header1 | Header2 | Header3 |
  | ------- | ------- | ------- |
  | Cell1   | Cell2   | Cell3   |`;
    const { blocks } = markdownToBlockStyle(markdown);
    const block = blocks[0] as BlockTable;
    expect(block.type).toBe(`table`);
    expect(block.data.header).toEqual(["Header1", "Header2", "Header3"]);
    expect(block.data.rows).toEqual([["Cell1", "Cell2", "Cell3"]]);
  });
});
// const result = markdownToBlockStyle(markdown_2);
// console.log(JSON.stringify(result, null, 2));
