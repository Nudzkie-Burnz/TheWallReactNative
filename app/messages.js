import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Keyboard, KeyboardAvoidingView, View} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

/*EXPO IMPORTS*/
import { useRouter } from 'expo-router';

/* CUSTOM COMPONENTS IMPORTS */
import DeleteItemAction from '../components/DeleteItemAction';
import EditItemAction from '../components/EditItemAction';
import EmptyListNotification from '../components/EmptyListNotification';
import Header from '../components/Header';
import ItemSeparator from '../components/ItemSeparator';
import ListComponent from '../components/ListComponent';
import Loading from '../components/Loading';
import Screen from '../components/Screen';
import AppInputSubmit from '../components/AppInputSubmit';
import colors from '../config/colors';

// Hooks 
import { getMessages, setMessage, updateMessage } from '../hooks/useMessages';
import { getUser } from '../hooks/useAuth';

function MessagesScreen(props) {
    const router = useRouter();
    const [createMessage, setCreateMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [messageId, setMessageId] = useState(null);
    const [messageList, setMessageList] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [userId , setUserId] = useState(getUser());
    const inputRef = useRef(null);
    const messageRef = useRef(null);

    /*
        DOCU: FUNCTION ON LOADING MESSAGES FROM FIREBASE DATABASE
        SOURCE: https://firebase.google.com/docs/firestore/query-data/get-data
    */
    const loadMessages = async ()=> {
        let { result, status} = await getMessages(); // LoadMessages from useMessages hook

        setMessageList(result);
        setLoading(!status); 
    };

    /*
        DOCU: FUNCTION TO ADD AND EDIT MESSAGES
        SOURCE: https://firebase.google.com/docs/firestore/manage-data/add-data
    */
    const addMessage = async ()=> {
        if(createMessage.length && messageId !== null){
            await updateMessage(messageId.toString(), createMessage, null);
        }else{
            await setMessage(createMessage);
            setMessageId(null);
        };

        setLoading(true);
        loadMessages();
        setCreateMessage("");
        Keyboard.dismiss();
    };

    /*
        DOCU: FUNCTION TO SET STATE FOR EDITING MESSAGES
    */
    const editMessageItem = async (message)=> {
        setMessageId(message.id);
        setCreateMessage(message.message);
        handleFocus();
    };

    const handleFocus = ()=> {
        inputRef.current && inputRef.current.focus();
    };

    useEffect(()=> {
        setUserId(getUser());
        loadMessages(); 
        setLoading(true); 
    }, []); 

    return (
        <Screen>
            <View style={{flex: 1, flexDirection: "column", justifyContent: "space-between"}}>
                <Header profile={true} title="Messages"/>
                <GestureHandlerRootView testID="Message Container">
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
                                            ref={messageRef}
                                            renderItem={({item, index}) => 
                                                <ListComponent
                                                    userId={item.userId}
                                                    id={item.id}
                                                    image={item.image}
                                                    itemIndex={index}
                                                    message={item.message}
                                                    name={item.name}
                                                    repliesCount={item.replies.length}
                                                    seeMore={true}
                                                    onPress={()=> router.push({pathname: "/replies", params: item})}
                                                    renderRightActions={()=> 
                                                        (item.userId === userId.uid) &&
                                                        <View style={{flexDirection: "row", alignItems: "center"}}>
                                                            <EditItemAction onPress={() => editMessageItem(item)}/>
                                                            <DeleteItemAction onCallLoadMessages={loadMessages} isLoading={setLoading} messageItem={item}/>
                                                        </View>
                                                    }
                                                />
                                            }
                                            ItemSeparatorComponent={()=>  
                                                <ItemSeparator/>
                                            }
                                            refreshing={refreshing}
                                            onRefresh={()=>{
                                                loadMessages();
                                            }}
                                        />
                                    : <EmptyListNotification title="No messages" message="New messages will appear here."/>
                    }
                </GestureHandlerRootView>
            </View>
            <AppInputSubmit
                autoCapitalize={true}
                autoFocus={true}
                buttonHeight={24}
                buttonWidth={24}
                iconName="send"
                onChangeText={(message)=> setCreateMessage(message)}
                onPress={()=> addMessage()}
                placeholder="Enter Message"
                ref={inputRef}
                value={createMessage}
                placeholderTextColor={colors.white}
                disabled={(createMessage.length) ? false : true}
                onBlur={()=> {setCreateMessage(""), setMessageId(null)}}
            />
        </Screen>
    );
}

export default MessagesScreen;