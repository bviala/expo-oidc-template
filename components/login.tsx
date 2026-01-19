import { useAuthContext } from '@/context/authProvider';
import { CODE_VERIFIER_KEY, getCliendId, getDiscoveryDocument, getRedirectUri } from '@/utils/authUtils';
import { storeSetItem } from '@/utils/secureStorage';
import { useAuthRequest } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import { Button } from 'react-native';


WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const { handleAuthCallback } = useAuthContext()

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

  

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;

      handleAuthCallback(code)
    }
  }, [handleAuthCallback, response]);

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
