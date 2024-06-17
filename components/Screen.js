import React, { useCallback } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet } from 'react-native';

/* EXPO FONTS IMPORTS */
import Constants from "expo-constants";
import { useFonts } from 'expo-font';

/* CUSTOM IMPORTS */
import colors from '../config/colors';

function Screen({children, style}) {
    /* Load Custom Fonts */
    const [fontsLoaded, fontError] = useFonts({
        "Inter-Black": require('../assets/fonts/inter/ttf/Inter-Black.ttf'),
        "Inter-Bold": require('../assets/fonts/inter/ttf/Inter-Bold.ttf'),
        "Inter-Medium": require('../assets/fonts/inter/ttf/Inter-Medium.ttf'),
        "Inter-Regular": require('../assets/fonts/inter/ttf/Inter-Regular.ttf'),
        "Inter-Light": require('../assets/fonts/inter/ttf/Inter-Light.ttf'),
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded || fontError) {
        //   await SplashScreen.hideAsync();
        };
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) {
        return null; 
    };

    return (
        <KeyboardAvoidingView style={{flex: 1}} behavior="height">
            <SafeAreaView style={[style ,styles.container]}>
                {children}
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.primary,
        flex: 1,
        height: "100%",
        marginTop: Constants.statusBarHeight,
        padding: Platform.OS !== "ios" ? 10 : 0,
    },
});

export default Screen;