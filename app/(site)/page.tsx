import Hero from "@/components/hero";
// import Introduction from "@/components/introduction";
import Experience from "@/components/experience";
import Technologies from "@/components/technologies";

export default function Home() {
    return (
        <section id="home" className="max-w-lvw  w-screen xl:w-[calc(100vw_-_480px)] xl:mx-60">
            <Hero />
            <Technologies />
            {/*<Introduction />*/}
            <Experience />
        </section>
    );
}
