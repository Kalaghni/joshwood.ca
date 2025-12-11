"use client";
import LetterGlitch from "@/components/backgrounds/letter-glitch";
import H2 from "@/components/typography/h2";
import ExperienceCard from "@/components/experience/experience-card";
import {Badge} from "@/components/ui/badge";
import P from "@/components/typography/p";
import {Separator} from "@/components/ui/separator";
import Link from "next/link";
import {Button} from "@/components/ui/button";

export default function Experience() {


    return (
        <section id="experience" data-anchor>
            <div className="relative contain-content overflow-hidden">
                <div className="relative z-10 py-8 px-4 sm:p-16">
                    <H2>Experience</H2>
                    <ExperienceCard
                        className="mt-8"
                        title={"The Watering Can Flower Market"}
                        location="Vineland, ON"
                        website={"https://thewateringcan.ca"}
                        description={
                            <div>
                                <Badge variant="default">Lead Developer</Badge>
                            </div>
                        }
                        footer={
                            <Link href="/the-watering-can">
                                <Button variant="link" className="whitespace-normal">
                                    Read more about my work at The Watering Can
                                </Button>
                            </Link>
                        }
                    >
                        <Separator/>
                        <P className="mt-3">
                            At <b>The Watering Can Flower Market</b>, I serve as the lead developer responsible for architecting, developing, and maintaining a diverse portfolio of web applications, system services, and internal tools to support a busy retail and eCommerce operation.
                            Our primary technology stack includes WordPress with WooCommerce, which powers the bulk of our online storefront and order management system, but I also work across a broad range of languages and platforms—including TypeScript, React, PHP, Python, C#, MySQL, and Dockerized deployments on Linux servers.
                        </P>
                        <div className="flex gap-2 flex-wrap mt-3">
                            {[
                                "Full-Stack Development",
                                "Modern Web Applications",
                                "Automation & System Services",
                                "API Integration",
                                "DevOps & Deployment",
                                "Problem Solving & Support",
                                "Cross-Disciplinary Collaboration",
                            ].map((item, idx) => (
                                <Badge key={idx} variant="secondary" children={item}/>
                            ))}
                        </div>
                    </ExperienceCard>

                    <ExperienceCard
                        title={"Expanded Living"}
                        location="Niagara, ON"
                        website={"https://expandedliving.ca"}
                        description={
                            <Badge variant="default">Freelance Web Developer/Consultant</Badge>
                        }
                    >
                        <Separator/>
                        <P className="mt-3">
                            I partnered with <b>Expanded Living</b>—a local business offering life coaching and dance classes—to design, develop, and launch their WordPress-based website.
                            The project focused on creating a professional, approachable digital presence that supports the client’s unique business model.
                        </P>
                        <br/>
                        <div className="flex gap-2 flex-wrap mt-3">
                            {[
                                "Custom WordPress Site",
                                "Online Scheduling Integration",
                                "Automated Communications",
                                "Content Management Training",
                            ].map((item, idx) => (
                                <Badge key={idx} variant="secondary" children={item}/>
                            ))}
                        </div>
                    </ExperienceCard>

                    <ExperienceCard
                        title={"The Timeless Colours"}
                        location="St. Catharines, ON"
                        website={"https://thetimelesscolours.ca"}
                        description={
                            <Badge variant="default">Freelance Web Developer/Consultant</Badge>
                        }
                    >
                        <Separator/>
                        <P className="mt-3">
                            For The Timeless Colours, I developed a simple yet elegant WordPress website to serve as an online showcase for the business.
                        </P>
                        <div className="flex gap-2 flex-wrap my-3">
                            {[
                                "Website Setup & Customization",
                                "Performance & Security",
                                "Client Handoff",
                                "Content Management Training",
                            ].map((item, idx) => (
                                <Badge key={idx} variant="secondary" children={item}/>
                            ))}
                        </div>
                        <P>
                            Though a straightforward project, it demonstrates my ability to deliver polished, reliable web solutions for clients with a wide range of needs and budgets.
                        </P>
                    </ExperienceCard>
                </div>
            </div>
        </section>
    )
    
}