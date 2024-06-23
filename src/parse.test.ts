//vitest
import { expect, it, describe } from "vitest";
import { parse } from "./index";
import {
  BlockCallout,
  BlockHeading,
  BlockImage,
  BlockList,
  BlockParagraph,
  BlockQuote,
  BlockTable,
} from "./types";

const basics: { [key: string]: string[] } = {
  paragraph: ["hello there!", "hello there with [link](http://google.com)"],
  code: [
    `\`\`\`javascript
    var name = "me"
    \`\`\`
    `,
  ],
  header: [
    "# title",
    "## title ",
    "### title ",
    "#### title ",
    "#### title ",
    "##### title ",
  ],
  image: [
    "![link](pic.jpg)",
    "![[pic.jpg]]",
    "![link](https://www.domain.com/pic.jpg)",
    "![[https://www.domain.com/pic.jpg]]",
    "![[image.jpg|cool image]]",
  ],
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
  embed: [`![](https://www.youtube.com/watch?v=dQw4w9WgXcQ)`],
};

const getImageDimensions = (src: string) => {
  console.log("getImageDimensions", src);
  return { width: 100, height: 100 };
};

describe("parse to blocks", () => {
  it("parses basics", async () => {
    Object.entries(basics).forEach(([type, values]: [string, string[]]) => {
      values.forEach((s) => {
        const { blocks } = parse(s, { getImageDimensions });
        // console.log("BLOCKS", blocks);
        expect(blocks[0].type).toBe(type);
      });
    });
  });

  //   it("parses title", async () => {
  //     const markdown = `# title`;
  //     const block = parse(markdown).blocks[0] as BlockHeading;
  //     expect(block.type).toBe(`header`);
  //     expect(block.data.level).toBe(1);
  //     expect(block.data.text).toBe("title");
  //   });

  //   it("parses title", async () => {
  //     const markdown = `# title`;
  //     const block = parse(markdown).blocks[0] as BlockHeading;
  //     expect(block.type).toBe(`header`);
  //     expect(block.data.level).toBe(1);
  //     expect(block.data.text).toBe("title");
  //   });

  //   it("parses quote", async () => {
  //     const markdown = `> saying`;
  //     const block = parse(markdown).blocks[0] as BlockQuote;
  //     expect(block.type).toBe(`quote`);
  //     expect(block.data.text).toBe("saying");
  //   });

  //   it("parses callout", async () => {
  //     const markdown = `> [! info] with title!\n> a callout block.`;
  //     const block = parse(markdown).blocks[0] as BlockCallout;
  //     expect(block.type).toBe(`callout`);
  //     expect(block.data.title).toBe("with title!");
  //     expect(block.data.kind).toBe("info");
  //     expect(block.data.text).toBe("a callout block.");
  //   });

  //   it("parses paragraph", async () => {
  //     const markdown = `hello there [link](http://google.com)`;
  //     const block = parse(markdown).blocks[0] as BlockParagraph;
  //     console.log(block.data.text);
  //     expect(block.type).toBe(`paragraph`);
  //     expect(block.data.text).toBe(
  //       `hello there <a href=\"http://google.com\">link</a>`
  //     );
  //   });

  //   it("parses image", async () => {
  //     const markdown = `![image.png](image.png)`;
  //     const { blocks } = parse(markdown);
  //     const block = blocks[0] as BlockImage;
  //     expect(block.type).toBe(`image`);
  //     expect(block.data.src).toBe("image.png");
  //     expect(block.data.caption).toBe("image.png");
  //   });

  //   it("parses obsidian image", async () => {
  //     const markdown = `![[image.png]]`;
  //     const { blocks } = parse(markdown);
  //     const block = blocks[0] as BlockImage;
  //     expect(block.type).toBe(`image`);
  //     expect(block.data.src).toBe("image.png");
  //     expect(block.data.caption).toBe("");
  //   });

  //   it("parses obsidian image", async () => {
  //     const markdown = `![[image.png|cool image]]`;
  //     const { blocks } = parse(markdown);
  //     const block = blocks[0] as BlockImage;
  //     expect(block.type).toBe(`image`);
  //     expect(block.data.src).toBe("image.png");
  //     expect(block.data.caption).toBe("cool image");
  //   });

  //   it("parses table with header", async () => {
  //     const markdown = `| Header1 | Header2 | Header3 |
  // | ------- | ------- | ------- |
  // | Cell1   | Cell2   | Cell3   |`;
  //     const { blocks } = parse(markdown);
  //     const block = blocks[0] as BlockTable;
  //     expect(block.type).toBe(`table`);
  //     expect(block.data.header).toEqual(["Header1", "Header2", "Header3"]);
  //     expect(block.data.rows).toEqual([["Cell1", "Cell2", "Cell3"]]);
  //   });

  //   it("break out the image", async () => {
  //     const markdown = `hello ![image](image.png) there`;
  //     const { blocks } = parse(markdown);
  //     expect(blocks[0].type).toBe(`paragraph`);
  //     expect(blocks[1].type).toBe(`image`);
  //     expect(blocks[2].type).toBe(`paragraph`);
  //   });

  //   it("break out the image", async () => {
  //     const markdown = `title [link](http://www.hi.com) ![[(image.png]]`;
  //     const { blocks } = parse(markdown);
  //     expect(blocks[0].type).toBe(`paragraph`);
  //     expect(blocks[1].type).toBe(`image`);
  //   });

  //   it("parses list", async () => {
  //     const markdown = `1. First item
  //   2. Second item`;
  //     const { blocks } = parse(markdown);
  //     const block = blocks[0] as BlockList;
  //     expect(block.type).toBe(`list`);
  //     expect(block.data.style).toBe("ordered");
  //     expect(block.data.items).toEqual(["First item", "Second item"]);
  //   });

  //   it("parses unordered list", async () => {
  //     const markdown = ` - First item
  //   - Second item`;
  //     const { blocks } = parse(markdown);
  //     const block = blocks[0] as BlockList;
  //     expect(block.type).toBe(`list`);
  //     expect(block.data.style).toBe("unordered");
  //     expect(block.data.items).toEqual(["First item", "Second item"]);
  //   });
});
