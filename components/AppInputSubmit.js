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
        <View style={styles.container} testID="Text Input Container">
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
                style={styles.input}
            />
            <Buttons 
                buttonHeight={buttonHeight} 
                buttonWidth={buttonWidth} 
                disabled={disabled}
                iconName={iconName} 
                onPress={onPress} 
                style={styles.button}
                testID="Submit Message Button" 
            />
        </View>
    );
});

const styles = StyleSheet.create({
    input: {
        width: "90%"
    },
    container: {
        alignItems: "center",
        backgroundColor: colors.primary,
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 10,
        paddingBottom: 10,
        position: "relative",
        width: "100%",
    },
    button: {
        marginLeft: 10,
        width: "10%"
    }
})

export default AppInputSubmit;