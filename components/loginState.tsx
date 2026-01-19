import { useAuthContext } from '@/context/authProvider';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const LoginComponent = () => {
    const { entraUser } = useAuthContext();

    return (
        <View style={styles.container}>
            {
                entraUser ?
                    <View>
                        <Text>Logged in as {entraUser!.given_name! + entraUser!.family_name!}</Text>
                    </View>
                    :
                    <View>
                        <Text>Not logged in</Text>
                    </View>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    input: { borderWidth: 1, padding: 10, marginBottom: 15, borderRadius: 5 },
    button: { backgroundColor: '#007AFF', padding: 12, borderRadius: 5 },
    buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});