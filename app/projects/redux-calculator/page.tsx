
import ProjectOverview from "@/components/templates/project-overview";

export default function ReduxCalculatorPage() {

    return (
        <main className="px-4 py-10 sm:px-6 w-screen">
            <ProjectOverview
                title="Redux-Calculator"
                subtitle="Calculator built with React and Redux"

                cover={{
                    href: ("https://reduxcalc.joshwood.ca"),
                    src: "/redux-calculator.png",
                    alt: "Redux Logo",
                    aspect: "16/9",
                    width: 1280
                }}
                meta={[
                    { label: "Status", value: "Active" },
                    { label: "License", value: "MIT" },
                ]}
                actions={[
                    { type: "github", href: "https://github.com/Kalaghni/Redux-Calculator", label: "Repository" },
                    { type: "link", href: "https://reduxcalc.joshwood.ca", label: "Demo" },
                ]}
            />
        </main>
    )

}