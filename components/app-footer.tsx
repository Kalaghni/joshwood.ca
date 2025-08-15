import {Separator} from "@/components/ui/separator";
import P from "@/components/typography/p";

export default function AppFooter() {
    return (
        <footer>
            <Separator/>
            <div>
                <Separator orientation="vertical"/>
                <P className="text-center">Josh Wood &copy; {(new Date()).getYear()}</P>
            </div>

        </footer>
    );
}
