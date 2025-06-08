"use client";
import LetterGlitch from "@/components/ui/letter-glitch";
import H2 from "@/components/typography/h2";
import ExperienceCard from "@/components/experience/experience-card";
import {Badge} from "@/components/ui/badge";
import P from "@/components/typography/p";
import {Separator} from "@/components/ui/separator";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {useRef} from "react";

export default function Experience() {

    const containerRef = useRef<HTMLDivElement | null>(null);

    return (
        <section id="experience">
            <div className="relative contain-content overflow-hidden">
                <LetterGlitch
                    className="absolute inset-0 z-0"
                    parentRef={containerRef}
                    glitchSpeed={20}
                    centerVignette={true}
                    outerVignette={true}
                    smooth={true}
                    glitchColors={['#2b4539', '#61dca3', '#61b3dc']}
                />
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
                        <P className="mt-3">
                            <b>Some highlights of my role include:</b>
                        </P>
                        <ul className="list-disc ml-8">
                            <li>Full-Stack Development: Architected and implemented custom plugins and integrations for WooCommerce to support complex business needs, such as dynamic product configuration, custom shipping/tax logic, and advanced inventory management.</li>
                            <li>Modern Web Applications: Built internal and customer-facing web apps using React and TypeScript, providing staff with streamlined dashboards and tools for order tracking, customer service, and reporting.</li>
                            <li>Automation & System Services: Developed and deployed background services and automations in Python and C# for data synchronization, API integrations, scheduled reporting, and process monitoring.</li>
                            <li>API Integration: Integrated third-party APIs (payment gateways, shipping providers, scheduling, and marketing tools) to streamline operations and improve customer experience.</li>
                            <li>DevOps & Deployment: Containerized key services with Docker, automated deployments, and managed Linux server environments for reliable, scalable uptime.</li>
                            <li>Problem Solving & Support: Provided ongoing troubleshooting and technical support to staff, rapidly addressing issues and continuously improving systems based on feedback and business needs.</li>
                            <li>Cross-Disciplinary Collaboration: Worked closely with the marketing, sales, and design teams to ensure technical solutions met the evolving requirements of a fast-paced retail business.</li>
                            <li>This role has required me to be adaptable and resourceful—often building solutions from scratch or customizing open-source projects to fit our unique workflow. The result has been a robust, modernized technical environment that keeps The Watering Can Flower Market competitive in both physical and digital retail spaces.</li>
                        </ul>
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
                        <ul className="list-disc ml-8">
                            <li>Custom WordPress Site: Developed a user-friendly, responsive website tailored to reflect Expanded Living’s brand and offerings.</li>
                            <li>Online Scheduling Integration: Integrated Acuity Scheduling for seamless online appointment booking, reducing administrative work and improving client experience.</li>
                            <li>Automated Communications: Configured automated email notifications for appointments and class registrations, ensuring smooth communication with clients.</li>
                            <li>Content Management Training: Provided training and documentation so the business owner could easily manage content, events, and updates without ongoing developer intervention.</li>
                        </ul>
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
                        <br/>
                        <ul className="list-disc ml-8">
                            <li>Website Setup & Customization: Installed and customized WordPress, selected appropriate themes and plugins, and ensured a visually appealing, responsive design.</li>
                            <li>Performance & Security: Optimized the site for speed, security, and search engine visibility, enabling the business to make a professional impression online with minimal overhead.</li>
                            <li>Client Handoff: Provided documentation and basic training for site maintenance and updates.</li>
                            <li>Content Management Training: Provided training and documentation so the business owner could easily manage content, events, and updates without ongoing developer intervention.</li>
                        </ul>
                        <br/>
                        <P>
                            Though a straightforward project, it demonstrates my ability to deliver polished, reliable web solutions for clients with a wide range of needs and budgets.
                        </P>
                    </ExperienceCard>
                </div>
            </div>
        </section>
    )
    
}