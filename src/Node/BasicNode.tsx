import { NodeData, NodeType } from "../utils/types";
import styles from "./Node.module.css";
import {
  useRef,
  useEffect,
  FormEventHandler,
  KeyboardEventHandler,
} from "react";
import { nanoid } from "nanoid";
import { useAppState } from "../State/AppStateContext";
import { CommandPanel } from "./CommandPanel";
import cx from "classnames";

type BasicNodeProps = {
  node: NodeData;
  updateFocusedIndex(index: number): void;
  isFocused: boolean;
  index: number;
};

export const BasicNode = ({
  node,
  updateFocusedIndex,
  isFocused,
  index,
}: BasicNodeProps) => {
  const isPlaceholder = node.type === "placeholder";
  const nodeRef = useRef<HTMLDivElement>(null);
  const showCommandPanel = isFocused && node?.value?.match(/^\//);

  const { changeNodeValue, changeNodeType, removeNodeByIndex, addNode } =
    useAppState();

  useEffect(() => {
    if (nodeRef.current) {
      if (isPlaceholder) {
        nodeRef.current.textContent = node.value || "Drop Here";
        nodeRef.current.setAttribute("contenteditable", "false");
      } else {
        if (document.activeElement !== nodeRef.current) {
          nodeRef.current.textContent = node.value;
        }
        nodeRef.current.setAttribute("contenteditable", "true");
      }
    }
    if (isFocused && !isPlaceholder) {
      nodeRef.current?.focus();
    } else {
      nodeRef.current?.blur();
    }
  }, [node, isFocused, isPlaceholder]);

  const parseCommand = (nodeType: NodeType) => {
    if (nodeRef.current) {
      changeNodeType(index, nodeType);
      nodeRef.current.textContent = "";
    }
  };

  const handleInput: FormEventHandler<HTMLDivElement> = ({ currentTarget }) => {
    const { textContent } = currentTarget;
    changeNodeValue(index, textContent || "");
  };

  const handleClick = () => {
    updateFocusedIndex(index);
  };

  const onKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    const target = event.target as HTMLDivElement;
    if (event.key === "Enter") {
      event.preventDefault();
      if (target.textContent?.[0] === "/") {
        return;
      }
      addNode({ type: node.type, value: "", id: nanoid() }, index + 1);
      updateFocusedIndex(index + 1);
    }
    if (event.key === "Backspace") {
      if (target.textContent?.length === 0) {
        event.preventDefault();
        removeNodeByIndex(index);
        updateFocusedIndex(index - 1);
      } else if (window?.getSelection()?.anchorOffset === 0) {
        event.preventDefault();
        removeNodeByIndex(index - 1);
        updateFocusedIndex(index - 1);
      }
    }
  };

  return (
    <>
      {showCommandPanel && !isPlaceholder && (
        <CommandPanel selectItem={parseCommand} nodeText={node.value} />
      )}
      <div
        onInput={isPlaceholder ? undefined : handleInput}
        onClick={isPlaceholder ? undefined : handleClick}
        onKeyDown={isPlaceholder ? undefined : onKeyDown}
        ref={nodeRef}
        contentEditable={!isPlaceholder}
        suppressContentEditableWarning
        className={cx(styles.node, styles[node.type])}
      />
    </>
  );
};
