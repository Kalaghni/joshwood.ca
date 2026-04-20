import {useEffect, useState} from "react";
import {AdminUser} from "@/lib/auth";

export default function useCurrentUser() {

    const [error, setError] = useState<Error | null>(null);
    const [user, setUser] = useState<AdminUser|null>(null);
    const [loading, setLoading] = useState(true);

    async function fetchCurrentUser() {
        setLoading(true);
        try {

            const response = await fetch('/api/admin/me');

            if (!response.ok) {
                setError(new Error('Failed to fetch current user'));
                return;
            }
            setUser(await response.json());
        }
        catch (error) {
            setError(error as Error);
            return;
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!user) {
            void fetchCurrentUser();
        }
    }, [user])

    return {user, error, loading};
}