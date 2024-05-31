import React from 'react';
import { TouchableHighlight, View, Image, Text, StyleSheet } from 'react-native';
import colors from '../config/colors';
import Swipeable from 'react-native-gesture-handler/Swipeable';

let row = [];
let prevOpenedRow;

function ListComponent({
    message,
    id,
    image,
    name,
    onPress,
    renderRightActions,
    itemIndex
}) {
    /*
        DOCU: FUNCTION ALTERNATIVE FIX SWIPEABLE NOT CLOSING
        SOURCE: https://github.com/software-mansion/react-native-gesture-handler/issues/764
    */
    const closeRow = (index)=> {
        if (prevOpenedRow && prevOpenedRow !== row[index]) {
            prevOpenedRow.close();
        };
    
        prevOpenedRow = row[index];
    }

    return (
        <Swipeable 
            renderRightActions={renderRightActions}

            /* SWIPEABLE FIX PROPS */
            ref={(ref) => row[itemIndex] = ref}
            onSwipeableOpen={()=> closeRow(itemIndex)}
            friction={2}
	        leftThreshold={80}
	        rightThreshold={40}
        >
            <TouchableHighlight
                underlayColor={colors.white}
                onPress={onPress}>
                <View style={styles.container}>
                    <Image style={styles.image} source={image}/>
                    <View style={styles.detailsContainer}>
                        <Text style={[styles.text, {fontFamily: "InterBold", fontSize: 14}]}>{(name) ? name : "Unknown"}</Text>
                        <Text style={[styles.text, {fontSize: 14}]}>{message}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        </Swipeable>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "flex-start",
        flexDirection: "row",
        paddingBottom: 10,
        paddingTop: 10,
        width: "100%",
    },
    text: {
        color: colors.primary,
    },
    image: {
        borderRadius: 30,
        height: 50,
        width: 50, 
    },
    detailsContainer: {
        marginLeft: 10,
        flex: 1
    }
})

export default ListComponent;