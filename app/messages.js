import React, { useEffect, useRef, useState } from 'react';
import { FlatList, View} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

/*EXPO IMPORTS*/
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';

/* FIREBASE IMPORTS */
import { FIREBASE_AUTH, FIREBASE_DB} from '../firebaseconfig';
import { collection, addDoc, getDocs, query, deleteDoc, doc, updateDoc } from "firebase/firestore"; 

/* CUSTOM COMPONENTS IMPORTS */
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

function MessagesScreen(props) {
    const router = useRouter();
    const [createMessage, setCreateMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [editMessage, setEditMessage] = useState(false);
    const [messageId, setMessageId] = useState(false);
    const [loading, setLoading] = useState(true);

    const auth = getAuth();
    const user_name = auth.currentUser.displayName;

    const inputRef = useRef(null);

    /*
        DOCU: FUNCTION ON LOADING MESSAGES FROM FIREBASE DATABASE
        SOURCE: https://firebase.google.com/docs/firestore/query-data/get-data
    */
    const loadMessages = async ()=> {
        setLoading(true);
        const messageContainer = [];
        const querySnapshot = await getDocs(query(collection(FIREBASE_DB, "messages")));

        querySnapshot.forEach((doc) => {
            messageContainer.push({
                ...doc.data(),
                id: doc.id
            });
        });
 
        setMessageList(messageContainer);
        setLoading(false);
    };

    /*
        DOCU: FUNCTION TO ADD AND EDIT MESSAGES
        SOURCE: https://firebase.google.com/docs/firestore/manage-data/add-data
    */
    const addMessage = async ()=> {
        if(createMessage.length){
            if(editMessage){
                const updateMessage = doc(FIREBASE_DB, "messages", messageId.toString());

                await updateDoc(updateMessage, {
                    message: createMessage
                });

                setEditMessage(false);
            }else{
                try {
                    const docRef = await addDoc(collection(FIREBASE_DB, "messages"), {
                        image: require("../assets/user.jpg"),
                        message: createMessage,
                        name: user_name,  
                        replies: [],
                    });
    
                    console.log("Document written with ID: ", docRef.id);
                } catch (e) {
                    console.error("Error adding document: ", e);
                }
            }

            setCreateMessage("");
            loadMessages();
        }else{
            //Add input error handling here
            console.log("Error"); 
        }
    }

    /*
        DOCU: FUNCTION TO SET STATE FOR EDITING MESSAGES
    */
    const editMessageItem = async (message)=> {
        setMessageId(message.id);
        setCreateMessage(message.message);
        setEditMessage(true);
        handleFocus();
    }

    const handleFocus = ()=> {
        if(inputRef.current){
            inputRef.current.focus();
        }
    };

    useEffect(()=> {
        loadMessages(); 
        setLoading(true);
    }, []); 

    return (
        <Screen>
            <View style={{flex: 1, flexDirection: "column", justifyContent: "space-between"}}>
                <Header profile={true} title="Messages"/>
                <GestureHandlerRootView>
                    {
                        (loading) 
                            ?
                                <Loading text="Loading Messages"/>
                            :
                                (messageList.length)
                                    ?
                                        <FlatList 
                                            data={messageList}
                                            keyExtractor={item => item.id} 
                                            renderItem={({item, index}) => 
                                                <ListComponent
                                                    id={item.id}
                                                    name={item.name}
                                                    image={item.image}
                                                    message={item.message}
                                                    itemIndex={index}
                                                    onPress={()=> router.push({pathname: "/replies", params: item})}
                                                    renderRightActions={()=> 
                                                        <View style={{flexDirection: "row"}}>
                                                            <EditItemAction onPress={() => editMessageItem(item)}/>
                                                            <DeleteItemAction onCallLoadMessages={loadMessages} messageItem={item}/>
                                                        </View>
                                                    }
                                                />
                                            }
                                            ItemSeparatorComponent={()=>  
                                                <ItemSeparator/>
                                            }
                                        />
                                    : <EmptyListNotification title="No messages" message="New messages will appear here."/>
                    }
               
                </GestureHandlerRootView>
            </View>
            
            <View style={{
                position: "relative"
            }}>
                <AppTextInput 
                    autoFocus={true} 
                    color={colors.separator}
                    onChangeText={(message)=> setCreateMessage(message)} 
                    placeholder={"Enter Message"} 
                    value={createMessage}
                    ref={inputRef}
                />
                <Buttons 
                    disabled={(createMessage.length) ? false : true}
                    height={24} 
                    iconName="send"
                    onPress={()=> addMessage()} 
                    style={{position: "absolute", top: -50, right: 20}} 
                    width={24} 
                />
            </View>
        </Screen>
    );
}

export default MessagesScreen;