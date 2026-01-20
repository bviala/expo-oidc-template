import * as WebBrowser from 'expo-web-browser';
import { Button } from 'react-native';


WebBrowser.maybeCompleteAuthSession();

export default function Login({ onLogin }: { onLogin: () => Promise<void> }) {
  return (
    <Button
      title="Login"
      onPress={() => {
        onLogin();
      }}
    />
  );
}
