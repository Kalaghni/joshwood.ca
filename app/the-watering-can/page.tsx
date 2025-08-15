'use server'
import UnderConstruction from "@/components/ui/under-construction";


export default async function TheWateringCan() {

    return (
        <UnderConstruction
            fullPage        // takes full viewport; remove to let a parent container control height
            title="Under Construction"
            description="Wiring up data sources and polishing charts."
        />
    )

}