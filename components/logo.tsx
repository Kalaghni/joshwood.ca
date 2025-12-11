import {ComponentProps} from "react";
import Image from "next/image";
import Link from "next/link";
import {cn} from "@/lib/utils";

export default function Logo({className, ...props}: Omit<ComponentProps<typeof Image>, 'alt'|'src'>) {

    return (
        <Link href="/" style={{width: 40, height: 40}} className={cn(className)}>
            <div className="dark:visible">
                <Image className="dark:block hidden" width={50} height={50} src="/logo.png" alt="Site Logo"{...props}/>
            </div>
            <div>
                <Image className="block dark:hidden" width={50} height={50} src="/logo-light.png" alt="Site Logo"{...props}/>
            </div>
        </Link>
    )
}