import TableCell from "@tiptap/extension-table-cell";
import { ReactNodeViewRenderer } from "@tiptap/react";
import CustomTableCellNodeView from "./CustomTableCellNodeView";

const NewCustomTableCell = TableCell.extend({
  addNodeView() {
    return (props) =>
      ReactNodeViewRenderer(CustomTableCellNodeView, {
        as: "td",
        attrs: props.node.attrs
      })(props);
  }
});

export default NewCustomTableCell;