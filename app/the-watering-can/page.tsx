'use server'
export default async function TheWateringCan() {
import UnderConstruction from "@/components/ui/under-construction";


export default function TheWateringCan() {


    return (
        <UnderConstruction
            fullPage        // takes full viewport; remove to let a parent container control height
            title="Under Construction"
            description="Wiring up data sources and polishing charts."
            onNotify={() => console.log('Notify me clicked')}
        />
    )

}