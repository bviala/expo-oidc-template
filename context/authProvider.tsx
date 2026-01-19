import { ACCESS_TOKEN_KEY, CODE_VERIFIER_KEY, EntraTokenPayload, getCliendId, getDiscoveryDocument, getRedirectUri, ID_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/utils/authUtils';
import { exchangeCodeAsync } from 'expo-auth-session';
import { createContext, useContext, useEffect, useState } from 'react';
import { storeDeleteItem, storeGetItem, storeSetItem } from '../utils/secureStorage';

type AuthContextType = {
    entraUser: EntraTokenPayload | null;
    isAuthInitPending: boolean;
    initAuth: () => Promise<void>;
    logout: () => void;
    handleAuthCallback: (authorizationCode: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => { 
    const [entraUser, setEntraUser] = useState<EntraTokenPayload | null>(null);
    const [isAuthInitPending, setIsAuthInitPending] = useState<boolean>(true);

    const getAccessToken = async () => {
        return await storeGetItem(ACCESS_TOKEN_KEY);
    };

    const getEntraUser = (token: string): EntraTokenPayload => {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
            sub: payload.sub,
            email: payload.email,
            name: payload.name,
            given_name: payload.given_name,
            family_name: payload.family_name,
        };
    }

    const initAuth = async () => {
        console.log('🚀 initializing auth');
        
        const token = await getAccessToken();

        if (token) {
            const entraUser = getEntraUser(token);
            setEntraUser(entraUser);
            console.log('🔐 Found valid token and set user')
        }

        setIsAuthInitPending(false);
    }

    const handleAuthCallback = async (authorizationCode: string) => {

    const codeVerifier = await storeGetItem(CODE_VERIFIER_KEY);

    if (!codeVerifier) {
        throw new Error('AUTH CALLBACK ERROR: Code verifier not found.');
    }

    try {
      const tokenResponse = await exchangeCodeAsync(
        {
          clientId: getCliendId(),
          code: authorizationCode,
          redirectUri: getRedirectUri(),
          extraParams: {
            code_verifier: codeVerifier,
          },
        },
        getDiscoveryDocument(),
      );

      console.log("🔐 TOKEN EXCHANGE SUCCESS:")
      if(tokenResponse.idToken) {
        console.log("\tGOT ID TOKEN")
        await storeSetItem(ID_TOKEN_KEY, tokenResponse.idToken)
    }
    
    if(tokenResponse.accessToken) {
        console.log("\tGOT ACCESS TOKEN")
        await storeSetItem(ACCESS_TOKEN_KEY, tokenResponse.accessToken)
    }
    
    if (tokenResponse.refreshToken) {
        console.log("\tGOT REFRESH TOKEN")
        await storeSetItem(REFRESH_TOKEN_KEY, tokenResponse.refreshToken)
      }

      initAuth()
    } catch(error) {
      console.error(error)
    }

  }

    const logout = () => {
        storeDeleteItem(ACCESS_TOKEN_KEY)
        storeDeleteItem(ID_TOKEN_KEY)
        storeDeleteItem(REFRESH_TOKEN_KEY)
        setEntraUser(null)
    }

    useEffect(() => {
        initAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const authContext: AuthContextType = {
        entraUser,
        isAuthInitPending,
        initAuth,
        logout,
        handleAuthCallback
    };

    return (
        <AuthContext.Provider value={authContext}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuthContext has to be used within <AuthProvider>');
    }
    return context;
};