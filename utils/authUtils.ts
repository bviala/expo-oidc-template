import { DiscoveryDocument, makeRedirectUri } from "expo-auth-session";

// these keys can be updated in case of breaking changes to the auth implementation to ensure old tokens are not used
export const ID_TOKEN_KEY = 'idToken';
export const ACCESS_TOKEN_KEY = 'accessToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';
export const CODE_VERIFIER_KEY = 'codeVerifier';

export const getDiscoveryDocument = (): DiscoveryDocument => {
    if (!process.env.EXPO_PUBLIC_ENTRA_AUTHORITY) {
        throw new Error('Missing EXPO_PUBLIC_ENTRA_AUTHORITY environment variable')
    }
    return{
        authorizationEndpoint: `${process.env.EXPO_PUBLIC_ENTRA_AUTHORITY}/oauth2/v2.0/authorize`,
        tokenEndpoint: `${process.env.EXPO_PUBLIC_ENTRA_AUTHORITY}/oauth2/v2.0/token`,
        revocationEndpoint: `${process.env.EXPO_PUBLIC_ENTRA_AUTHORITY}/oauth2/v2.0/logout`,
    } 
};

export const getClientId = (): string => {
    if (!process.env.EXPO_PUBLIC_ENTRA_CLIENT_ID) {
        throw new Error('Missing EXPO_PUBLIC_ENTRA_CLIENT_ID environment variable')
    }
    return process.env.EXPO_PUBLIC_ENTRA_CLIENT_ID;
}

export const getRedirectUri = () => {
    return makeRedirectUri({
        scheme: 'clariceexpo', // Must match scheme defined in app.json
        path: 'auth-callback'
    })
}

export interface EntraTokenPayload {
    sub: string;
    email: string;
    name: string;
    given_name?: string;
    family_name?: string;
}