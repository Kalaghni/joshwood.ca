// components/CodeBlock.tsx
"use client";

import { useState } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { cn } from "@/lib/utils";

type CodeBlockProps = {
    language: string;
    code: string;
    className?: string;
    showLineNumbers?: boolean;
};

export default function CodeBlock({
                                      language,
                                      code,
                                      className,
                                      showLineNumbers = false,
                                  }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    return (
        <div className={cn(
            "group relative font-mono",
            "rounded-lg border border-white/10 bg-black/80",
            "shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6)] mb-4 mt-2"
        )}>
            {/* Language pill */}
            <span className="absolute right-2 top-2 z-10 rounded-md bg-white/10 px-2 py-0.5 text-[10px] uppercase text-white/70">
        {language}
      </span>

            {/* Copy button */}
            <button
                onClick={async () => {
                    await navigator.clipboard.writeText(code);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1200);
                }}
                className="absolute right-2 bottom-2 z-10 rounded-md border border-white/10 bg-white/10 px-2 py-1 text-[11px] text-white/80 opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Copy code"
            >
                {copied ? "Copied" : "Copy"}
            </button>

            <Highlight code={code.trim()} language={language as any} theme={themes.dracula}>
                {({ className: inherited, style, tokens, getLineProps, getTokenProps }) => (
                    <pre
                        className={cn(
                            inherited,
                            "m-0 max-h-[560px] overflow-x-auto p-4 text-sm leading-relaxed",
                            "rounded-lg"
                            , className)}
                        style={style}
                    >
            {tokens.map((line, i) => (
                <div
                    key={i}
                    {...getLineProps({ line })}
                    className="whitespace-pre"
                >
                    {showLineNumbers && (
                        <span className="select-none pr-4 text-white/30">{i + 1}</span>
                    )}
                    {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                    ))}
                </div>
            ))}
          </pre>
                )}
            </Highlight>
        </div>
    );
}
