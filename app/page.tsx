import Hero from "@/components/hero";
import Introduction from "@/components/introduction";
import Experience from "@/components/experience";
import Technologies from "@/components/technologies";
import { LazyMount } from "@/components/ui/lazy-mount";

export default function Home() {
    return (
        <section id="home" className="max-w-lvw w-full">
            {/*<LazyMount rootMargin="0px 0px">*/}
                <Hero />
            {/*</LazyMount>*/}
            {/*<LazyMount>*/}
                <Technologies />
            {/*</LazyMount>*/}
            {/*<LazyMount>*/}
                <Introduction />
            {/*</LazyMount>*/}
            {/*<LazyMount>*/}
                <Experience />
            {/*</LazyMount>*/}
        </section>
    );
}
