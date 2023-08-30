import React, { useState, useEffect } from "react";
// import Tippy from "@tippyjs/react";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import "./CustomTableCellNodeView.scss";

const TableDropdownButton = ({ selected }) => (
  <svg
    width="21"
    height="22"
    viewBox="0 0 21 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ filter: "drop-shadow(0px 1px 4px rgba(0, 0, 0, 0.08))" }}
  >
    <rect
      x="0.5"
      y="21.5"
      width="21"
      height="20"
      rx="4.5"
      transform="rotate(-90 0.5 21.5)"
      fill={selected ? "#4652B7" : "#F7F7FF"}
      stroke="#E5E5F3"
    />
    <path
      d="M5 14.5003C5 14.83 5.09775 15.1522 5.28088 15.4263C5.46402 15.7004 5.72432 15.914 6.02886 16.0401C6.3334 16.1663 6.66852 16.1993 6.99182 16.135C7.31512 16.0707 7.61209 15.9119 7.84518 15.6788C8.07827 15.4457 8.237 15.1488 8.30131 14.8255C8.36562 14.5022 8.33261 14.1671 8.20647 13.8625C8.08032 13.558 7.8667 13.2977 7.59262 13.1145C7.31853 12.9314 6.9963 12.8337 6.66667 12.8337C6.22464 12.8337 5.80072 13.0093 5.48816 13.3218C5.17559 13.6344 5 14.0583 5 14.5003ZM5 8.66699C5 8.99663 5.09775 9.31886 5.28088 9.59294C5.46402 9.86702 5.72432 10.0806 6.02886 10.2068C6.3334 10.3329 6.66852 10.3659 6.99182 10.3016C7.31512 10.2373 7.61209 10.0786 7.84518 9.8455C8.07827 9.61241 8.237 9.31544 8.30131 8.99214C8.36562 8.66884 8.33261 8.33373 8.20647 8.02919C8.08032 7.72464 7.8667 7.46435 7.59262 7.28121C7.31853 7.09807 6.9963 7.00033 6.66667 7.00033C6.22464 7.00033 5.80072 7.17592 5.48816 7.48848C5.17559 7.80104 5 8.22496 5 8.66699Z"
      fill={selected ? "white" : "#4652B7"}
    />
    <path
      d="M12 14.5003C12 14.83 12.0977 15.1522 12.2809 15.4263C12.464 15.7004 12.7243 15.914 13.0289 16.0401C13.3334 16.1663 13.6685 16.1993 13.9918 16.135C14.3151 16.0707 14.6121 15.9119 14.8452 15.6788C15.0783 15.4457 15.237 15.1488 15.3013 14.8255C15.3656 14.5022 15.3326 14.1671 15.2065 13.8625C15.0803 13.558 14.8667 13.2977 14.5926 13.1145C14.3185 12.9314 13.9963 12.8337 13.6667 12.8337C13.2246 12.8337 12.8007 13.0093 12.4882 13.3218C12.1756 13.6344 12 14.0583 12 14.5003ZM12 8.66699C12 8.99663 12.0977 9.31886 12.2809 9.59294C12.464 9.86702 12.7243 10.0806 13.0289 10.2068C13.3334 10.3329 13.6685 10.3659 13.9918 10.3016C14.3151 10.2373 14.6121 10.0786 14.8452 9.8455C15.0783 9.61241 15.237 9.31544 15.3013 8.99214C15.3656 8.66884 15.3326 8.33373 15.2065 8.02919C15.0803 7.72464 14.8667 7.46435 14.5926 7.28121C14.3185 7.09807 13.9963 7.00032 13.6667 7.00032C13.2246 7.00032 12.8007 7.17592 12.4882 7.48848C12.1756 7.80104 12 8.22496 12 8.66699Z"
      fill={selected ? "white" : "#4652B7"}
    />
  </svg>
);

const CustomTableCellNodeView = ({ updateAttributes, node, getPos, selected, editor }) => {
  const [open, setOpen] = useState(false);

  const [focusedCell, setFocusedCell] = useState(false);
  const [iconHover, setIconHover] = useState(false);

  const calculateifTableCellActive = () => {
    const { from, to } = editor.state.selection;

    const nodeFrom = getPos();
    const nodeTo = nodeFrom + node.nodeSize;
    setFocusedCell(nodeFrom <= from && to <= nodeTo);
  };

  useEffect(() => {
    updateAttributes({
      colspan: node.attrs.colspan,
      rowspan: node.attrs.rowspan,
      colwidth: node.attrs.colwidth
    });
  }, [
    updateAttributes,
    node.attrs.colspan,
    node.attrs.rowspan,
    node.attrs.colwidth
  ]);

  useEffect(() => {
    editor.on("selectionUpdate", calculateifTableCellActive);

    setTimeout(calculateifTableCellActive, 100);

    return () => {
      editor.off("selectionUpdate", calculateifTableCellActive);
    };
  });

  const getButtonTrigger = () => {
    if (focusedCell || selected) {
      return (
        <button
            onClick={(e) => {
              e.preventDefault();
              setOpen(true);
            }}
            onMouseOver={() => setIconHover(true)}
            onMouseLeave={() => setIconHover(false)}
            className="table-cell-dropdown-trigger"
          >
          <TableDropdownButton selected={iconHover || open} />
        </button>
      );
    } else {
      return <></>;
    }
  };

  return (
    <NodeViewWrapper>
      <NodeViewContent as="div" />
      {getButtonTrigger()}
    </NodeViewWrapper>
  );
};

export default CustomTableCellNodeView;
