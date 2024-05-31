import React, { useCallback } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useFonts } from 'expo-font';
import Constants from "expo-constants"

function Screen({children, style}) {
    const [fontsLoaded, fontError] = useFonts({
        InterBlack: require('../assets/fonts/inter/ttf/Inter-Black.ttf'),
        InterBold: require('../assets/fonts/inter/ttf/Inter-Bold.ttf'),
        InterMedium: require('../assets/fonts/inter/ttf/Inter-Medium.ttf'),
        InterRegular: require('../assets/fonts/inter/ttf/Inter-Regular.ttf'),
        InterLight: require('../assets/fonts/inter/ttf/Inter-Light.ttf'),
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded || fontError) {
        //   await SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    return (
        <>
            <SafeAreaView onLayout={onLayoutRootView} style={[style ,styles.container]}>
                {children}
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: "100%",
        marginTop: Constants.statusBarHeight,
        padding: 10,
    }
})

export default Screen;