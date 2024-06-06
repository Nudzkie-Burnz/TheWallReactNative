import React, { useEffect, useRef, useState, forwardRef } from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import colors from '../config/colors';

/*
    DOCU: FUNCTION COMPONENT CONVERTED TO forwardRef TO FORWARD DATA TO PARENT COMPONENT
    THEN RELOAD APP TO ELIMINATE ERROR { Component is not a function on adding forwardRef }
    SOURCE: https://stackoverflow.com/questions/69035612/typeerror-component-is-not-a-function-on-adding-forwardref
*/

const AppTextInput = forwardRef(({
    autoCapitalize="none",
    autoFocus,
    keyboardType="default",
    onChangeText,
    placeholder,
    secureTextEntry=false,
    value,
    placeholderTextColor,
    onBlur,
}, ref) => {

    const onblurInput = ()=> {
        console.log("blurr")
    }

    return (
        <View style={styles.inputContainer}>
            <TextInput 
                autoCapitalize={autoCapitalize}
                autoFocus={autoFocus}
                keyboardType={keyboardType}
                onChangeText={onChangeText}
                placeholder={placeholder}
                ref={ref}
                secureTextEntry={secureTextEntry} 
                style={styles.input}
                value={value}
                placeholderTextColor={placeholderTextColor}
                onBlur={onBlur}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    inputContainer: {
        alignItems: "center",
        borderColor: colors.separator,
        borderRadius: 30,
        borderWidth: 1,
        flexDirection: "row",
        height: 60,
        marginTop: 10,
    },
    input: {
        color: colors.white,
        fontFamily: "InterRegular",
        fontSize: 16,
        padding: 15,
        paddingRight: 50,
        width: "100%",
    }
})

export default AppTextInput;