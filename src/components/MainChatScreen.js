import { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from "../redux/userSlice";
import SideBar from './MainScreen/SideBar';
import '../App.css';
import AppContext from "../AppContext";
import { Client, TopicMessageSubmitTransaction} from "@hashgraph/sdk";
// import socketIOClient from "socket.io-client";
import io from "socket.io-client";
import { logoutUser, } from '../helper/MessageMaker';
import MainWindow from './MainScreen/MainWindow';
import { MessageType } from "../constants";
// const CHAT_SERVER_ENDPOINT = "http://localhost:443";
const CHAT_SERVER_ENDPOINT = "https://arcane-beach-52537.herokuapp.com/";
// import { dmChannelMap, userMap } from "../data"

// const hederaContractId = process.env.REACT_APP_HEDERA_CHAT_CONTRACT_ID;
let dmUserSelected = null;
let currentUserDms = [];
let currentUnreadMsgs = {};
const MainChatScreen = (props) => {
    // const dispatch = useDispatch();
    const {currentUser, setCurrentUser, hederaClient, dataSocket, userDms, setUserDms, myMessages, setMyMessages, chatSocket, setChatSocket} = useContext(AppContext);
    const {currentDmMessages, setCurrentDmMessages, typingStatus, setTypingStatus, unreadMsgs, setUnreadMsgs, currentDmUser, setCurrentDmUser} = useContext(AppContext);
    // const currentUser = "user1";
    // const { currentUser, setCurrentUser, hederaClient, userMap, dmChannelMap} = useContext(AppContext);
    // const currentUser = useSelector((state) => state.user.currentUser);
    // const hederaClient = useSelector((state) => state.user.hederaClient);
    // const socket = useSelector((state) => state.user.socket);
    const [mainWindow, setMainWindow] = useState("all");
    // const [currentDmUser, setCurrentDmUser] = useState(null);
    // const [myMessages, setMyMessages] = useState({});
    // const [myMessages, setMyMessages] = useState([]);
    // const [chatSocket, setChatSocket] = useState(null);
    const chatScreenColor = "bg-[#292a33]";

    const onClickLogout = async () => {
        // const logoutSuccessful = sendDataTopicMessage(hederaClient,logoutUser(currentUser));
        let sendResponse = await new TopicMessageSubmitTransaction({
            topicId: "0.0.34717180",
            message: logoutUser(currentUser),
        })
        .execute(hederaClient);
        const getReceipt = await sendResponse.getReceipt(hederaClient);
        console.log("receiptStatus: " + getReceipt.status);
        const logoutSuccessful = getReceipt.status._code === 22 ;
        console.log("logoutSuccessful: ", logoutSuccessful);
        if(logoutSuccessful){
            setCurrentUser("");
            // dispatch(setUser(""));
        }
    }

    useEffect(() => { 
        dmUserSelected = currentDmUser;
    }, [currentDmUser]);

    useEffect(() => { 
        currentUserDms = userDms;
    }, [userDms]);

    useEffect(() => { 
        currentUnreadMsgs = unreadMsgs;
    }, [unreadMsgs]);
    

    useEffect(() => { 
        const myAccountId = process.env.REACT_APP_MY_ACCOUNT_ID;
        const myPrivateKey = process.env.REACT_APP_MY_PRIVATE_KEY;
        if (myAccountId == null ||
            myPrivateKey == null ) {
            throw new Error("Environment variables myAccountId and myPrivateKey must be present");
        }
    
        // Establish client connection
        const hederaClient = Client.forTestnet();
        hederaClient.setOperator(myAccountId, myPrivateKey);
       
        // io
        const _chatSocket = io(CHAT_SERVER_ENDPOINT, 
            {transports: ['websocket', 'polling', 'flashsocket']}
        );

        // socketIOClient
        // const _chatSocket = socketIOClient(CHAT_SERVER_ENDPOINT, 
        //     {
        //     withCredentials: true, 
        //     extraHeaders: {
        //       "hedera-chat-message": "abcd",
        //     }
        //   }
        // );

        _chatSocket.emit("join_chat_room", currentUser);
        
        setChatSocket(_chatSocket);

        _chatSocket.on("receive_message", message => {
            console.log("on chatMessages...");
            // console.log("messageTimestamp: ", message.consensusTimestamp.seconds.low);
            chatMessageController(message);
        });

        _chatSocket.on("receive_typing_event", data => {
            console.log("receive_typing_event");
            let _typingStatus = {...typingStatus};
            const userNames = currentUserDms.map(userObj => userObj.user);
            console.log("typing_usernames: ", userNames);
            if(userNames.includes(data.sender)){
                console.log("includes_typing_usernames");
                _typingStatus[data.sender] = data.isTyping;
                console.log("_typingStatus: ", _typingStatus);
                setTypingStatus(_typingStatus);
            };
        });

    }, []);

    const chatMessageController = (message) => {
        console.log("chatMessageController");
        // const consensusTimestamp = message.consensusTimestamp.seconds.low * 1000;
        // console.log("ChatMessage: ", myMessages);
       

        // const msgTimestampMs = message.consensusTimestamp.toDate().getTime();
        const msgObj = JSON.parse(message);
        // const isTypingEvent = msgObj.typingEvent;
        const msgType = msgObj.type;
        const sender = msgObj.sender;
        const channel = msgObj.channel;
        const index = msgObj.index;
        const msg = msgObj.message;
        const timestamp = msgObj.timestamp;
        console.log("chatMessage: ", message);
        // console.log("messageSentTimestamp: ", new Date(timestamp));
        // if(isTypingEvent){
        //     console.log("receive_typing_event: ", msgObj);
        //     let _typingStatus = {...typingStatus};
        //     const userNames = currentUserDms.map(userObj => userObj.user);
        //     console.log("typing_usernames: ", userNames);
        //     if(userNames.includes(msgObj.sender)){
        //         console.log("includes_typing_usernames");
        //         _typingStatus[msgObj.sender] = msgObj.isTyping;
        //         console.log("_typingStatus: ", _typingStatus);
        //         setTypingStatus(_typingStatus);
        //     };
        // }
        if(msgType === MessageType.DM){
            console.log("channel: " + channel);
            console.log("currentDmUser: ", dmUserSelected);
            console.log("currentDmUser.channel: " + channel + ", " + dmUserSelected.channel) ;
            if(channel === dmUserSelected.channel){
                let _currentDmMsgs = [...currentDmMessages];
                _currentDmMsgs.push({
                    channel: channel,
                    index: index,
                    msg:msg,
                    sender: sender,
                    timestamp: timestamp,
                });
                console.log("chat-message-push-current: ", _currentDmMsgs );
                setCurrentDmMessages(_currentDmMsgs);
            }else {
                let _userDms = [...currentUserDms];
                console.log("chatSocket: currentUserDms: ", _userDms);
                let _userDmUsers = _userDms.map(userDm => userDm.user);
                if(!_userDmUsers.includes(sender)){
                    console.log("chatSocket: newUserDm");
                    _userDms.push({
                        user: sender,
                        channel: channel,
                        isLoggedIn: true,
                    });
                    console.log("chatSocket: setUserDms: ", _userDms);
                    setUserDms(_userDms);
                }
                let _unreadMsgs = {...currentUnreadMsgs};
                if(!_unreadMsgs[channel]){
                    _unreadMsgs[channel] = 1;
                }
                else {
                    _unreadMsgs[channel] += 1;
                }
                setUnreadMsgs(_unreadMsgs);
            }
            // const dmChannelUsers = dmChannelMap[channel].users;
            // console.log("dmChannelUsers: ", dmChannelUsers);
            // if(dmChannelUsers[0] === currentUser || dmChannelUsers[1] === currentUser){
            // console.log("ChatController: myMessages: ", myMessages);
            // let _myMessages = {...myMessages};
            // console.log("ChatController: _myMessages: ", _myMessages);
            // if channel exists but message index doesn't exist
            // if(_myMessages[channel] && !_myMessages[channel].msgMap[index]){
            //     console.log("chatController: channel exists but message index doesn't exist");
            //     // let _myMessages = {...myMessages};
            //     _myMessages[channel].msgMap[index] = {
            //         timestamp: timestamp,
            //         msg: msg,
            //         sender: sender,
            //     }
            //     _myMessages[channel].msgList.unshift(index);
            //     _myMessages[channel].unread += 1;
            //     console.log("_myMessagesAfterAddIndex: " , _myMessages);
            //     setMyMessages(_myMessages);
            // }
            // if channel doesn't yet exist
            // else if(!_myMessages[channel]){
            //     console.log(`chatController:channel doesn't yet exist: ${channel}`);
            //     // get updated dmUsers
                
            //     const _userDms = [...userDms];
            //     _userDms.push({
            //         channel: channel,
            //         user: sender,
            //         isLoggedIn: true,
            //     });

            //     _myMessages[channel] = {
            //         msgMap: {},
            //         msgList: [],
            //         unread: 1,
            //     };

            //     _myMessages[channel].msgMap[index] = {
            //         timestamp: timestamp,
            //         msg: msg,
            //         sender: sender,
            //     };
            //     _myMessages[channel].msgList.unshift(index);
            //     setUserDms(_userDms);
            //     setMyMessages(_myMessages);

            // }
        }
        else if(msgType === MessageType.GROUP){

        }
        
        // console.log("myMessages: ", myMessages);
    }

    
    return(
        <div className={`flex flex-col h-full w-[1000px] rounded-lg ${chatScreenColor}`}>
           
            <div className={`flex flex-row  h-[8%] w-[1000px] rounded-md`}>
                {/* Logout */}
                <div className={`flex flex-row w-1/5 justify-center`}>
                    <button 
                        className='text-lg font-bold text-[#f23f69] '
                        onClick={() => {onClickLogout()}}
                    >
                        {"Logout"}
                    </button>
                </div>

                {/* User online */}
                <div className='flex flex-row w-4/5 justify-center'>
                    <p className='text-lg text-[#3ff281] self-center'>
                        <span className='font-bold'>{`${currentUser}`}</span>
                        {` - is logged in`}
                    </p>
                </div>
            </div>

            {/* Main View */}
            <div className={`flex flex-row  h-[92%] w-[1000px]`}>
                {/* Scoll sidebar */}
                <SideBar setMainWindow={setMainWindow} />
                {/* <SideBar setMainWindow={setMainWindow} setCurrentDmUser={setCurrentDmUser} myMessages={myMessages}/> */}

                {/* Main Window */}
                <MainWindow 
                    mainWindow={mainWindow} 
                    setMainWindow={setMainWindow} 
                    currentDmUser={currentDmUser}
                    setCurrentDmUser={setCurrentDmUser}
                    myMessages={myMessages}
                    setMyMessages={setMyMessages}
                    chatSocket={chatSocket}
                />
            </div>
        </div>
    )
}

export default MainChatScreen;