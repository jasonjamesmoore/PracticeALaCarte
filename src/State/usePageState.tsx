import { Page, NodeData, NodeType } from "../utils/types";
import { arrayMove } from "@dnd-kit/sortable";
import { useSyncedState } from "./useSyncedState";
import { updatePage } from "../utils/updatePage";
import { createPage } from "../utils/createPage";

export const usePageState = (initialState: Page) => {
  const safeInitialState: Page = {
    ...initialState,
    nodes: initialState.nodes || [],
  };

  const [page, setPage] = useSyncedState(safeInitialState, updatePage);

  const addNode = (node: NodeData, index: number) => {
    setPage((draft) => {
      if (!draft.nodes) draft.nodes = [];
      draft.nodes.splice(index, 0, node);
    });
  };

  // const addEmptyNode = (index: number) => {
  //   setPage((draft) => {
  //     if (!draft.nodes) draft.nodes = [];
  //     const exists = draft.nodes.some((node) => node.id === "new-node");
  //     if (!exists) {
  //       draft.nodes.splice(index, 0, { id: "new-node", type: "heading2", value: "" });
  //     }
  //   });
  // };

  const removeNodeByIndex = (nodeIndex: number) => {
    setPage((draft) => {
      if (!draft.nodes || draft.nodes.length <= nodeIndex) return;
      draft.nodes.splice(nodeIndex, 1);
    });
  };

  const changeNodeValue = (nodeIndex: number, value: string) => {
    setPage((draft) => {
      if (!draft.nodes || draft.nodes.length <= nodeIndex) return;
      draft.nodes[nodeIndex].value = value;
    });
  };

  const changeNodeType = async (nodeIndex: number, type: NodeType) => {
    if (!page.nodes || page.nodes.length <= nodeIndex) return;

    if (type === "page") {
      const parentPageId = page.id;
      const newPage = await createPage(parentPageId);
      if (newPage) {
        setPage((draft) => {
          if (!draft.nodes) draft.nodes = [];
          draft.nodes[nodeIndex].type = type;
          draft.nodes[nodeIndex].value = newPage.slug;
        });
      }
    } else {
      setPage((draft) => {
        if (!draft.nodes) draft.nodes = [];
        draft.nodes[nodeIndex].type = type;
        draft.nodes[nodeIndex].value = "";
      });
    }
  };

  const setNodes = (nodes: NodeData[]) => {
    setPage((draft) => {
      draft.nodes = nodes;
    });
  };

  const setTitle = (title: string) => {
    setPage((draft) => {
      draft.title = title;
    });
  };

  const setCoverImage = (coverImage: string) => {
    setPage((draft) => {
      draft.cover = coverImage;
    });
  };

  const reorderNodes = (id1: string, id2: string) => {
    setPage((draft) => {
      if (!draft.nodes) draft.nodes = [];
      const index1 = draft.nodes.findIndex((node) => node.id === id1);
      const index2 = draft.nodes.findIndex((node) => node.id === id2);
      draft.nodes = arrayMove(draft.nodes, index1, index2);
    });
  };

  return {
    nodes: page.nodes,
    title: page.title,
    cover: page.cover,
    changeNodeType,
    changeNodeValue,
    addNode,
    // addEmptyNode,
    removeNodeByIndex,
    setTitle,
    setCoverImage,
    setNodes,
    reorderNodes,
  };
};
