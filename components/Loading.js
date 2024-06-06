import React from 'react';
import { ImageBackground, View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import colors from '../config/colors';

function Loading({text}) {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.disabled}/>
            <Text style={styles.text}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        flex: 1,
        height: 200,
        justifyContent: "center",
        position: "absolute",
        top: 0,
        width: "100%",
    },
    loading: {
        height: 60,
        marginBottom: 10,
        width: 60,
        
    },
    text: {
        fontFamily: "InterRegular",
        fontSize: 12,
        color: colors.disabled
    }
})

export default Loading;