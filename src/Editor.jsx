import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Table from './Table'
import TableCell from './TableCell'
import TableHeader from './TableHeader'
import TableRow from './TableRow'
import CustomTableCell from './CustomTableCell';
import NewCustomTableCell from './NewCustomTableCell';
import './styles.scss';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null
  }

  return (
    <>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleBold()
            .run()
        }
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleItalic()
            .run()
        }
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleStrike()
            .run()
        }
        className={editor.isActive('strike') ? 'is-active' : ''}
      >
        strike
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleCode()
            .run()
        }
        className={editor.isActive('code') ? 'is-active' : ''}
      >
        code
      </button>
      <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        clear marks
      </button>
      <button onClick={() => editor.chain().focus().clearNodes().run()}>
        clear nodes
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive('paragraph') ? 'is-active' : ''}
      >
        paragraph
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
      >
        h1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
      >
        h2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
      >
        h3
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
      >
        h4
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
      >
        h5
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
      >
        h6
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
      >
        bullet list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active' : ''}
      >
        ordered list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? 'is-active' : ''}
      >
        code block
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'is-active' : ''}
      >
        blockquote
      </button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        horizontal rule
      </button>
      <button onClick={() => editor.chain().focus().setHardBreak().run()}>
        hard break
      </button>
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .undo()
            .run()
        }
      >
        undo
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .redo()
            .run()
        }
      >
        redo
      </button>
      <button
        onClick={() => editor.chain().focus().setColor('#958DF1').run()}
        className={editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''}
      >
        purple
      </button>
      <button
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
        }
      >
        insertTable
      </button>
      <button onClick={() => editor.chain().focus().addColumnBefore().run()}>
        addColumnBefore
      </button>
      <button onClick={() => editor.chain().focus().addColumnAfter().run()}>addColumnAfter</button>
      <button onClick={() => editor.chain().focus().deleteColumn().run()}>deleteColumn</button>
      <button onClick={() => editor.chain().focus().addRowBefore().run()}>addRowBefore</button>
      <button onClick={() => editor.chain().focus().addRowAfter().run()}>addRowAfter</button>
      <button onClick={() => editor.chain().focus().deleteRow().run()}>deleteRow</button>
      <button onClick={() => editor.chain().focus().deleteTable().run()}>deleteTable</button>
      <button onClick={() => editor.chain().focus().mergeCells().run()}>mergeCells</button>
      <button onClick={() => editor.chain().focus().splitCell().run()}>splitCell</button>
      <button onClick={() => editor.chain().focus().toggleHeaderColumn().run()}>
        toggleHeaderColumn
      </button>
      <button onClick={() => editor.chain().focus().toggleHeaderRow().run()}>
        toggleHeaderRow
      </button>
      <button onClick={() => editor.chain().focus().toggleHeaderCell().run()}>
        toggleHeaderCell
      </button>
      <button onClick={() => editor.chain().focus().mergeOrSplit().run()}>mergeOrSplit</button>
      <button onClick={() => editor.chain().focus().setCellAttribute('colspan', 2).run()}>
        setCellAttribute
      </button>
      <button onClick={() => editor.chain().focus().fixTables().run()}>fixTables</button>
      <button onClick={() => editor.chain().focus().goToNextCell().run()}>goToNextCell</button>
      <button onClick={() => editor.chain().focus().goToPreviousCell().run()}>
        goToPreviousCell
      </button>
    </>
  )
}

const Editor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: '<p>Hello World!</p>',
  })

  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

export default Editor;