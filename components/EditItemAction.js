import React, { forwardRef } from 'react';

import { View, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import colors from '../config/colors';

const EditItemAction = forwardRef(({ onPress }, ref) => {
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={styles.editContainer} testID="Edit Button">
                <MaterialCommunityIcons name="pencil" size={30} color={colors.white} />
            </View>
        </TouchableWithoutFeedback>
    ); 
});

const styles = StyleSheet.create({
    editContainer: {
        alignItems: "center",
        backgroundColor: colors.green,
        height: "100%",
        justifyContent: "center",
        position: "relative",
        width: 100,
        zIndex: 1,
    }
})

export default EditItemAction;