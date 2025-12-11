
import ProjectOverview from "@/components/templates/project-overview";
import Link from "next/link";

export default function EchoSH() {

    return (
        <main className="px-4 py-10 sm:px-6 w-screen">
            <ProjectOverview
                title="echoSH"
                subtitle="The Synesthetic Terminal"

                cover={{
                    src: "/echosh-demo.gif",
                    alt: "echoSH terminal screenshot",
                    aspect: "16/9",
                    width: 1280
                }}
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
                    { type: "node", content: (
                            <div className="w-full mt-4">
                                <Link href="https://github.com/stiamprie/echoSH/actions/workflows/build.yml">
                                    <img
                                        src="https://github.com/echosh-labs/echoSH/actions/workflows/build.yml/badge.svg?branch=main"
                                        alt="Build Electron App"/>
                                </Link>
                            </div>
                        )
                    }
                ]}
            />
        </main>
    )

}