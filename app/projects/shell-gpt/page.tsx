// app/projects/shell-gpt/page.tsx
"use client";

import ProjectOverview from "@/components/templates/project-overview";
import CodeBlock from "@/components/ui/code-block";

export default function ShellGptProjectPage() {
    return (
        <main className="px-4 py-10 sm:px-6">
            <ProjectOverview
                title="Shell-GPT"
                subtitle="Natural-language commands and explanations from your terminal"
                summary={
                    <>
                        Shell-GPT is my CLI assistant that turns prompts into shell commands,
                        explains errors, generates commit messages, and helps with docs—all
                        without leaving the terminal.
                    </>
                }
                cover={{
                    src: "/shell-gpt-screenshot.png",
                    alt: "Shell-GPT terminal screenshot",
                    aspect: "16/9",
                }}
                meta={[
                    { label: "Type", value: "CLI Tool" },
                    { label: "Status", value: "Active" },
                    { label: "License", value: "MIT" },
                ]}
                tech={["TypeScript", "Node.js", "OpenAI", "Tailwind CSS", "Electron", "Vité"]}
                actions={[
                    { type: "github", href: "https://github.com/Kalaghni/shell-gpt", label: "Repository" },
                    { type: "link", href: "https://github.com/Kalaghni/shell-gpt#readme", label: "Docs" },
                ]}
            >
                <h3>Install</h3>
                <CodeBlock
                    language="bash"
                    code={`# npm (global)
npm i -g shell-gpt

# pnpm (global)
pnpm add -g shell-gpt

# bun (global)
bun add -g shell-gpt

# from source
git clone https://github.com/<you>/shell-gpt
cd shell-gpt && pnpm i && pnpm build && pnpm link --global`}
                />

                <h3>Configuration</h3>
                <CodeBlock
                    language="bash"
                    code={`# OpenAI
export OPENAI_API_KEY=sk-...`}
                />
            </ProjectOverview>
        </main>
    );
}
