import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import Login from '@/components/login';
import Logout from '@/components/logout';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuthContext } from '@/context/authProvider';
import { CODE_VERIFIER_KEY, getClientId, getDiscoveryDocument, getRedirectUri } from '@/utils/authUtils';
import { storeSetItem } from '@/utils/secureStorage';
import { useAuthRequest } from 'expo-auth-session';
import { useEffect } from 'react';

export default function HomeScreen() {
  const { entraUser, handleAuthCallback} = useAuthContext();

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: getClientId(),
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
  }, [response]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        {
          entraUser
            ? <View>
              <ThemedText>Logged in as {entraUser!.given_name! + ' ' + entraUser!.family_name!}</ThemedText>
              <Logout/>
            </View>
            : <View>
              <ThemedText>Not logged in</ThemedText>
              <Login onLogin={login}/>
            </View>
        }
        </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
