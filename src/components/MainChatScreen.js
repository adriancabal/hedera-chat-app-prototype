import { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from "../redux/userSlice";
import SideBar from './MainScreen/SideBar';
import '../App.css';
import AppContext from "../AppContext";
import { Client, TopicMessageSubmitTransaction} from "@hashgraph/sdk";
import {Buffer} from "buffer";
import socketIOClient from "socket.io-client";
import { logoutUser, } from '../helper/MessageMaker';
import MainWindow from './MainScreen/MainWindow';
import { CHAT_SERVER_ENDPOINT, MessageType } from "../constants";

// import { dmChannelMap, userMap } from "../data"

// const hederaContractId = process.env.REACT_APP_HEDERA_CHAT_CONTRACT_ID;

const MainChatScreen = (props) => {
    // const dispatch = useDispatch();
    const {currentUser, setCurrentUser, hederaClient, dmChannelList, dataSocket, setUserDms, myMessages, setMyMessages, chatSocket } = useContext(AppContext);
    // const currentUser = "user1";
    // const { currentUser, setCurrentUser, hederaClient, userMap, dmChannelMap} = useContext(AppContext);
    // const currentUser = useSelector((state) => state.user.currentUser);
    // const hederaClient = useSelector((state) => state.user.hederaClient);
    // const socket = useSelector((state) => state.user.socket);
    const [mainWindow, setMainWindow] = useState("all");
    const [currentDmUser, setCurrentDmUser] = useState(null);
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
        const myAccountId = process.env.REACT_APP_MY_ACCOUNT_ID;
        const myPrivateKey = process.env.REACT_APP_MY_PRIVATE_KEY;
        if (myAccountId == null ||
            myPrivateKey == null ) {
            throw new Error("Environment variables myAccountId and myPrivateKey must be present");
        }
    
        // Establish client connection
        const hederaClient = Client.forTestnet();
        hederaClient.setOperator(myAccountId, myPrivateKey);
        // if(currentUser && userMap[currentUser]){
        //     userMap[currentUser].dms.forEach(dm => {
        //         myMessages[dm[1]] = {
        //             type: MessageType.DM,
        //             msgMap: {
        //                 0: {
        //                     msg: `Beginning of your chat history with ${dm[0]}...`,
        //                     type: 1,
        //                 },
        //             },
        //             msgList: [0],
        //         };
        //     });
        // }
       
        // move to app.js
        // const socket = socketIOClient(CHAT_SERVER_ENDPOINT, 
        //     {
        //     withCredentials: true, 
        //     extraHeaders: {
        //       "hedera-chat-message": "abcd",
        //     }
        //   }
        // );
        
        // setChatSocket(socket);
        // socket.once("get_init_msg_load_response", msgLoad => {
        //     console.log("get_init_msg_load_response: ", msgLoad);
        //     setMyMessages(msgLoad);
        // });
        // const initialMsgLoadData = {
        //     user: currentUser,
        //     channels: dmChannelList,
        // };
        // console.log("emit: get_init_msg_load: ", initialMsgLoadData);
        // socket.emit("get_init_msg_load", initialMsgLoadData);

        

        // socket.on("ChatMessages", message => {
        //     console.log("on chatMessages...");
        //     // console.log("messageTimestamp: ", message.consensusTimestamp.seconds.low);
        //     const messageAsString = Buffer.from(message.contents, "utf8").toString();
        //     // const _myMessages= [...myMessages];
        //     // _myMessages.push(messageAsString);
        //     // setMyMessages(_myMessages);
        //     // console.log("myMessages: ", myMessages);
        //     chatMessageController(messageAsString);
        // });

        chatSocket.on("receive_message", message => {
            console.log("on chatMessages...");
            // console.log("messageTimestamp: ", message.consensusTimestamp.seconds.low);
            chatMessageController(message);
        });




    }, []);

    const chatMessageController = (message) => {
        
        // const consensusTimestamp = message.consensusTimestamp.seconds.low * 1000;
        // console.log("ChatMessage: ", myMessages);
        
        // const msgTimestampMs = message.consensusTimestamp.toDate().getTime();
        const msgObj = JSON.parse(message);
        const msgType = msgObj.type;
        const sender = msgObj.sender;
        const channel = msgObj.channel;
        const index = msgObj.index;
        const msg = msgObj.message;
        const timestamp = msgObj.timestamp;
        console.log("chatMessage: ", message);
        // console.log("messageSentTimestamp: ", new Date(timestamp));

        if(msgType === MessageType.DM){
            // const dmChannelUsers = dmChannelMap[channel].users;
            // console.log("dmChannelUsers: ", dmChannelUsers);
            // if(dmChannelUsers[0] === currentUser || dmChannelUsers[1] === currentUser){
            console.log("ChatController: myMessages: ", myMessages);
            let _myMessages = {...myMessages};
            console.log("ChatController: _myMessages: ", _myMessages);
            // if channel exists but message index doesn't exist
            if(_myMessages[channel] && !_myMessages[channel].msgMap[index]){
                console.log("chatController: channel exists but message index doesn't exist");
                // let _myMessages = {...myMessages};
                _myMessages[channel].msgMap[index] = {
                    timestamp: timestamp,
                    msg: msg,
                    sender: sender,
                }
                _myMessages[channel].msgList.unshift(index);
                _myMessages[channel].unread += 1;
                console.log("_myMessagesAfterAddIndex: " , _myMessages);
                setMyMessages(_myMessages);
            }
            // if channel doesn't yet exist
            else if(!_myMessages[channel]){
                console.log(`chatController:channel doesn't yet exist: ${channel}`);
                // get updated dmUsers
                dataSocket.emit("getDmUsers", currentUser);
                dataSocket.once("getDMUsers_response", response => {
                    console.log("MainChatScreen: getDMUsers_response: ", response);
                    setUserDms(response);
                    _myMessages[channel] = {
                        msgMap: {},
                        msgList: [],
                        unread: 1,
                    };
                    _myMessages[channel].msgMap[index] = {
                        timestamp: timestamp,
                        msg: msg,
                        sender: sender,
                    };
                    _myMessages[channel].msgList.unshift(index);
                    setMyMessages(_myMessages);
                });
                // _myMessages[channel] = {
                //     msgMap: {},
                //     msgList: [],
                //     unread: 1,
                // };
                // _myMessages[channel].msgMap[index] = {
                //     timestamp: timestamp,
                //     msg: msg,
                //     sender: sender,
                // };
                // _myMessages[channel].msgList.unshift(index);
                // setMyMessages(_myMessages);
            }
        }
        else if(msgType === MessageType.GROUP){

        }
        console.log("myMessages: ", myMessages);
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
                <SideBar setMainWindow={setMainWindow} setCurrentDmUser={setCurrentDmUser} />
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