import { useAuthContext } from '@/context/authProvider';
import React from 'react';
import { Button } from 'react-native';

const Logout = () => {
    const { logout } = useAuthContext()

    return (
       <Button
             title="LOG OUT"
             onPress={() => {
               logout();
             }}
        />
    );
};

export default Logout;