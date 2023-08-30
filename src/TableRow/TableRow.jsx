import { mergeAttributes, Node } from "@tiptap/core"

const TableRow =  Node.create({
    name: "tableRow",

    addOptions() {
        return {
            HTMLAttributes: {}
        }
    },

    content: "(tableCell | tableHeader)*",

    tableRole: "row",

    parseHTML() {
        return [{ tag: "tr" }]
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "tr",
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
            0
        ]
    }
})

export default TableRow;