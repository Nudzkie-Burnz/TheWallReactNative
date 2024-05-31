import React from 'react';
import { TouchableWithoutFeedback, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../config/colors';

function DeleteItemAction({onPress}) {
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={styles.deleteContainer}>
                <MaterialCommunityIcons name="delete" size={30} color={colors.white} />
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    deleteContainer: {
        alignItems: "center",
        backgroundColor: colors.danger,
        height: "100%",
        justifyContent: "center",
        position: "relative",
        width: 100,
        zIndex: 1,
    }
})

export default DeleteItemAction;