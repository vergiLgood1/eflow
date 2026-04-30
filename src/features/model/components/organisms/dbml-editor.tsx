"use client";

import CodeMirror from "@uiw/react-codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
import { autocompletion, CompletionContext, CompletionResult } from "@codemirror/autocomplete";
import { syntaxHighlighting, HighlightStyle } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { indentWithTab } from "@codemirror/commands";
import { keymap, EditorView } from "@codemirror/view";
import { bracketMatching } from "@codemirror/language";
import { StreamLanguage } from "@codemirror/language";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

// ── DBML Column Types ────────────────────────────────────────────────────────
const COLUMN_TYPES = [
    "integer", "int", "int2", "int4", "int8", "bigint", "smallint",
    "serial", "bigserial", "smallserial",
    "decimal", "numeric", "float", "float4", "float8", "real", "double precision",
    "boolean", "bool",
    "varchar", "char", "text",
    "uuid",
    "date", "time", "timestamp", "timestamptz", "interval",
    "json", "jsonb",
    "bytea",
    "enum",
];

const COLUMN_SETTINGS = ["pk", "unique", "not null", "null", "increment", "default", "note", "ref"];

const REF_ACTIONS = ["no action", "restrict", "cascade", "set null", "set default"];

const INDEX_TYPES = ["btree", "hash", "gin", "gist", "spgist", "brin"];

