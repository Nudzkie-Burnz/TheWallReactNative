import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

/* FIREBASE IMPORTS} */
import { FIREBASE_ADDOC, FIREBASE_COLLECTION, FIREBASE_DB } from '../firebaseconfig';
import { doc, getDoc, updateDoc, deleteDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

import { MaterialCommunityIcons } from '@expo/vector-icons';

/* CUSTOM COMPONENT IMPORTS} */
import AppTextInput from '../components/AppTextInput';
import Buttons from '../components/Buttons';
import colors from '../config/colors';
import DeleteItemAction from '../components/DeleteItemAction';
import EditItemAction from '../components/EditItemAction';
import EmptyListNotification from '../components/EmptyListNotification';
import Header from '../components/Header';
import ItemSeparator from '../components/ItemSeparator';
import ListComponent from '../components/ListComponent';
import Loading from '../components/Loading';
import Screen from '../components/Screen';

function RepliesScreen(props) {
    const selectedMessage = useLocalSearchParams();
    const updateMessage = doc(FIREBASE_DB, "messages", selectedMessage.id);
    const router = useRouter();
    const inputRef = useRef();
    const id = new Date().valueOf(); /* Create id for new reply */

    const [replies, setReplies] = useState([]);
    const [message, setMessage] = useState(selectedMessage);
    const [replyValue, setReplyValue] = useState();
    const [loadReplies, setLoadReplies] = useState(false);
    const [replyIndex, setReplyIndex] = useState("");
    const [editReply, setEditReply] = useState(false);

    /* 
        DOC: FUNCTION FOR HANDLING DELETE REPLIES ARRAY
        SOURCE: https://firebase.google.com/docs/firestore/manage-data/add-data#update_elements_in_an_array
    */
    const addReplies = async() => {
        if(replyValue.length){
            if(editReply){
                const messageReply = doc(FIREBASE_DB, "messages", selectedMessage.id); /* Get all replies from firebase database */
                const getAllReplies = await getDoc(messageReply);

                repliesArray = getAllReplies.data().replies; /* Contain database to an array  */
                repliesArray[replyIndex].message = replyValue; /* Select data from array via index and set new data for message  */

                /* Update array replies on firebase database */
                await updateDoc(messageReply, {
                    replies: repliesArray
                });

                setEditReply(false);
            }else{
                console.log("add");
                await updateDoc(updateMessage, {
                    replies: arrayUnion(
                        {
                            id: id,
                            image: require("../assets/user.jpg"),
                            message: replyValue,
                            name: selectedMessage.name,
                            replies: [],
                        }
                    )
                });
            }
            
            setReplyValue("");
            getReplies();
        } else {
            console.log("Error field");
        }
    };

    /*
        DOC: FUNCTION FOR DELETING REPLIES FROM FIREBASE DATABASE
    */
    const handleDeleteReplies = async (reply) => {
        await updateDoc(updateMessage, {
            replies: arrayRemove(reply)
        });

        getReplies();
    }

    /*
        DOC: FUNCTION TO EDIT USER REPLIES
    */
    const editReplies = async (item, index)=> {
        setReplyIndex(index);
        setEditReply(true);
        setReplyValue(item.message);
        handleFocus();
    }

    /*
        DOC: FUNCTION FOR LOAD REPLIES FROM FIRESTRORE DATABASE
    */
    const getReplies = async ()=> {
        setLoadReplies(true);

        const docRef = doc(FIREBASE_DB, "messages", selectedMessage.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // console.log("Document data:", docSnap.data());
            setLoadReplies(false);
            setReplies(docSnap.data().replies);
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
        } 
    };
 
    const handleFocus = ()=> {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    useEffect(()=>{
        getReplies(); 
        setLoadReplies(true);
    }, []);
    return (
        <Screen>
            <View style={{flex: 1}}>
                <Header profile={false} route="/messages"/>
                <GestureHandlerRootView style={{flexDirection: "column", marginTop: 10}}>
                    <ListComponent
                        id={message.id}
                        name={message.name}
                        image={message.image}
                        message={message.message}
                        renderRightActions={()=> 
                            <View style={{flexDirection: "row"}}>
                                <EditItemAction onPress={() => editMessageItem(selectedMessage)}/>
                                <DeleteItemAction messageItem={selectedMessage}/>
                            </View>
                        }
                    />
                    <View style={{paddingLeft: 60, paddingBottom: 180, height: "100%"}}>
                        {
                            (loadReplies)
                                ? 
                                    <Loading text="Loading Replies"/>
                                :
                                    (replies.length) 
                                        ? 
                                            <FlatList 
                                                data={replies} 
                                                keyExtractor={reply => reply.id.toString()}
                                                renderItem={({item, index}) => 
                                                    <ListComponent
                                                        id={item.id}
                                                        image={item.image}
                                                        message={item.message} 
                                                        name={item.name} 
                                                        renderRightActions={()=> 
                                                            <View style={{flexDirection: "row"}}>
                                                                <EditItemAction onPress={() => editReplies(item, index)}/>
                                                                <DeleteItemAction onCallLoadMessages={getReplies} isReply={true} replyItem={item} messageItem={selectedMessage}/>
                                                            </View>
                                                        }
                                                        ItemSeparatorComponent={()=> 
                                                            <ItemSeparator/>
                                                        }
                                                        itemIndex={index}
                                                    />
                                                } 
                                            />
                                        :   <EmptyListNotification style={{alignItems: "flex-start", paddingTop: 0}} title="No Replies" message="New replies will appear here."/>
                        }
                    </View>
                </GestureHandlerRootView>
            </View>

            <View style={{
                backgroundColor: colors.white,
                paddingBottom: 10,
                position: "relative",
            }}>
                <AppTextInput 
                    autoFocus={true} 
                    color={colors.separator}
                    onChangeText={(reply)=> setReplyValue(reply)} 
                    placeholder={"Enter Reply"} 
                    value={replyValue} 
                    ref={inputRef}
                />
                <Buttons 
                    disabled={replyValue ? false : true}
                    height={24} 
                    iconName="send" 
                    onPress={()=> addReplies()} 
                    style={{position: "absolute", top: -50, right: 20}} 
                    width={24} 
                />
            </View>
        </Screen>
    );
}

export default RepliesScreen;