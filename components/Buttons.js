import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

/* EXPO ICON IMPORTS */
import { MaterialCommunityIcons } from '@expo/vector-icons';

/* CUSTOM IMPORTS */
import colors from '../config/colors';

function Buttons({
    backgroundColor, 
    borderRadius,
    borderWidth,
    buttonHeight=60,
    buttonWidth="100%",
    children, 
    color=colors.white,
    disabled=false,
    fontFamily,
    fontSize,
    iconName,
    marginTop,
    onPress,
    style,
}) {
    return (
        <TouchableOpacity onPress={onPress} disabled={disabled}>
            <View 
                style={
                    [style, styles.button, 
                    {
                        backgroundColor: backgroundColor, 
                        borderRadius: borderRadius, 
                        borderWidth: borderWidth,
                        height: buttonHeight,
                        marginTop: marginTop,
                        width: buttonWidth,
                    }]}>
                <Text style={{fontFamily: fontFamily, fontSize: fontSize, color: color, width: "100%", textAlign: "center"}}>{children}</Text>
                { iconName && <MaterialCommunityIcons name={iconName} size={24} color={(disabled) ? colors.disabled : colors.white} /> }
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: "center",
        justifyContent: "center",
    },
})

export default Buttons;