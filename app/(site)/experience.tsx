import H2 from "@/components/typography/h2";
import ExperienceCard from "@/components/templates/experience-card";
import {Badge} from "@/components/ui/badge";
import P from "@/components/typography/p";
import {Separator} from "@/components/ui/separator";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {getExperiences, seedExperiences} from "@/lib/experiences";

export default async function Experience() {
    // Seed experiences if none exist
    await seedExperiences();
    const experiences = await getExperiences(true);

    return (
        <section id="experience" data-anchor>
            <div className="relative contain-content overflow-hidden">
                <div className="relative z-10 pb-8 px-4">
                    <H2 className="mx-auto max-w-5xl my-8">Experience</H2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                        {experiences.map((exp, index) => (
                            <ExperienceCard
                                key={exp._id}
                                title={exp.title}
                                location={exp.location}
                                website={exp.website}
                                description={
                                    <Badge variant="default">{exp.role}</Badge>
                                }
                                footer={
                                    exp.footerLink ? (
                                        <Link href={exp.footerLink.href}>
                                            <Button variant="link" className="whitespace-normal">
                                                {exp.footerLink.label}
                                            </Button>
                                        </Link>
                                    ) : undefined
                                }
                            >
                                <Separator/>
                                <P className="mt-3">{exp.description}</P>
                                {exp.skills.length > 0 && (
                                    <div className="flex gap-2 flex-wrap mt-3">
                                        {exp.skills.map((skill, idx) => (
                                            <Badge key={idx} variant="secondary">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </ExperienceCard>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
