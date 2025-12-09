//vitest
import { expect, it, describe } from "vitest";
import { parse } from "./index";
import {
  BlockCallout,
  BlockEmbed,
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
  list: [`1. First item`],
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

  it("parses title", async () => {
    const markdown = `# title`;
    const block = parse(markdown).blocks[0] as BlockHeading;
    expect(block.type).toBe(`header`);
    expect(block.data.level).toBe(1);
    expect(block.data.text).toBe("title");
  });

  it("parses cursive", async () => {
    const markdown = `*word*`;
    const block = parse(markdown).blocks[0] as BlockHeading;
    expect(block.type).toBe(`paragraph`);
    expect(block.data.text).toBe("<em>word</em>");
  });

  it("parses strong", async () => {
    const markdown = `**word**`;
    const block = parse(markdown).blocks[0] as BlockHeading;
    expect(block.type).toBe(`paragraph`);
    expect(block.data.text).toBe("<strong>word</strong>");
  });

  it("parses strikethrough", async () => {
    const markdown = `~~word~~`;
    const block = parse(markdown).blocks[0] as BlockHeading;
    expect(block.type).toBe(`paragraph`);
    expect(block.data.text).toBe("<del>word</del>");
  });

  it("parses title", async () => {
    const markdown = `### title`;
    const block = parse(markdown).blocks[0] as BlockHeading;
    expect(block.type).toBe(`header`);
    expect(block.data.level).toBe(3);
    expect(block.data.text).toBe("title");
  });

  it("parses quote", async () => {
    const markdown = `> saying`;
    const block = parse(markdown).blocks[0] as BlockQuote;
    expect(block.type).toBe(`quote`);
    expect(block.data.text).toBe("saying");
  });

  it("parses callout", async () => {
    const markdown = `> [! info] with title!\n> a callout block.`;
    const block = parse(markdown).blocks[0] as BlockCallout;
    expect(block.type).toBe(`callout`);
    expect(block.data.title).toBe("with title!");
    expect(block.data.kind).toBe("info");
    expect(block.data.text).toBe("a callout block.");
  });

  it("parses paragraph", async () => {
    const markdown = `hello there [link](http://google.com)`;
    const block = parse(markdown).blocks[0] as BlockParagraph;
    console.log(block.data.text);
    expect(block.type).toBe(`paragraph`);
    expect(block.data.text).toBe(
      `hello there <a href=\"http://google.com\">link</a>`
    );
  });

  it("parses image", async () => {
    const markdown = `![image.png](image.png)`;
    const { blocks } = parse(markdown);
    const block = blocks[0] as BlockImage;
    expect(block.type).toBe(`image`);
    expect(block.data.src).toBe("image.png");
    expect(block.data.caption).toBe("image.png");
  });

  it("parses obsidian image", async () => {
    const markdown = `![[image.png]]`;
    const { blocks } = parse(markdown);
    const block = blocks[0] as BlockImage;
    expect(block.type).toBe(`image`);
    expect(block.data.src).toBe("image.png");
    expect(block.data.caption).toBe("");
  });

  it("parses obsidian image", async () => {
    const markdown = `![[image.png|cool image]]`;
    const { blocks } = parse(markdown);
    const block = blocks[0] as BlockImage;
    expect(block.type).toBe(`image`);
    expect(block.data.src).toBe("image.png");
    expect(block.data.caption).toBe("cool image");
  });

  it("parses table with header", async () => {
    const markdown = `| Header1 | Header2 | Header3 |
  | ------- | ------- | ------- |
  | Cell1   | Cell2   | Cell3   |`;
    const { blocks } = parse(markdown);
    const block = blocks[0] as BlockTable;
    expect(block.type).toBe(`table`);
    expect(block.data.header).toEqual(["Header1", "Header2", "Header3"]);
    expect(block.data.rows).toEqual([["Cell1", "Cell2", "Cell3"]]);
  });

  it("break out the image", async () => {
    const markdown = `hello ![image](image.png) there`;
    const { blocks } = parse(markdown);
    expect(blocks[0].type).toBe(`paragraph`);
    expect(blocks[1].type).toBe(`image`);
    expect(blocks[2].type).toBe(`paragraph`);
  });

  it("break out the image", async () => {
    const markdown = `title [link](http://www.hi.com) ![[(image.png]]`;
    const { blocks } = parse(markdown);
    expect(blocks[0].type).toBe(`paragraph`);
    expect(blocks[1].type).toBe(`image`);
  });

  it("parses list", async () => {
    const markdown = `1. First item
2. Second item`;
    const { blocks } = parse(markdown);
    const block = blocks[0] as BlockList;
    expect(block.type).toBe(`list`);
    expect(block.data.style).toBe("ordered");
    expect(block.data.items).toEqual(["First item", "Second item"]);
  });

  it("parses unordered list", async () => {
    const markdown = ` - First item
 - Second item`;
    const { blocks } = parse(markdown);
    const block = blocks[0] as BlockList;
    expect(block.type).toBe(`list`);
    expect(block.data.style).toBe("unordered");
    expect(block.data.items).toEqual(["First item", "Second item"]);
  });

  it("combined", async () => {
    const markdown = `# title
    
hello ==marked text== there
    
**a fish***
    
  - an item
  - another item`;
    const { blocks } = parse(markdown);
    expect(JSON.stringify(blocks, null, 2)).toBe(`[
  {
    "type": "header",
    "data": {
      "text": "title",
      "level": 1
    }
  },
  {
    "type": "paragraph",
    "data": {
      "text": "hello <mark>marked text</mark> there"
    }
  },
  {
    "type": "paragraph",
    "data": {
      "text": "<strong>a fish</strong>*"
    }
  },
  {
    "type": "list",
    "data": {
      "style": "unordered",
      "items": [
        "an item",
        "another item"
      ]
    }
  }
]`);
  });
});

