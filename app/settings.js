import React from 'react';
import { View, Text } from 'react-native';

import Screen from '../components/Screen';
import Header from '../components/Header';

function settings(props) {
    return (
        <Screen>
            <View>
                <Header title="Settings"/>
                <Text>Settings Screen</Text>
            </View>
        </Screen>
    );
}

export default settings;