import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../config/colors';

function EmptyListNotification({title, message, style}) {
    return (
        <View style={[styles.container, style]}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.info}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        flexDirection: "column",
        paddingBottom: 40,
        paddingTop: 60,
    },
    title: {
        color: colors.separator,
        fontFamily: "Inter-Bold",
        fontSize: 14,
    },
    info: {
        color: colors.separator,
        fontFamily: "Inter-Regular",
        fontSize: 12,
    }
})

export default EmptyListNotification;