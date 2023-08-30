import { mergeAttributes, Node } from "@tiptap/core";
import CustomTableCellNodeView from "./CustomTableCellNodeView";
import { ReactNodeViewRenderer } from "@tiptap/react";

const CustomTableCell = Node.create({
  name: "tableCell",

  addNodeView() {
    return (props) =>
      ReactNodeViewRenderer(CustomTableCellNodeView, {
        as: "td",
        attrs: props.node.attrs,
        className: "custom-table-cell relative",
      })(props);
  },

  // addNodeView() {
  //   return ReactNodeViewRenderer(CustomTableCellNodeView, {
  //     as: "td",
  //     className: "custom-table-cell relative",
  //     stopEvent: () => false,
  //     contentDOMElementTag: 'main',
  //   });
  // },

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  content: "block+",

  addAttributes() {
    return {
      colspan: {
        default: 1,
      },
      rowspan: {
        default: 1,
      },
      colwidth: {
        default: null,
        parseHTML: (element) => {
          const colwidth = element.getAttribute("colwidth");
          const value = colwidth ? [parseInt(colwidth, 10)] : null;

          return value;
        },
      },
      backgroundColor: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-background-color"),
        renderHTML: (attributes) => {
          return {
            "data-background-color": attributes.backgroundColor,
            style: `background-color: ${attributes.backgroundColor}`,
          };
        },
      },
    };
  },

  tableRole: "cell",

  isolating: true,

  parseHTML() {
    return [{ tag: "td" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "td",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
});

export default CustomTableCell;