import {LogRocketIdentify} from "@/components/logrocket-provider";

export default ({children}: {children: React.ReactNode}) => {
    return (
        <>
            <LogRocketIdentify/>
            {children}
        </>
    );
}