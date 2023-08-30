import { h } from "jsx-dom-cjs"
import tippy from "tippy.js"

import {
    CellSelection,
    TableMap,
    updateColumnsOnResize
} from "@tiptap/prosemirror-tables"

import icons from "./icons"

export function updateColumns(
    node,
    colgroup,
    table,
    cellMinWidth,
    overrideCol,
    overrideValue
) {
    let totalWidth = 0
    let fixedWidth = true
    let nextDOM = colgroup.firstChild
    const row = node.firstChild

    if (!row) return

    for (let i = 0, col = 0; i < row.childCount; i += 1) {
        const { colspan, colwidth } = row.child(i).attrs

        for (let j = 0; j < colspan; j += 1, col += 1) {
            const hasWidth =
                overrideCol === col ? overrideValue : colwidth && colwidth[j]
            const cssWidth = hasWidth ? `${hasWidth}px` : ""

            totalWidth += hasWidth || cellMinWidth

            if (!hasWidth) {
                fixedWidth = false
            }

            if (!nextDOM) {
                colgroup.appendChild(
                    document.createElement("col")
                ).style.width = cssWidth
            } else {
                if (nextDOM.style.width !== cssWidth) {
                    nextDOM.style.width = cssWidth
                }

                nextDOM = nextDOM.nextSibling
            }
        }
    }

    while (nextDOM) {
        const after = nextDOM.nextSibling

        nextDOM.parentNode?.removeChild(nextDOM)
        nextDOM = after
    }

    if (fixedWidth) {
        table.style.width = `${totalWidth}px`
        table.style.minWidth = ""
    } else {
        table.style.width = ""
        table.style.minWidth = `${totalWidth}px`
    }
}

const defaultTippyOptions = {
    allowHTML: true,
    arrow: false,
    trigger: "click",
    animation: "scale-subtle",
    theme: "light-border no-padding",
    interactive: true,
    hideOnClick: true,
    placement: "right"
}

function setCellsBackgroundColor(editor, backgroundColor) {
    return editor
        .chain()
        .focus()
        .updateAttributes("tableCell", {
            background: backgroundColor
        })
        .updateAttributes("tableHeader", {
            background: backgroundColor
        })
        .run()
}

const columnsToolboxItems = [
    {
        label: "Insert Left",
        icon: icons.insertColumnLeft,
        action: ({ editor }) => editor.chain().focus().addColumnBefore().run()
    },
    {
        label: "Insert Right",
        icon: icons.insertColumnRight,
        action: ({ editor }) => editor.chain().focus().addColumnAfter().run()
    },
    {
        label: "Background Color",
        icon: icons.colorPicker,
        action: ({ editor, triggerButton, controlsContainer }) => {
            createColorPickerToolbox({
                triggerButton,
                tippyOptions: {
                    appendTo: controlsContainer
                },
                onSelectColor: (color) => setCellsBackgroundColor(editor, color)
            })
        }
    },
    {
        label: "Delete Column",
        icon: icons.deleteColumn,
        action: ({ editor }) => editor.chain().focus().deleteColumn().run()
    }
]

const rowsToolboxItems = [
    {
        label: "Insert Row Above",
        icon: icons.insertRowTop,
        action: ({ editor }) => editor.chain().focus().addRowBefore().run()
    },
    {
        label: "Insert Row Below",
        icon: icons.insertRowBottom,
        action: ({ editor }) => editor.chain().focus().addRowAfter().run()
    },
    {
        label: "Choose Color",
        icon: icons.colorPicker,
        action: ({ editor, triggerButton, controlsContainer }) => {
            createColorPickerToolbox({
                triggerButton,
                tippyOptions: {
                    appendTo: controlsContainer
                },
                onSelectColor: (color) => setCellsBackgroundColor(editor, color)
            })
        }
    },
    {
        label: "Delete Row",
        icon: icons.deleteRow,
        action: ({ editor }) => editor.chain().focus().deleteRow().run()
    }
]

function createToolbox({
    triggerButton,
    items,
    tippyOptions,
    onClickItem
}) {
    const toolbox = tippy(triggerButton, {
        content: h(
            "div",
            { className: "tableToolbox" },
            items.map((item) =>
                h(
                    "div",
                    {
                        className: "toolboxItem",
                        onClick() {
                            onClickItem(item)
                        }
                    },
                    [
                        h("div", {
                            className: "iconContainer",
                            innerHTML: item.icon
                        }),
                        h("div", { className: "label" }, item.label)
                    ]
                )
            )
        ),
        ...tippyOptions
    })

    return Array.isArray(toolbox) ? toolbox[0] : toolbox
}

function createColorPickerToolbox({
    triggerButton,
    tippyOptions,
    onSelectColor = () => {}
}) {
    const items = {
        "Fond par défault": "#ffffff",
        "Fond gris clair": "#e7f3f8",
        "Fond gris foncé": "#c7d2d7",
        "Fond bleu": "#e7f3f8",
        "Fond rouge": "#ffc4c7",
        "Fond jaune": "#fbf3db"
    }

    const colorPicker = tippy(triggerButton, {
        ...defaultTippyOptions,
        content: h(
            "div",
            { className: "tableColorPickerToolbox" },
            Object.entries(items).map(([key, value]) =>
                h(
                    "div",
                    {
                        className: "toolboxItem",
                        onClick: () => {
                            onSelectColor(value)
                            colorPicker[0].hide()
                        }
                    },
                    [
                        h("div", {
                            className: "colorContainer",
                            style: {
                                backgroundColor: value
                            }
                        }),
                        h(
                            "div",
                            {
                                className: "label"
                            },
                            key
                        )
                    ]
                )
            )
        ),
        onHidden: (instance) => {
            instance.destroy()
        },
        showOnCreate: true,
        ...tippyOptions
    })

    return colorPicker
}

