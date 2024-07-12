import React, { useState } from 'react';

import { 
    StyleSheet, 
    View, 
    Text, 
    FlatList, 
    TouchableWithoutFeedback, 
    TouchableHighlight,
    TouchableOpacity,
    Image, 
    Modal, 
    Pressable,
} from 'react-native';

import { getAuth } from 'firebase/auth';
import { useRouter } from 'expo-router';
import Constants from "expo-constants"

import ItemSeparator from './ItemSeparator';
import colors from '../config/colors';

import { MaterialIcons } from '@expo/vector-icons';

function AppDropDown({title, getFunction}) {
    const auth = getAuth();
    const userName = auth.currentUser.displayName[0];
    const [modalVisible, setModalVisible] = useState(false);
    const router = useRouter();
    
    const dropDownOptionList = [
        {
            title: "Profile",
            icon: "person",
            route: "/profile"
        },
        {
            title: "Settings",
            icon: "settings",
            route: "/profile"
        },
        {
            title: "Logout",
            icon: "logout",
            route: null
        },
    ];

    /* Navigate to specified routes from the given parameter */
    const navigateRoute = (route)=> {
        (route) ? router.push({pathname: route}) : getFunction();
    };

    return (
        <View style={styles.container}>
            <View testID="Profile Button">
                <TouchableOpacity
                    onPress={()=> setModalVisible(true)}
                    title="Profile"
                    accessibilityLabel="Learn more about this purple button"
                    style={styles.profile}
                    underlayColor={colors.separator}  
                >
                    <Text style={styles.profileText}>{userName}</Text>
                </TouchableOpacity>
            </View>

            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModalVisible(!modalVisible);
            }}>
                <Pressable onPress={()=> setModalVisible(!modalVisible)} style={{
                    backgroundColor: colors.backdrop,
                    height: "100%", 
                    width: "100%", 
                    marginTop: Constants.statusBarHeight,
                }}>
                  <View style={styles.listContainer}>
                    <FlatList
                        data={dropDownOptionList}
                        keyExtractor={item => item.title}
                        key={item => item.id}
                        renderItem={({item, index}) =>
                            <View style={styles.button} testID={item.title}>
                                <TouchableHighlight onPress={()=> navigateRoute(item.route)}  underlayColor={colors.white}>
                                    <View style={{flexDirection: "row", alignItems: "center"}}>
                                        <MaterialIcons style={{marginRight: 10}} name={item.icon} size={24} color="black" />
                                        <Text style={styles.listText}>{item.title}</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        }
                        ItemSeparatorComponent={()=>  
                            <ItemSeparator/>
                        }
                    />
                  </View>
                </Pressable>
        </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "relative",
        borderRadius: 10,
    }, 
    listContainer: {
        backgroundColor: colors.white,
        width: 200,
        borderRadius: 6,
        right: 10,
        position: "absolute",
        top: 70,
    },
    profile: {
        alignItems: "center",
        borderRadius: 25,
        backgroundColor: colors.white,
        height: 50,
        justifyContent: "center",
        width: 50,
    },
    listText: {
        fontFamily: "Inter-Medium",
        color: colors.primary,
    },
    profileText: {
        fontFamily: "Inter-Bold",
        fontSize: 18,
        textTransform: "uppercase"
    },
    listStyle: {
        borderBlockColor: colors.separator,
        borderRadius: 10,
        borderWidth: 1,
        padding: 10,
        position: "absolute",
        right: 0,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        top: 40,
        width: 100,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        zIndex: 1
    }, 
    button: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 5,
        paddingRight: 5
    }
})

export default AppDropDown;