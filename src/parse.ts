import { marked, Tokenizer, Lexer, Renderer } from "marked";
import omtm from "@matthiasc/obsidian-markup-to-markdown";
import { extractYouTubeVideoId } from "./extract-YouTube-videoId.js";

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
  BlockEmbed,
} from "./blocks.js";
let _options: any;

const INLINE_ELEMENTS = [
  "<mark>",
  "<b>",
  // "<strong>",
  // "<i>",
  // "<em>",
  // "<del>",
  // "<ins>",
  // "<sub>",
  // "<sup>",
  // "<a>",
];
/**
 * this will turn markdown or (basic) obsidian markdown into blockstyled json
 * It will make sure that any image will be a block on it's own and pushed out of a paragraph or any other element
 * You will end up with a flat and none-heirachical list of blocks such as paragraph, image, list, code, table, etc...
 * one should fairly easily be able to reconstruct html through those blocks.
 * It will also convert obsidian style callouts
 * @param markdown
 * @param options
 * @param options.transformLink - transform links/href/src from image and link tags
 * @param options.removeComments - remove comments from the markdown
 * @param options.getPropsForBlock - get extra or override props for a block
 * @returns
 */

export type ParseOptions = {
  transformLink?: (link: string) => string;
  removeComments?: boolean;
  defaultImageLinkAsCaption?: boolean;
  getImageDimensions?: (src: string) => {
    width: number;
    height: number;
  };
};

export function parse(markdown: string, options?: ParseOptions) {
  const {
    transformLink,
    removeComments,
    defaultImageLinkAsCaption = false,
  } = options || {};

  // remove the most common zerowidth characters from the start of the file (might interfere with marked parsing otherwise)
  markdown = markdown.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, "");

  //transform to regular markdown
  markdown = omtm(markdown, {
    defaultImageLinkAsCaption,
    urlEncodeUri: true,
  });

  if (removeComments) markdown = markdown.replace(/<!--[\s\S]*?-->/g, "");

  _options = {
    gfm: true,
    tokenizer: new CustomTokenizer({
      transformLink,
    }),
  };

  let tokens = new marked.Lexer(_options).lex(markdown);

  const blocks = parseTokensToBlocks(tokens, options);

  return {
    time: Date.now(),
    blocks,
  };
}

function parseTokensToBlocks(tokens: any[], options?: ParseOptions): Block[] {
  const blocks: Block[] = [];

  tokens.forEach((token) => {
    if (token.tokens) {
      let noneBreakoutTokenGroup: any[] = [];

      token.tokens.forEach((childToken: any) => {
        const isBreakOutEl = isBreakOutElement(childToken);

        if (isBreakOutEl) {
          //push these tokens already as one block;
          if (noneBreakoutTokenGroup.length) {
            const b = tokenToBlock(
              {
                ...token,
                tokens: noneBreakoutTokenGroup,
              },
              options
            );
            if (b) blocks.push(b);
          }

          //push this as a seperate block
          const b = tokenToBlock(childToken, options);
          if (b) blocks.push(b);

          //reset the none breakout token group
          noneBreakoutTokenGroup = [];
        } else {
          noneBreakoutTokenGroup.push(childToken);
        }
      });

      if (noneBreakoutTokenGroup.length) {
        const b = tokenToBlock(
          {
            ...token,
            tokens: noneBreakoutTokenGroup,
          },
          options
        );
        if (b) blocks.push(b);
      }
    } else {
      const block = tokenToBlock(token);
      if (block) blocks.push(block);
    }
  });

  return blocks;
}

class CustomTokenizer extends Tokenizer {
  transformLink;

  constructor({ transformLink }: { transformLink?: (link: string) => string }) {
    super({ gfm: true });
    // @ts-ignore
    this.transformLink = transformLink;
  }

  //@ts-ignore
  link(src: string) {
    //@ts-ignore
    const res = super.link.call(this, src);

    if (res) {
      if (this.transformLink) {
        res.originalHref = res.href;
        res.href = this.transformLink(res.href) as string;
      }
      return res;
    }
  }
}

// Usage example
function tokenToBlock(token: any, options?: ParseOptions) {
  //@ts-ignore
  if (blockHandlers[token.type])
    //@ts-ignore
    return blockHandlers[token.type](token, options);

  return null;
}

