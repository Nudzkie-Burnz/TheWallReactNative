import React from 'react';
import { ImageBackground, View, StyleSheet, Text } from 'react-native';
import colors from '../config/colors';

function Loading({text}) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{text}</Text>
            <ImageBackground source={require("../assets/circ-loading.gif")} style={styles.loading} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        flex: 1,
        height: 200,
        justifyContent: "center",
        width: "100%",
        position: "absolute",
        top: 0
    },
    loading: {
        height: 80,
        width: 80
    },
    text: {
        fontFamily: "InterRegular",
        fontSize: 12
    }
})

export default Loading;