import { ACCESS_TOKEN_KEY, EntraTokenPayload } from '@/utils/authUtils';
import { createContext, useContext, useEffect, useState } from 'react';
import { storeGetItem } from '../utils/secureStorage';


type AuthContextType = {
    entraUser: EntraTokenPayload | null;
    isAuthInitPending: boolean;
    initAuth: () => Promise<void>;
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
        console.log("token: " + token)
        if (token) {
            const entraUser = getEntraUser(token);
            setEntraUser(entraUser);
        }

        setIsAuthInitPending(false);
    }

    useEffect(() => {
        initAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const authContext: AuthContextType = {
        entraUser,
        isAuthInitPending,
        initAuth,
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