// ── Stream Language for DBML ─────────────────────────────────────────────────
const dbmlStreamLanguage = StreamLanguage.define({
    name: "dbml",
    startState: () => ({ inTable: false, inEnum: false, inIndexes: false, inProject: false }),
    token(stream) {
        // Single-line comments
        if (stream.match(/\/\/.*/)) return "lineComment";

        // Multi-line comments
        if (stream.match("/*")) {
            while (!stream.eol()) {
                if (stream.match("*/")) { break; }
                stream.next();
            }
            return "blockComment";
        }

        // String literals (single or double quoted)
        if (stream.match(/'(?:[^'\\]|\\.)*'/) || stream.match(/"(?:[^"\\]|\\.)*"/)) {
            return "string";
        }

        // Backtick expressions (default values)
        if (stream.match(/`[^`]*`/)) return "string";

        // Keywords
        if (stream.match(/\b(?:Table|Ref|Enum|Project|indexes|Note|TableGroup)\b/)) {
            return "keyword";
        }

        // Column settings
        if (stream.match(/\b(?:pk|unique|not null|null|increment|default|note|ref)\b/)) {
            return "keyword";
        }

        // Ref operators
        if (stream.match(/[<>\-]+/)) return "operator";

        // Brackets and punctuation
        if (stream.match(/[{}[\](),.:]/)) return "punctuation";

        // Numbers
        if (stream.match(/\b\d+(\.\d+)?\b/)) return "number";

        // Type identifiers (after column name, before settings)
        if (stream.match(/\b(?:integer|int|int2|int4|int8|bigint|smallint|serial|bigserial|smallserial|decimal|numeric|float|float4|float8|real|boolean|bool|varchar|char|text|uuid|date|time|timestamp|timestamptz|interval|json|jsonb|bytea|enum)\b/)) {
            return "typeName";
        }

        // Identifiers
        if (stream.match(/[a-zA-Z_][a-zA-Z0-9_]*/)) return "variableName";

        stream.next();
        return null;
    },
    indent: () => 0,
    languageData: {},
});

// ── Custom Highlight Style ────────────────────────────────────────────────────
const dbmlHighlightStyle = HighlightStyle.define([
    { tag: tags.keyword, color: "#c678dd", fontWeight: "600" },
    { tag: tags.typeName, color: "#e5c07b" },
    { tag: tags.string, color: "#98c379" },
    { tag: tags.comment, color: "#5c6370", fontStyle: "italic" },
    { tag: tags.lineComment, color: "#5c6370", fontStyle: "italic" },
    { tag: tags.blockComment, color: "#5c6370", fontStyle: "italic" },
    { tag: tags.operator, color: "#56b6c2" },
    { tag: tags.punctuation, color: "#abb2bf" },
    { tag: tags.number, color: "#d19a66" },
    { tag: tags.variableName, color: "#e06c75" },
]);

// ── DBML Autocomplete Logic ──────────────────────────────────────────────────
function dbmlCompletions(context: CompletionContext): CompletionResult | null {
    const word = context.matchBefore(/[\w\s]*/);
    if (!word || (word.from === word.to && !context.explicit)) return null;

    const line = context.state.doc.lineAt(context.pos).text;
    const trimmedLine = line.trimStart();
    const beforeCursor = context.state.doc.sliceString(0, context.pos);

    // Inside a column settings block [ ... ]
    const inBracket = /\[[^\]]*$/.test(beforeCursor.split("\n").pop() ?? "");
    if (inBracket) {
        return {
            from: word.from,
            options: [
                ...COLUMN_SETTINGS.map(s => ({ label: s, type: "keyword" as const, detail: "column setting" })),
                ...REF_ACTIONS.map(a => ({ label: a, type: "keyword" as const, detail: "action" })),
                ...INDEX_TYPES.map(t => ({ label: t, type: "keyword" as const, detail: "index type" })),
            ],
        };
    }

    // After "delete:" or "update:" in a Ref block
    if (/(?:delete|update):\s*\w*$/.test(trimmedLine)) {
        return {
            from: word.from,
            options: REF_ACTIONS.map(a => ({ label: a, type: "keyword" as const })),
        };
    }

    // Top-level keywords
    if (/^\s*$/.test(trimmedLine) || /^[A-Z]\w*$/.test(trimmedLine.split(" ")[0])) {
        return {
            from: word.from,
            options: [
                { label: "Table", type: "keyword" as const, detail: "define a table", boost: 10 },
                { label: "Ref:", type: "keyword" as const, detail: "define a relationship", boost: 9 },
                { label: "Enum", type: "keyword" as const, detail: "define an enum type", boost: 8 },
                { label: "Project", type: "keyword" as const, detail: "define project metadata", boost: 7 },
                { label: "TableGroup", type: "keyword" as const, detail: "group tables together", boost: 6 },
            ],
        };
    }

    // Column type (second word after column name)
    const words = trimmedLine.split(/\s+/);
    if (words.length >= 1 && !trimmedLine.startsWith("Table") && !trimmedLine.startsWith("Ref") && !trimmedLine.startsWith("//")) {
        return {
            from: word.from,
            options: COLUMN_TYPES.map(t => ({
                label: t,
                type: "type" as const,
                detail: "column type",
            })),
        };
    }

    return null;
}

// ── Snippet completions ───────────────────────────────────────────────────────
const dbmlSnippets = autocompletion({
    override: [dbmlCompletions],
    activateOnTyping: true,
    selectOnOpen: false,
    icons: true,
});

// ── Editor Theme Overrides ───────────────────────────────────────────────────
const editorTheme = EditorView.theme({
    "&": {
        height: "100%",
        fontSize: "13px",
        fontFamily: '"Fira Code", "Fira Mono", "JetBrains Mono", monospace',
    },
    ".cm-content": {
        caretColor: "#528bff",
        padding: "12px 0",
    },
    ".cm-focused": { outline: "none" },
    ".cm-editor": { height: "100%" },
    ".cm-scroller": { overflow: "auto", fontFamily: "inherit" },
    ".cm-gutters": {
        backgroundColor: "#21252b",
        borderRight: "1px solid #3b4048",
        color: "#636d83",
        minWidth: "40px",
    },
    ".cm-activeLineGutter": { backgroundColor: "#2c313a" },
    ".cm-activeLine": { backgroundColor: "#2c313a" },
    ".cm-matchingBracket": {
        backgroundColor: "#3b4048",
        outline: "1px solid #528bff",
    },
    ".cm-tooltip.cm-tooltip-autocomplete": {
        border: "1px solid #3b4048",
        borderRadius: "6px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        backgroundColor: "#21252b",
    },
    ".cm-tooltip-autocomplete ul li": {
        fontFamily: "inherit",
        fontSize: "12px",
    },
    ".cm-tooltip-autocomplete ul li[aria-selected]": {
        backgroundColor: "#2c313a",
        color: "#abb2bf",
    },
    ".cm-completionIcon-keyword": { color: "#c678dd !important" },
    ".cm-completionIcon-type": { color: "#e5c07b !important" },
    ".cm-tooltip-autocomplete .cm-completionDetail": {
        color: "#5c6370",
        fontSize: "11px",
    },
});

// ── Extension bundle ─────────────────────────────────────────────────────────
const dbmlExtensions = [
    dbmlStreamLanguage,
    syntaxHighlighting(dbmlHighlightStyle),
    bracketMatching(),
    dbmlSnippets,
    keymap.of([indentWithTab]),
    editorTheme,
    EditorView.lineWrapping,
];

// ── Public Component ─────────────────────────────────────────────────────────
interface DbmlEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export function DbmlEditor({ value, onChange }: DbmlEditorProps) {
    return (
        <ScrollArea className="h-full w-full" data-vaul-no-drag>
            <CodeMirror
                value={value}
                height="100%"
                theme={oneDark}
                extensions={dbmlExtensions}
                onChange={onChange}
                basicSetup={{
                    lineNumbers: true,
                    highlightActiveLineGutter: true,
                    highlightActiveLine: true,
                    foldGutter: true,
                    indentOnInput: true,
                    closeBrackets: true,
                    history: true,
                    drawSelection: true,
                    dropCursor: true,
                    allowMultipleSelections: false,
                    syntaxHighlighting: false,
                    searchKeymap: true,
                }}
            />
        </ScrollArea>
    );
}
