import React, { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { SuggestionProps } from "@tiptap/suggestion"; // Import SuggestionProps
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Mention from "@tiptap/extension-mention";
import Heading from "@tiptap/extension-heading";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import History from "@tiptap/extension-history";
import TextAlign from "@tiptap/extension-text-align";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Link from "@tiptap/extension-link";
import { EditorFeatureConfiguration } from "@/interfaces";
import EditorToolbar from "./toolbar/editor-toolbar";

interface EditorProps {
  content: string;
  onChange: (value: string) => void;
  editorFeaturesFlages: EditorFeatureConfiguration;
  classes?: string;
}

interface SuggestionState {
  show: boolean;
  items: string[];
  command: ((item: { id: string; label: string }) => void) | null;
  position: { top: number; left: number };
  selectedIndex: number;
  query: string;
}

// Extend SuggestionProps to include exit if you are using it
interface ExtendedSuggestionProps<T> extends SuggestionProps<T> {
  exit?: boolean;
}

const fields = [
  " contact.first_name ",
  " contact.last_name ",
  " contact.company ",
  " contact.title ",
  " contact.country ",
  " contact.city ",
  " bot.first_name ",
  " bot.last_name ",
  " system.two_days ",
  " system.three_days ",
];

const suggestion = {
  char: "{",
  allowSpaces: false,
  startOfLine: false,
  items: (props: { query: string }) => {
    return fields.filter((item) =>
      item.toLowerCase().includes(props.query.toLowerCase())
    );
  },
  render: () => {
    let onUpdate: ((props: ExtendedSuggestionProps<string>) => void) | null =
      null;
    return {
      onStart: (props: ExtendedSuggestionProps<string>) => onUpdate?.(props),
      onUpdate: (props: ExtendedSuggestionProps<string>) => onUpdate?.(props),
      updateCallback: (
        cb: (props: ExtendedSuggestionProps<string>) => void
      ) => {
        onUpdate = cb;
      },
    };
  },
};

const EditorComponent = ({
  content,
  onChange,
  editorFeaturesFlages,
  classes,
}: EditorProps) => {
  const [suggestionState, setSuggestionState] = useState<SuggestionState>({
    show: false,
    items: [],
    command: null,
    position: { top: 0, left: 0 },
    selectedIndex: 0,
    query: "",
  });

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Heading,
      Bold,
      Italic,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      OrderedList,
      ListItem,
      Link.configure({
        openOnClick: true,
      }),
      History,
      Mention.configure({
        HTMLAttributes: { class: "mention font-base text-blue-600 font-light" },
        suggestion: {
          ...suggestion,
          char: "{{",
          render: () => {
            const suggestionLifecycle = suggestion.render();
            suggestionLifecycle.updateCallback(
              (props: ExtendedSuggestionProps<string>) => {
                if (props.exit) {
                  setSuggestionState((prev) => ({ ...prev, show: false }));
                } else {
                  const { items, command, clientRect, query } = props;
                  const rect = clientRect?.();
                  if (rect) {
                    setSuggestionState((prev) => ({
                      ...prev,
                      show: true,
                      items,
                      command,
                      query,
                      position: {
                        top: rect.top + window.scrollY + rect.height + 5,
                        left: rect.left + window.scrollX,
                      },
                      selectedIndex: 0,
                    }));
                  }
                }
              }
            );
            return suggestionLifecycle;
          },
        },
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class:
          " text-xs prose prose-xs sm:prose-base lg:prose-lg xl:prose-2xl outline-none focus:outline-none text-[#575D6D] ml-[-22px] mt-[-8x] w-[500px] min-h-[300px]",
      },
      handleKeyDown(view, event) {
        if (suggestionState.show) {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setSuggestionState((prev) => ({
              ...prev,
              selectedIndex: (prev.selectedIndex + 1) % prev.items.length,
            }));
            return true;
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setSuggestionState((prev) => ({
              ...prev,
              selectedIndex:
                (prev.selectedIndex - 1 + prev.items.length) %
                prev.items.length,
            }));
            return true;
          } else if (event.key === "Enter") {
            event.preventDefault();
            const selectedItem =
              suggestionState.items[suggestionState.selectedIndex];
            suggestionState.command?.({
              id: selectedItem,
              label: selectedItem + "}}",
            });
            setSuggestionState((prev) => ({ ...prev, show: false }));
            return true;
          } else if (event.key === "Escape") {
            setSuggestionState((prev) => ({ ...prev, show: false }));
            return true;
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  const highlightMatch = (item: string, query: string) => {
    const lowerItem = item.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const startIndex = lowerItem.indexOf(lowerQuery);

    if (startIndex === -1 || !query) {
      return <>{item}</>;
    }

    const before = item.substring(0, startIndex);
    const match = item.substring(startIndex, startIndex + query.length);
    const after = item.substring(startIndex + query.length);

    return (
      <>
        {before}
        <span className="text-blue-600 font-bold">{match}</span>
        {after}
      </>
    );
  };

  return (
    <div className={`prose max-w-none w-full relative bg-background dark:prose-invert h-[500px] ${classes}`}>
      <div className="border-b-2 border-gray-100">
        <EditorToolbar
          editor={editor}
          editorFeaturesFlages={editorFeaturesFlages}
        />
      </div>
      <div className={`editor py-4 px-8 relative ${classes}`}>
        <EditorContent editor={editor} />
        {suggestionState.show && (
          <div
            className="mention-list absolute w-48 bg-white border border-gray-300 rounded shadow-md !z-50 !top-[100px] !left-[200px]"
            style={{
              top: suggestionState.position.top,
              left: suggestionState.position.left,
            }}
          >
            {suggestionState.items.map((item, index) => {
              const isSelected = index === suggestionState.selectedIndex;
              return (
                <div
                  key={item}
                  className={`px-3 py-2 cursor-pointer text-sm ${isSelected ? "bg-blue-100" : ""
                    }`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    suggestionState.command?.({ id: item, label: item + "}}" });
                    setSuggestionState((prev) => ({ ...prev, show: false }));
                  }}
                >
                  <span className="text-blue-500">
                    {highlightMatch(item, suggestionState.query)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorComponent;
