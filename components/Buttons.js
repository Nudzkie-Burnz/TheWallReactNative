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
    children, 
    color=colors.white,
    fontFamily,
    fontSize,
    height=60,
    marginTop,
    onPress,
    style,
    width="100%",
    disabled=false,
    iconName,
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
                        marginTop: marginTop,
                        width: width,
                        height: height
                    }]}>
                <Text style={{fontFamily: fontFamily, fontSize: fontSize, color: color}}>{children}</Text>
                { iconName && <MaterialCommunityIcons name={iconName} size={24} color={(disabled) ? colors.separator : colors.primary} /> }
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