import React, { forwardRef } from 'react';
import { View, StyleSheet, KeyboardAvoidingView } from 'react-native';


import Buttons from './Buttons';
import AppTextInput from './AppTextInput';
import colors from '../config/colors';

const AppInputSubmit = forwardRef(({
    autoCapitalize,
    autoFocus = true,
    buttonHeight,
    buttonWidth,
    disabled,
    iconName,
    onChangeText,
    onPress,
    placeholder,
    placeholderTextColor,
    value,
    onBlur
}, ref) => {
    return (
        <View style={styles.container}>
            {/* <KeyboardAvoidingView behavior="padding"> */}
                <AppTextInput 
                    autoCapitalize={autoCapitalize}
                    autoFocus={autoFocus} 
                    color={colors.white}
                    onChangeText={onChangeText} 
                    placeholder={placeholder} 
                    placeholderTextColor={placeholderTextColor}
                    ref={ref}
                    value={value}
                    onBlur={onBlur}
                />
                <Buttons 
                    buttonHeight={buttonHeight} 
                    buttonWidth={buttonWidth} 
                    disabled={disabled}
                    iconName={iconName} 
                    onPress={onPress} 
                    style={styles.button} 
                />
            {/* </KeyboardAvoidingView> */}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.primary,
        paddingBottom: 10,
        position: "relative",
    },
    button: {
        position: "absolute", 
        top: -50, 
        right: 20
    }
})

export default AppInputSubmit;