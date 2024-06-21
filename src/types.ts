export type BlockParagraph = {
  type: "paragraph";
  data: {
    text: string;
  };
};

export type BlockHeading = {
  type: "header";
  data: {
    text: string;
    level: number;
  };
};

export type BlockImage = {
  type: "image";
  data: {
    src: string;
    caption?: string;
  };
  width?: number;
  height?: number;
};

export type BlockCode = {
  type: "code";
  data: {
    lang: string;
    text: string;
  };
};

export type BlockList = {
  type: "list";
  data: {
    style: "ordered" | "unordered";
    items: string[];
  };
};

export type BlockTable = {
  type: "table";
  data: {
    header: string[];
    rows: string[][];
  };
};

export type BlockQuote = {
  type: "quote";
  data: {
    text: string;
    caption?: string;
  };
};

export type BlockCallout = {
  type: "callout";
  data: {
    kind: string;
    // | "note"
    // | "abstract"
    // | "summary"
    // | "tldr"
    // | "info"
    // | "todo"
    // | "tip"
    // | "hint"
    // | "important";
    title?: string;
    text: string;
  };
};

export type BlockDelimiter = {
  type: "delimiter";
  data: {};
};

export type BlockHtml = {
  type: "html";
  data: {
    html: string;
  };
};

export type BlockEmbed = {
  type: "embed";
  data: {
    url: string;
    service: "youtube";
    id?: string;
  };
};

export type Block =
  | BlockParagraph
  | BlockHeading
  | BlockImage
  | BlockCode
  | BlockList
  | BlockTable
  | BlockQuote
  | BlockCallout
  | BlockDelimiter
  | BlockHtml
  | BlockEmbed;

export type Blocks = {
  [key: string]: (token: any) => Block;
};
