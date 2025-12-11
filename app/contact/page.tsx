"use client";

import ProjectOverview from "@/components/templates/project-overview";
import {Item, ItemContent, ItemDescription, ItemMedia, ItemTitle} from "@/components/ui/item";
import {BadgeCheck} from "lucide-react";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import {Button} from "@/components/ui/button";

export default function Contact() {


    return (
        <section className="px-4 py-10 sm:px-6 w-screen">
            <ProjectOverview
                title="Contact"
                subtitle="Let's get in touch!"
                summary={
                    <div>
                        <Item>
                            <ItemMedia>
                                <BadgeCheck/>
                            </ItemMedia>
                            <ItemContent>
                                <ItemTitle>Email</ItemTitle>
                                <ItemDescription>
                                    <Button asChild variant="link" className="px-0 mt-0">
                                        <Link href="mailto:josh.wood200213+inquiry@gmail.com">
                                            josh.wood200213@gmail.com
                                        </Link>
                                    </Button>
                                </ItemDescription>
                            </ItemContent>
                        </Item>
                    </div>
                }
            />
        </section>
    )
}