describe("additional parsing edge cases", () => {
  it("splits multiple inline images out of a single paragraph", () => {
    const markdown = `before ![one](one.png) middle ![two](two.png) after`;
    const { blocks } = parse(markdown);
    expect(blocks.map((b) => b.type)).toEqual([
      "paragraph",
      "image",
      "paragraph",
      "image",
      "paragraph",
    ]);
    expect((blocks[1] as BlockImage).data.src).toBe("one.png");
    expect((blocks[3] as BlockImage).data.src).toBe("two.png");
    expect((blocks[0] as BlockParagraph).data.text).toBe("before");
    expect((blocks[2] as BlockParagraph).data.text).toBe("middle");
    expect((blocks[4] as BlockParagraph).data.text).toBe("after");
  });

  it("does not break out inline <mark> or <b> elements as separate blocks", () => {
    const markdown = `a <mark>tagged</mark> and <b>bold</b> text`;
    const { blocks } = parse(markdown);
    expect(blocks.length).toBe(1);
    const p = blocks[0] as BlockParagraph;
    expect(p.type).toBe("paragraph");
    expect(p.data.text).toBe("a <mark>tagged</mark> and <b>bold</b> text");
  });

  it("handles callout without title", () => {
    const markdown = `> [!warning]\n> Be careful`;
    const block = parse(markdown).blocks[0] as BlockCallout;
    expect(block.type).toBe("callout");
    expect(block.data.kind).toBe("warning");
    expect(block.data.title).toBe("");
    expect(block.data.text).toBe("Be careful");
  });

  it("handles callout with multi-line body", () => {
    const markdown = `> [!note] title\n> first line\n> second line`;
    const block = parse(markdown).blocks[0] as BlockCallout;
    expect(block.type).toBe("callout");
    expect(block.data.kind).toBe("note");
    expect(block.data.title).toBe("title");
    expect(block.data.text).toBe("first line\nsecond line");
  });

  it("embeds YouTube when image href is a YouTube URL", () => {
    const markdown = `![](https://www.youtube.com/watch?v=dQw4w9WgXcQ)`;
    const { blocks } = parse(markdown);
    expect(blocks[0].type).toBe("embed");
    const embed = blocks[0] as BlockEmbed;
    expect(embed.data.service).toBe("youtube");
    expect(embed.data.id).toBe("dQw4w9WgXcQ");
  });

  //TODO: this should keep as 1 paragraph block
  it.skip("keeps regular link as paragraph (no embed)", () => {
    const markdown = `See this <a href=\"https://www.youtube.com/watch?v=dQw4w9WgXcQ\">link</a>`;
    const { blocks } = parse(markdown);
    console.log(blocks);
    expect(blocks.length).toBe(1);
    expect(blocks[0].type).toBe("paragraph");
  });
});
