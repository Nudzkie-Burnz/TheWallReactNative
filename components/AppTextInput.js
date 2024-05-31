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
}, ref) =>{
    return (
        <View style={styles.inputContainer}>
            <TextInput 
                autoFocus={autoFocus}
                autoCapitalize={autoCapitalize}
                keyboardType={keyboardType}
                onChangeText={onChangeText}
                placeholder={placeholder}
                secureTextEntry={secureTextEntry} 
                style={styles.input}
                value={value}
                ref={ref}
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
        padding: 15,
    },
    input: {
        fontFamily: "InterRegular",
        fontSize: 16,
        width: "100%",
    }
})

export default AppTextInput;