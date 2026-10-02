import type { ReactNode } from "react";

/**
 * Next aliases `react-dom/server` to React's `react-server` build everywhere in
 * the app layer — route handlers included — and that build has no
 * `renderToStaticMarkup`, so a static import fails the build outright.
 *
 * `turbopackIgnore` is Next's documented escape hatch for exactly this: it
 * leaves the dynamic import for the Node resolver, which picks the build that
 * does export the function. The module is cached after the first call, so this
 * costs one `await import()` per process, not per email.
 */
const { renderToStaticMarkup } = await import(
  /* turbopackIgnore: true */ "react-dom/server"
);

interface EmailLayoutProps {
  /** Inbox preview line; hidden in the body, shown next to the subject. */
  readonly previewText: string;
  readonly heading: string;
  readonly children: ReactNode;
  /** Primary call to action. Omit for informational email. */
  readonly action?: { readonly label: string; readonly href: string };
  /** Rendered as small print under the action, e.g. expiry or security notes. */
  readonly footnote?: string;
}

/**
 * Renders the branded HTML shell every transactional email is wrapped in.
 *
 * Email clients strip `class`, ignore CSS variables, and have patchy flexbox
 * support, so every rule here is an inline style on a table-based skeleton.
 * Do not "clean this up" into a styled component — it will break in Outlook.
 */
export function renderEmailLayout(props: EmailLayoutProps): string {
  const { previewText, heading, children, action, footnote } = props;

  return renderToStaticMarkup(
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{heading}</title>
      </head>
      <body style={BODY_STYLE}>
        {/* Hidden in the message body, surfaced by clients beside the subject. */}
        <div style={PREVIEW_STYLE}>{previewText}</div>

        <table
          role="presentation"
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          style={SHELL_STYLE}
        >
          <tbody>
            <tr>
              <td align="center" style={CELL_STYLE}>
                <table
                  role="presentation"
                  width="100%"
                  cellPadding={0}
                  cellSpacing={0}
                  style={CARD_STYLE}
                >
                  <tbody>
                    <tr>
                      <td style={HEADER_STYLE}>
                        <span style={BRAND_STYLE}>EFlow</span>
                      </td>
                    </tr>
                    <tr>
                      <td style={BODY_CELL_STYLE}>
                        <h1 style={HEADING_STYLE}>{heading}</h1>
                        <div style={CONTENT_STYLE}>{children}</div>
                        {action ? renderAction(action) : null}
                        {footnote ? (
                          <p style={FOOTNOTE_STYLE}>{footnote}</p>
                        ) : null}
                      </td>
                    </tr>
                    <tr>
                      <td style={FOOTER_STYLE}>
                        <p style={FOOTER_TEXT_STYLE}>
                          You received this email because someone used this
                          address on EFlow. If that was not you, you can safely
                          ignore it.
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>,
  );
}

function renderAction(action: NonNullable<EmailLayoutProps["action"]>) {
  return (
    <table
      role="presentation"
      cellPadding={0}
      cellSpacing={0}
      width="100%"
      style={ACTION_WRAPPER_STYLE}
    >
      <tbody>
        <tr>
          <td align="center">
            <a
              href={action.href}
              style={ACTION_LINK_STYLE}
              // Email clients cannot follow JS, so spell the destination out
              // for screen readers reading the rendered text alternative.
              aria-label={action.label}
            >
              {action.label}
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

const FONT_STACK =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const BODY_STYLE = {
  margin: "0",
  padding: "0",
  backgroundColor: "#f4f4f5",
  fontFamily: FONT_STACK,
  color: "#18181b",
} as const;

const PREVIEW_STYLE = {
  display: "none",
  maxHeight: "0",
  overflow: "hidden",
  opacity: "0",
} as const;

const SHELL_STYLE = { backgroundColor: "#f4f4f5" } as const;

const CELL_STYLE = { padding: "32px 16px" } as const;

const CARD_STYLE = {
  maxWidth: "520px",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  border: "1px solid #e4e4e7",
} as const;

const HEADER_STYLE = {
  padding: "24px 32px",
  borderBottom: "1px solid #e4e4e7",
} as const;

const BRAND_STYLE = {
  fontSize: "18px",
  fontWeight: "700",
  letterSpacing: "-0.02em",
  color: "#18181b",
} as const;

const BODY_CELL_STYLE = { padding: "32px" } as const;

const HEADING_STYLE = {
  margin: "0 0 16px",
  fontSize: "22px",
  lineHeight: "1.3",
  fontWeight: "600",
  color: "#18181b",
} as const;

const CONTENT_STYLE = {
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#52525b",
} as const;

const ACTION_WRAPPER_STYLE = { margin: "28px 0 0" } as const;

const ACTION_LINK_STYLE = {
  display: "inline-block",
  padding: "12px 24px",
  backgroundColor: "#18181b",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: "600",
  textDecoration: "none",
  borderRadius: "8px",
} as const;

const FOOTNOTE_STYLE = {
  margin: "24px 0 0",
  fontSize: "13px",
  lineHeight: "1.5",
  color: "#71717a",
} as const;

const FOOTER_STYLE = {
  padding: "20px 32px",
  borderTop: "1px solid #e4e4e7",
} as const;

const FOOTER_TEXT_STYLE = {
  margin: "0",
  fontSize: "12px",
  lineHeight: "1.5",
  color: "#a1a1aa",
} as const;