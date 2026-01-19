import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import Login from '@/components/login';
import Logout from '@/components/logout';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuthContext } from '@/context/authProvider';

export default function HomeScreen() {
  const { entraUser } = useAuthContext();


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
                entraUser ?
                    <View>
                        <ThemedText>Logged in as {entraUser!.given_name! + ' ' + entraUser!.family_name!}</ThemedText>
                        <Logout/>
                    </View>
                    :
                    <View>
                        <ThemedText>Not logged in</ThemedText>
        <Login/>

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
