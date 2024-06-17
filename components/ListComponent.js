import React, { useState, forwardRef } from 'react';
import { 
    FlatList,
    Image, 
    Keyboard, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    TouchableWithoutFeedback, 
    View, 
} from 'react-native';

import colors from '../config/colors';

import Swipeable from 'react-native-gesture-handler/Swipeable';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AntDesign } from '@expo/vector-icons';

let row = [];
let prevOpenedRow;

const ACTIONS = [
    {
        name: "like",
        iconName: "like1",
        size: 24
    },
    {
        name: "dislike",
        iconName: "dislike1",
        size: 24
    },

];

const ListComponent = forwardRef(({
    message,
    id,
    userId,
    image,
    name,
    onPress,
    renderRightActions,
    itemIndex,
    style,
    repliesCount,
    seeMore=false,
    titleColor=colors.white,
    isEdit=false,
    setCloseSwipeable
}, ref) => {
    const isMessageLong = (message.length > 650) ? true : false;
    const [expanded, setExpanded] = useState(false);
    const [longPressed, setLongPressed] = useState(false);

    /*
        DOCU: FUNCTION ALTERNATIVE FIX SWIPEABLE NOT CLOSING
        SOURCE: https://github.com/software-mansion/react-native-gesture-handler/issues/764
    */
    const closeRow = (index)=> {
        Keyboard.dismiss();

        if (prevOpenedRow && prevOpenedRow !== row[index]) {
            prevOpenedRow.close();
        };
        
        prevOpenedRow = row[index];

        /* Set swipeable element from specified props for closing swipeable  */
        if (setCloseSwipeable) {
            setCloseSwipeable(prevOpenedRow);
        } 
    };

    const setMessageActionUpdate = (actionName)=> {
        console.log(actionName);

        console.log(isEdit);
    };

    return (
        <Swipeable 
            renderRightActions={renderRightActions}

            /* SWIPEABLE FIX PROPS */
	        leftThreshold={80}
	        rightThreshold={40}
            friction={2}
            onSwipeableOpen={()=> closeRow(itemIndex)}
            ref={(ref) => row[itemIndex] = ref}
        >
            <TouchableWithoutFeedback
                underlayColor={colors.primary}
                onLongPress={()=> setLongPressed(true)}
                onPress={onPress}>
                <View style={[style, styles.container]}>
                    <Text style={styles.profileList}>{name[0]}</Text>
                    <View style={styles.detailsContainer}>
                        <Text style={[styles.text, {fontFamily: "Inter-Bold", fontSize: 14, textTransform: "capitalize", color: titleColor}]}>{(name) ? name : "Unknown"}</Text>
                        <Text style={[styles.text, {fontSize: 14}]}>
                            {
                                (isMessageLong) 
                                    ? 
                                        (seeMore) 
                                            ? expanded ? message : `${message.substring(0, 100)}...` 
                                            : message
                                    : message
                            }
                        </Text>
                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "flex-end", paddingRight: 10}}>
                            {
                                (seeMore && isMessageLong) &&
                                    <TouchableOpacity onPress={ ()=> setExpanded(!expanded)}>
                                        <View style={styles.seeMore}>
                                            <Text style={styles.seeMoreFont}>{expanded ? "See Less" : "See More"}</Text>
                                            <MaterialCommunityIcons name={(expanded) ? "chevron-up" : "chevron-down"} size={20} color={colors.disabled} />
                                        </View>
                                    </TouchableOpacity>
                            }
                        </View>
                        {(repliesCount !== undefined && repliesCount !== 0) && <Text style={styles.replyText}>({repliesCount}) {repliesCount > 1 ? "Replies" : "Reply"}</Text>}
                    </View>

                    <TouchableOpacity style={[styles.actionBackground, {display: longPressed ? "flex" : "none"}]} onPress={()=> setLongPressed(false)}>
                        <View style={styles.actionContainer}>
                            <FlatList
                                style={{flexDirection: "row"}}
                                data={ACTIONS}
                                keyExtractor={item => item.name}
                                renderItem={({item, index}) => 
                                    <TouchableOpacity onPress={()=> setMessageActionUpdate(item.name)}>
                                        <View style={{padding: 20}}>
                                            <AntDesign name={item.iconName} size={item.size} color={colors.primary} />
                                        </View>
                                    </TouchableOpacity>
                                }
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        </Swipeable>
    );
});

const styles = StyleSheet.create({
    profileList: {
        backgroundColor: colors.white, 
        borderRadius: 22, 
        color: colors.primary, 
        fontFamily: "Inter-Bold",
        height: 45, 
        paddingTop: 12,
        textAlign: "center", 
        textTransform: "uppercase", 
        width: 45, 
        overflow: "hidden" /* Solution for border radius not working on IOS */
    },
    actionBackground: {
        alignItems: "center",
        backgroundColor: colors.backdrop,
        bottom: 10,
        justifyContent: "center",
        left: 0,
        position: "absolute",
        right: 0,
        top: 0,
    },
    actionContainer: {
        backgroundColor: colors.white,
        borderRadius: 10,
    },
    container: {
        alignItems: "flex-start",
        backgroundColor: colors.primary,
        flexDirection: "row",
        paddingBottom: 10,
        paddingTop: 10,
        width: "100%",
    },
    seeMoreFont: {
        color: colors.disabled, 
        fontFamily: "Inter-Medium", 
        fontSize: 12, 
        textAlign: "center"
    },
    seeMore: {
        alignItems: "center",
        borderRadius: 5,
        flexDirection: "row",
        justifyContent: "space-between",
        width: 80,
    },
    text: {
        color: colors.white,
    },
    replyText: {
        color: colors.white,
        fontFamily: "Inter-Medium",
        fontSize: 12, 
        marginBottom: 5,
    },
    image: {
        borderRadius: 30,
        height: 50,
        width: 50, 
    },
    detailsContainer: {
        marginLeft: 10,
        flex: 1,
    }
})

export default ListComponent;