export class TableView {
  node
  cellMinWidth
  decorations
  editor
  getPos
  hoveredCell
  map
  root
  table
  colgroup
  tbody
  rowsControl
  columnsControl
  columnsToolbox
  rowsToolbox
  controls

    get dom() {
        return this.root
    }

    get contentDOM() {
        return this.tbody
    }

    constructor(node, cellMinWidth, decorations, editor, getPos) {
        this.node = node
        this.cellMinWidth = cellMinWidth
        this.decorations = decorations
        this.editor = editor
        this.getPos = getPos
        this.hoveredCell = null
        this.map = TableMap.get(node)

        /**
         * DOM
         */

        // Controllers
        if (editor.isEditable) {
            this.rowsControl = h(
                "div",
                { className: "rowsControl" },
                h("button", {
                    onClick: () => this.selectRow()
                })
            )

            this.columnsControl = h(
                "div",
                { className: "columnsControl" },
                h("button", {
                    onClick: () => this.selectColumn()
                })
            )

            this.controls = h(
                "div",
                { className: "tableControls", contentEditable: "false" },
                this.rowsControl,
                this.columnsControl
            )

            this.columnsToolbox = createToolbox({
                triggerButton: this.columnsControl.querySelector("button"),
                items: columnsToolboxItems,
                tippyOptions: {
                    ...defaultTippyOptions,
                    appendTo: this.controls
                },
                onClickItem: (item) => {
                    item.action({
                        editor: this.editor,
                        triggerButton: this.columnsControl.firstElementChild,
                        controlsContainer: this.controls
                    })
                    this.columnsToolbox.hide()
                }
            })

            this.rowsToolbox = createToolbox({
                triggerButton: this.rowsControl.firstElementChild,
                items: rowsToolboxItems,
                tippyOptions: {
                    ...defaultTippyOptions,
                    appendTo: this.controls
                },
                onClickItem: (item) => {
                    item.action({
                        editor: this.editor,
                        triggerButton: this.rowsControl.firstElementChild,
                        controlsContainer: this.controls
                    })
                    this.rowsToolbox.hide()
                }
            })
        }

        // Table

        this.colgroup = h(
            "colgroup",
            null,
            Array.from({ length: this.map.width }, () => 1).map(() => h("col"))
        )
        this.tbody = h("tbody")
        this.table = h("table", null, this.colgroup, this.tbody)

        this.root = h(
            "div",
            {
                className: "tableWrapper controls--disabled"
            },
            this.controls,
            this.table
        )

        this.render()
    }

    update(node, decorations) {
        if (node.type !== this.node.type) {
            return false
        }

        this.node = node
        this.decorations = decorations
        this.map = TableMap.get(this.node)

        if (this.editor.isEditable) {
            this.updateControls()
        }

        this.render()

        return true
    }

    render() {
        if (this.colgroup.children.length !== this.map.width) {
            const cols = Array.from({ length: this.map.width }, () => 1).map(
                () => h("col")
            )
            this.colgroup.replaceChildren(...cols)
        }

        updateColumnsOnResize(
            this.node,
            this.colgroup,
            this.table,
            this.cellMinWidth
        )
    }

    ignoreMutation() {
        return true
    }

    updateControls() {
        const { hoveredTable: table, hoveredCell: cell } = Object.values(
            this.decorations
        ).reduce((acc, curr) => {
            if (curr.spec.hoveredCell !== undefined) {
                acc["hoveredCell"] = curr.spec.hoveredCell
            }

            if (curr.spec.hoveredTable !== undefined) {
                acc["hoveredTable"] = curr.spec.hoveredTable
            }
            return acc
        }, {})

        if (table === undefined || cell === undefined) {
            return this.root.classList.add("controls--disabled")
        }

        this.root.classList.remove("controls--disabled")
        this.hoveredCell = cell

        const cellDom = this.editor.view.nodeDOM(cell.pos)

        const tableRect = this.table.getBoundingClientRect()
        const cellRect = cellDom.getBoundingClientRect()

        this.columnsControl.style.left = `${
            cellRect.left -
            tableRect.left -
            (this.table.parentElement ? this.table.parentElement.scrollLeft : 0)
        }px`
        this.columnsControl.style.width = `${cellRect.width}px`

        this.rowsControl.style.top = `${cellRect.top - tableRect.top}px`
        this.rowsControl.style.height = `${cellRect.height}px`
    }

    selectColumn() {
        if (!this.hoveredCell) return

        const colIndex = this.map.colCount(
            this.hoveredCell.pos - (this.getPos() + 1)
        )
        const anchorCellPos = this.hoveredCell.pos
        const headCellPos =
            this.map.map[colIndex + this.map.width * (this.map.height - 1)] +
            (this.getPos() + 1)

        const cellSelection = CellSelection.create(
            this.editor.view.state.doc,
            anchorCellPos,
            headCellPos
        )
        this.editor.view.dispatch(
            // @ts-ignore
            this.editor.state.tr.setSelection(cellSelection)
        )
    }

    selectRow() {
        if (!this.hoveredCell) return

        const anchorCellPos = this.hoveredCell.pos
        const anchorCellIndex = this.map.map.indexOf(
            anchorCellPos - (this.getPos() + 1)
        )
        const headCellPos =
            this.map.map[anchorCellIndex + (this.map.width - 1)] +
            (this.getPos() + 1)

        const cellSelection = CellSelection.create(
            this.editor.state.doc,
            anchorCellPos,
            headCellPos
        )
        this.editor.view.dispatch(
            // @ts-ignore
            this.editor.view.state.tr.setSelection(cellSelection)
        )
    }
}
