import ProjectOverview from "@/components/templates/project-overview";

export default function SiroccoPage() {


    return (
        <main className="px-4 py-10 sm:px-6">
            <ProjectOverview
                title="Sirocco"
                subtitle="The Synesthetic Terminal"
                summary={
                    <>
                        echoSH transforms your command-line workflow into an immersive,
                        generative audio experience. Every keystroke, command, and process is transmuted into a unique sonic event,
                        turning the act of coding into a practice of composition.

                    </>
                }
                meta={[
                    { label: "Type", value: "CLI Tool" },
                    { label: "Status", value: "Active" },
                    { label: "License", value: "MIT" },
                ]}
                tech={["TypeScript", "Node.js", "Tailwind CSS", "Electron", "Vité"]}
                actions={[
                    { type: "github", href: "https://github.com/stiamprie/sirocco", label: "Repository" },
                    { type: "link", href: "https://github.com/stiamprie/sirocco", label: "Docs" },
                ]}
            />
        </main>
    )

}