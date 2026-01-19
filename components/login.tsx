import { ACCESS_TOKEN_KEY, CODE_VERIFIER_KEY, getCliendId, getDiscoveryDocument, getRedirectUri, ID_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/utils/authUtils';
import { storeGetItem, storeSetItem } from '@/utils/secureStorage';
import { exchangeCodeAsync, useAuthRequest } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import { Button } from 'react-native';


WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: getCliendId(),
      scopes: ['openid'],
      redirectUri: getRedirectUri(), // will be used on Android. On iOS, no redirection happens
      usePKCE: true
    },
    getDiscoveryDocument()
  );

  const login = async () => {
    if (!request || !request.codeVerifier) {
      throw new Error('Auth request or code verifier missing');
    }
    // console.log("🔐 CODE VERIFIER: " + request?.codeVerifier)
    await storeSetItem(CODE_VERIFIER_KEY, request.codeVerifier!);
    promptAsync()
  }

  const handleAuthCallback = async (code: string) => {

    const codeVerifier = await storeGetItem(CODE_VERIFIER_KEY);

    if (!codeVerifier) {
        throw new Error('AUTH CALLBACK ERROR: Code verifier not found.');
    }

    try {
      const tokenResponse = await exchangeCodeAsync(
        {
          clientId: getCliendId(),
          code: code,
          redirectUri: getRedirectUri(),
          extraParams: {
            code_verifier: codeVerifier,
          },
        },
        getDiscoveryDocument(),
      );

      if(tokenResponse.idToken) {
        console.log("🔐 TOKEN EXCHANGE SUCCESS: ID TOKEN")
        await storeSetItem(ID_TOKEN_KEY, tokenResponse.idToken)
      }

      if(tokenResponse.accessToken) {
        console.log("🔐 TOKEN EXCHANGE SUCCESS: ACCESS TOKEN")
        await storeSetItem(ACCESS_TOKEN_KEY, tokenResponse.accessToken)
      }
      
      if (tokenResponse.refreshToken) {
        console.log("🔐 TOKEN EXCHANGE SUCCESS: REFRESH TOKEN")
        await storeSetItem(REFRESH_TOKEN_KEY, tokenResponse.refreshToken)
      }

      console.log("")
    } catch(error) {
      console.error(error)
    }

  }

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;

      handleAuthCallback(code)
    }
  }, [response]);

  return (
    <Button
      disabled={!request}
      title="Login"
      onPress={() => {
        login();
      }}
    />
  );
}
