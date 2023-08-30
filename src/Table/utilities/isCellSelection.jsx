import { CellSelection } from "@tiptap/prosemirror-tables"

export function isCellSelection(value) {
    return value instanceof CellSelection
}
