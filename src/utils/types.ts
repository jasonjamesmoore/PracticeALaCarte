export type NodeType =
  | "text"
  | "image"
  | "list"
  | "page"
  | "heading1"
  | "heading2"
  | "heading3"
  | "timer";

export type NodeData = {
  id: string;
  type: NodeType;
  value: string;
};

export type Page = {
  id: string;
  slug: string;
  title: string;
  nodes: NodeData[];
  cover: string;
  parentId?: string | null;
  children?: Page[];
};

export type ChildPage = {
  id: string;
  child_page_id: string;
  parent_page_id: string;
  title: string;
  slug: string;
};

export type ParentPage = {
  // id: string;
  parent_page_id: string;
  child_page_id: string;
  child_page: {
    id: string;
    title: string;
    slug: string;
  };
};

export type PageRelation = {
  id: string;
  parentPageId: string;
  childPageId: string;
  position: number;
};
