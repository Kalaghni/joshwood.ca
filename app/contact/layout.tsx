import {ReactNode} from "react";

export default function ContactLayout({
    children,
                                      }: {
    children: ReactNode;
}) {
    return (
        <div className="w-screen h-[calc(100vh_-_74px)] flex justify-center items-center">
            {children}
        </div>
    )
}