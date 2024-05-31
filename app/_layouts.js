import React from 'react';
import { Stack } from 'expo-router';

function Layout(props) {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: "Login"
                }} 
            />
            <Stack.Screen
                name="messages"
                options={{
                    title: "Messages"
                }}
            />
            <Stack.Screen
                name="replies"
                options={{
                    title: "Replies"
                }}
            />
            <Stack.Screen
                name="register"
                options={{
                    title: "Register"
                }}
            />
        </Stack>
    );
}

export default Layout;