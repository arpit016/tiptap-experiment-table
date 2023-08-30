import { mergeAttributes, Node } from "@tiptap/core"

const TableCell = Node.create({
    name: "tableCell",

    addOptions() {
        return {
            HTMLAttributes: {}
        }
    },

    content: "paragraph+",

    addAttributes() {
        return {
            colspan: {
                default: 1
            },
            rowspan: {
                default: 1
            },
            colwidth: {
                default: null,
                parseHTML: (element) => {
                    const colwidth = element.getAttribute("colwidth")
                    const value = colwidth ? [parseInt(colwidth, 10)] : null

                    return value
                }
            },
            background: {
                default: "#ffffff"
            }
        }
    },

    tableRole: "cell",

    isolating: true,

    parseHTML() {
        return [{ tag: "td" }]
    },

    renderHTML({ node, HTMLAttributes }) {
        return [
            "td",
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                style: `background-color: ${node.attrs.background}`
            }),
            0
        ]
    }
})

export default TableCell;
