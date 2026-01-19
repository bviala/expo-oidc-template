import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";


export default function AuthCallback() {
    const params = useLocalSearchParams();
    const router = useRouter();

    useEffect(() => {
        handleAuthCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    const handleAuthCallback = async () => {
        /* if (!params.code) {
            throw new Error("AUTH CALLBACK ERROR: No authorization code in params")
        }

        const codeVerifier = await storeGetItem(CODE_VERIFIER_KEY);

        if (!codeVerifier) {
            throw new Error('AUTH CALLBACK ERROR: Code verifier not found.');
        }

        const tokenResponse = await exchangeCodeAsync(
            {
                clientId: getCliendId(),
                code: params.code as string,
                redirectUri: getRedirectUri(),
                extraParams: {
                code_verifier: codeVerifier,
                },
            },
            getDiscoveryDocument(),
        );

        console.log("🔐 TOKEN EXCHANGE SUCCESS: " + tokenResponse.idToken) */

        router.replace('/')
    }
}