function parseInlineTokens(tokens: any[]) {
  return decodeURIComponent(
    removeOuterHTMLTags(
      marked
        //@ts-ignore
        .parser([{ type: "paragraph", tokens }], _options)
    )
  );
}

function removeOuterHTMLTags(htmlString: string) {
  return htmlString.replace(/^\s*<[^>]+>\s*|\s*<\/[^>]+>\s*$/g, "").trim();
}

function parseBlockTokens(tokens: any[]) {
  return (
    marked
      //@ts-ignore
      .parser(tokens, _options)
  );
}

function isBreakOutElement(token: any) {
  if (isInlineElement(token)) return false;
  //@ts-ignore
  return !!blockHandlers[token.type] && token.type !== "paragraph";
}

function isInlineElement(token: any) {
  if (!token.text) return false;

  for (const el of INLINE_ELEMENTS) {
    // Check if the token matches the element or its closing tag
    if (token.text.trim() === el) return true;
    if (token.text.trim() === el.replace("<", "</")) return true;
  }

  return false;
}
//create typescript  type for the blocks

// function renderTokensToString(tokens: any[]) {
//   return tokens.reduce((acc, curr) => acc + curr.raw || curr.text, "");
// }

const blockHandlers = Object.freeze({
  paragraph: (token: any): BlockParagraph => ({
    type: "paragraph",
    data: {
      text: parseInlineTokens(token.tokens),
    },
  }),

  heading: (token: any): BlockHeading => ({
    type: "header",
    data: {
      text: parseInlineTokens(token.tokens),
      level: token.depth,
    },
  }),

  image: (token: any, options?: ParseOptions): BlockImage | BlockEmbed => {
    const href = decodeURIComponent(token.href);

    const youtubeVideoId = extractYouTubeVideoId(href);

    if (youtubeVideoId) {
      return {
        type: "embed",
        data: {
          url: href,
          service: "youtube",
          id: youtubeVideoId,
        },
      };
    }

    const { width, height } = options?.getImageDimensions?.(href) || {};

    return {
      type: "image",
      data: {
        src: decodeURIComponent(href),
        caption: token.text,
        width,
        height,
      },
    };
    //TODO: add width and height
  },

  code: (token: any): BlockCode => ({
    type: "code",
    data: {
      lang: token.lang,
      text: token.text,
    },
  }),

  blockquote: (token: any): BlockQuote | BlockCallout => {
    const oc = obsidianCallout(token.raw);

    if (oc) {
      return {
        type: "callout",
        data: {
          kind: oc.level,
          title: oc.title,
          text: marked.parseInline(oc.body, _options),
        },
      };
    }

    return {
      type: "quote",
      data: {
        text: removeOuterHTMLTags(parseBlockTokens(token.tokens)),
        caption: "",
      },
    };
  },

  list: (token: any): BlockList => ({
    type: "list",
    data: {
      style: token.ordered ? "ordered" : "unordered",
      items: token.items.map((item: any) =>
        marked.parseInline(item.text, _options)
      ),
    },
  }),

  table: (token: any): BlockTable => ({
    type: "table",
    data: {
      // withHeaders: token?.header?.length > 0,
      header: token.header.map((cell: any) =>
        marked.parseInline(cell.text, _options)
      ),
      rows: token.rows.map((row: any) =>
        row.map((cell: any) => marked.parseInline(cell.text, _options))
      ),
    },
  }),

  hr: (): BlockDelimiter => ({
    type: "delimiter",
    data: {},
  }),

  html: (token: any): BlockHtml => ({
    type: "html",
    data: {
      html: token.text,
    },
  }),
});

const obsidianCallout = (src: string) => {
  const rule = /(?:> \[!\s?)(\w+)(?:\] ?)([^\n]*)([\s\S]*?)(?=\n[^>]|$)/g;
  const match = rule.exec(src);
  if (match)
    return {
      type: "obsidianCallout",
      level: match[1].toLowerCase(),
      title: match[2] || "",
      body: match[3].replace(/(?<=^|\n)> /g, "").trim(), // Remove leading "> " from body lines
      raw: src,
    };

  return null;
};
