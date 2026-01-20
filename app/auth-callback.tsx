import { useRouter } from "expo-router";
import { useEffect } from "react";

// This route is a workaround to Entra ID not accepting app root URI as redirection URI (clariceexpo://) Only needed for Android as iOS doesn't redirect
export default function AuthCallback() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/')
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}