import { mergeAttributes, Node } from "@tiptap/core"

const TableHeader =  Node.create({
    name: "tableHeader",

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

    tableRole: "header_cell",

    isolating: true,

    parseHTML() {
        return [{ tag: "th" }]
    },

    renderHTML({ node, HTMLAttributes }) {
        return [
            "th",
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                style: `background-color: ${node.attrs.background}`
            }),
            0
        ]
    }
})

export default TableHeader;
