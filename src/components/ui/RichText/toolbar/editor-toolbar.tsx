import React from "react";
import { Editor } from "@tiptap/react";
import {
  AlignLeft,
  Bold,
  Italic,
  ListOrdered,
  Redo,
  Underline,
  Undo,
  ListFilter,
  List,
  Link as LinkIcon,
} from "lucide-react";
import { Toggle } from "@/components/ui/RichText/toggle";
import { ToggleGroup, Toolbar } from "@/components/ui/RichText/toolbar";
import { EditorFeatureConfiguration } from "@/interfaces";

interface EditorToolbarProps {
  editor: Editor;
  editorFeaturesFlages: EditorFeatureConfiguration;
}

const EditorToolbar = ({
  editor,
  editorFeaturesFlages,
}: EditorToolbarProps) => {
  if (!editor) return null;

  return (
    <Toolbar className="ml-0 flex items-center justify-between h-8 z-0">
      <ToggleGroup
        className="flex flex-row items-center text-[#575D6D]"
        type="multiple"
      >
        {/* Bold */}
        {editorFeaturesFlages.bold && (
          <Toggle
            size="sm"
            className="mr-[10px]"
            onPressedChange={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().setBold().run()}
            pressed={editor.isActive("bold")}
          >
            <Bold className="h-4 w-4" />
          </Toggle>
        )}

        {/* Italic */}
        {editorFeaturesFlages.italic && (
          <Toggle
            size="sm"
            className="mr-[10px]"
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().setItalic().run()}
            pressed={editor.isActive("italic")}
          >
            <Italic className="h-4 w-4" />
          </Toggle>
        )}

        {/* Underline */}
        {editorFeaturesFlages.underline && (
          <Toggle
            size="sm"
            className="mr-[10px]"
            onPressedChange={() =>
              editor.chain().focus().toggleUnderline().run()
            }
            disabled={!editor.can().chain().focus().setUnderline().run()}
            pressed={editor.isActive("underline")}
          >
            <Underline className="h-4 w-4" />
          </Toggle>
        )}

        {/* Bullets */}
        {editorFeaturesFlages.unOrderedList && (
          <Toggle size="sm" className="mr-4">
            <List className="h-4 w-4" />
          </Toggle>
        )}

        {/* Align Left */}
        {editorFeaturesFlages.alignLeft && (
          <Toggle
            size="sm"
            className="mr-[10px]"
            onPressedChange={() =>
              editor.chain().focus().setTextAlign("left").run()
            }
            disabled={!editor.can().chain().focus().setTextAlign("left").run()}
            pressed={editor.isActive({ textAlign: "left" })}
          >
            <AlignLeft className="h-4 w-4 text-[#575D6D]" />
          </Toggle>
        )}

        {/* Align Center */}
        {editorFeaturesFlages.alignCenter && (
          <Toggle
            size="sm"
            className="mr-[10px]"
            onPressedChange={() =>
              editor.chain().focus().setTextAlign("center").run()
            }
            disabled={
              !editor.can().chain().focus().setTextAlign("center").run()
            }
            pressed={editor.isActive({ textAlign: "center" })}
          >
            <ListFilter className="h-4 w-4 text-[#575D6D]" />
          </Toggle>
        )}

        {/* Ordered List */}
        {editorFeaturesFlages.orderedList && (
          <Toggle
            size="sm"
            className="mr-[10px]"
            onPressedChange={() =>
              editor.chain().focus().toggleOrderedList().run()
            }
            disabled={!editor.can().chain().focus().toggleOrderedList().run()}
            pressed={editor.isActive("orderedList")}
          >
            <ListOrdered className="h-4 w-4 text-[#575D6D]" />
          </Toggle>
        )}

        {/* Undo */}
        {editorFeaturesFlages.undo && (
          <Toggle
            size="sm"
            className="mr-[10px]"
            onPressedChange={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
          >
            <Undo className="h-6 w-6 text-[#575D6D]" />
          </Toggle>
        )}

        {/* Redo */}
        {editorFeaturesFlages.redo && (
          <Toggle
            size="sm"
            className="mr-[10px]"
            onPressedChange={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
          >
            <Redo className="h-6 w-6 text-[#575D6D]" />
          </Toggle>
        )}

        {/* Hyperlink */}
        {editorFeaturesFlages.link && (
          <Toggle
            size="sm"
            className="mr-[10px]"
            onPressedChange={() => {
              const url = prompt("Enter the URL:");
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }}
            disabled={!editor.can().chain().focus().setLink({ href: "" }).run()}
            pressed={editor.isActive("link")}
          >
            <LinkIcon className="h-4 w-4 text-[#575D6D]" />
          </Toggle>
        )}
      </ToggleGroup>
    </Toolbar>
  );
};

export default EditorToolbar;
