import { useState, useContext, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CircleIcon from '@mui/icons-material/Circle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Lottie from "lottie-react";
// import loadingAnimation from "../../../animations/loading.json";
import dotsLoadingAnimation from "../../../animations/3-dots-loading.json";
import AppContext from "../../../AppContext";
// import { userMap, dmChannelList, dmChannelMap, setChannelIndex } from '../../../data';
import { TopicMessageSubmitTransaction} from "@hashgraph/sdk";
import { newDm, sendDM } from '../../../helper/MessageMaker';

// import { channelIndex, deletedChannelList } from '../../../data';
import { MessageType } from '../../../constants';
// import { setDmChannelList, setDmChannelMap } from '../../../redux/channelsSlice';
// import { setUserMap } from '../../../redux/usersSlice';
// import { set } from 'immer/dist/internal';
const DATA_TOPIC_ID = process.env.REACT_APP_HEDERA_DATA_TOPIC_ID;
const MESSAGE_TOPIC_ID = process.env.REACT_APP_HEDERA_MESSAGE_TOPIC_ID;

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var lastTypedTimestamp = 0;
var isMeTyping = false;
var WINDOW_WIDTH = window.innerWidth;
var WINDOW_HEIGHT = window.innerHeight;
const ChatWindow = (props) => {
    const { currentUser, hederaClient, myMessages, typingStatus, chatSocket, currentDmMessages, currentDmUser: dmUser, resetCurrentDmMessages } = useContext(AppContext);
    // const currentUser = useSelector((state) => state.user.currentUser);
    // const hederaClient = useSelector((state) => state.user.hederaClient);
    const { dataSocket, userDms, setUserDms, setCurrentDmUser, gunDb} = useContext(AppContext);
    // const dmUser = props.currentDmUser;
    const setMainWindow = props.setMainWindow;
    const [messageInputValue, setMessageInputValue] = useState("");
    const [dmChannelMessagesMap, setDmChannelMessagesMap] = useState({});
    const [dmChannelMsgIndexes, setDmChannelMsgIndexes] = useState([]);
    const [isCursorTextbox, setIsCursorTextbox] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const messageInputBox = useRef(null);
    const [selectedFiles , setSelectedFiles] = useState([]);
    const hiddenFileInput = useRef(null); 

    useEffect(() => {
        console.log("ChatWindow useeffect - dmUser: " + dmUser.user);
        // sendChatTopicMessage(JSON.stringify({type: 9}));
        resetCurrentDmMessages();
        resetDmUserUnread();
        chatSocket.emit("get_dm_channel_messages", {channel: dmUser.channel, user: currentUser});
        chatSocket.on("getDmChannelMessagesResponse", dmMessagesMapResponse => {
            console.log("getDmChannelMessagesResponse: ", dmMessagesMapResponse);
            const dmMsgIndexes = Object.keys(dmMessagesMapResponse).reverse();
            setDmChannelMessagesMap(dmMessagesMapResponse);
            setDmChannelMsgIndexes(dmMsgIndexes);
            setIsLoading(false);
            // dataSocket.removeAllListeners("getDMUsers_response");
        });




        
    }, [dmUser]);

    useEffect(() => {
        console.log("ChatWindow - currentDmMessages changed: ", currentDmMessages);
        
        if(currentDmMessages.length > 0){
            
            let _dmChannelMessagesMap = {...dmChannelMessagesMap};
            let _dmChannelMsgIndexes = [...dmChannelMsgIndexes];
            for(let i=0; i < currentDmMessages.length; i++){
                const newMsg = currentDmMessages[i];
                if(!_dmChannelMessagesMap[newMsg.index]){
                    _dmChannelMessagesMap[newMsg.index] = {
                        msg: newMsg.msg,
                        sender: newMsg.sender,
                        timestamp: newMsg.timestamp
                    };
                    _dmChannelMsgIndexes.unshift(newMsg.index);
                    setDmChannelMessagesMap(_dmChannelMessagesMap);
                    setDmChannelMsgIndexes(_dmChannelMsgIndexes);
                    resetDmUserUnread();
                }
            }
        }
        
    }, [currentDmMessages]);

    useEffect(() => {
        console.log("ChatWindowTypingStatus: ", JSON.stringify(typingStatus) + ", " + typingStatus[dmUser.user]);
        
        // console.log("ChatWindowTypingStatus: ", typingStatus[dmUser]);
        console.log(`ChatWindowSetIsTyping: ${typingStatus[dmUser.user]}`);
        setIsTyping(!!typingStatus[dmUser.user]);
        
    }, [typingStatus]);


    console.log("ChatWindow class function");

    if(dmChannelMsgIndexes.length && dmChannelMsgIndexes[dmChannelMsgIndexes.length -1] !== 0){
        let _dmChannelMsgIndexes = [...dmChannelMsgIndexes];
        _dmChannelMsgIndexes.push(0);
        setDmChannelMsgIndexes(_dmChannelMsgIndexes);
    }
    // const myMessages = props.myMessages;
    // const setMyMessages = props.setMyMessages;
    
    // const chatSocket = props.chatSocket; // move to context
    // const [users, setUsers] = useState(userMap);
    // const [_myMessages, setMyMessages] = useState(myMessages);
    console.log("ChatWindow: myMessages: ", myMessages);

    



    // users[currentUser].dms.forEach(dm => {
    //     if(dm[0] === dmUser){
    //         return dm[1];
    //     }
    // }) || -1;
    // const myDmChannel = getDmChannel();
    // console.log("myDmChannel: ", myDmChannel);
    const dmMsgMap =  myMessages[dmUser.channel] ? myMessages[dmUser.channel].msgMap : {};
    const messages = dmUser && dmUser.channel > 0 && myMessages && myMessages[dmUser.channel] ? myMessages[dmUser.channel].msgList : [];
    if(messages.length && messages[messages.length -1] !== 0){
        messages.push(0);
    }
    
    console.log("messages: ", messages);
    // const messages = messagesMock;
    // const dmUsers = userMap[currentUser].dms.map(dm => dm[0]);
    console.log("userDms: ", userDms);
    console.log("dmUser: ", dmUser);
    const dmUserProfile = userDms.length > 0 
        ? userDms.filter(dm => dm.user === dmUser.user) 
        : [];
    console.log("dmUserProfile: ", dmUserProfile);

    const statusIconColor = dmUser && dmUser.isLoggedIn ? "text-[green]" : "text-[gray]";
    // const statusIconColor = dmUserProfile.length > 0 && dmUserProfile[0].isLoggedIn ? "text-[green]" : "text-[gray]";
    const sendButtonHoverCursor = messageInputValue ? "hover:cursor-pointer" : "";
    const sendButtonBgColor = messageInputValue ? "hover:text-[#6ce6a1]" : "";


    const onClickSend = async () => {
        console.log("onClickSend");
        if(messageInputValue){

            // create a dm channel if it doesn't exist (if there is no message history)
            // if(!dmUsers.includes(dmUser)){
            if(dmUserProfile.length === 0){
                console.log("dmuser doesn't yet exist");
                dataSocket.emit("getDeletedChannels");
                dataSocket.once("getDeletedChannels_response", async (response) => {
                    // dataSocket.removeAllListeners("getDeletedChannels_response");
                    console.log("getDeletedChannels_response: ", response);
                    const deletedChannelList = response.deletedChannelList;
                    const channelIndex = response.channelIndex;
                    //  create new dm channel
                    const newChannel = deletedChannelList.length > 0 ? deletedChannelList[0] : channelIndex + 1;
                    // const isSuccess = await sendDataTopicMessage(newDm(newChannel, currentUser, dmUser.user));
                    dataSocket.emit("createDmAvailable");
                    dataSocket.once("createDmAvailable_response", async (response) => {
                        if(response === true) {
                            const isSuccess = await sendDataTopicMessage(newDm(newChannel, currentUser, dmUser.user));
                            // const isSuccess = true;
                            if(isSuccess){
                                
                                
                                // send DM message
                                let _dmChannelMessagesMap = {...dmChannelMessagesMap};
                                let _dmChannelMsgIndexes = [0];
                                const timestamp = new Date().getTime();
                                _dmChannelMessagesMap[1] = {
                                    timestamp: timestamp,
                                    msg: messageInputValue,
                                    sender: currentUser,
                                }
                                _dmChannelMsgIndexes.unshift(1);
                                const messageString = sendDM(newChannel, currentUser, messageInputValue, 1, timestamp);
                                const messageDm = {
                                    messageString: messageString,
                                    dmUser: dmUser.user,
                                };
                                chatSocket.emit("send_message_dm", messageDm);
                                setDmChannelMessagesMap(_dmChannelMessagesMap);
                                setDmChannelMsgIndexes(_dmChannelMsgIndexes);
                                setMessageInputValue("");
                                const _userDms = [...userDms];
                                _userDms.push({
                                    user: dmUser.user,
                                    channel: newChannel,
                                    isLoggedIn: dmUser.isLoggedIn,
                                });
                                setUserDms(_userDms);
                                
                                const isSendChatMsgSuccess = await sendChatTopicMessage(messageString);
                                // const isSendChatMsgSuccess = false;
                                
                                console.log("send first message Success: " + isSendChatMsgSuccess);
                                // const isSendChatMsgSuccess = sendChatTopicMessage(sendDM(newChannel, currentUser, messageInputValue, 1));
                                // const isSendChatMsgSuccess = true;
                                if(isSendChatMsgSuccess){
                                    increaseDmUserUnread();
                                    console.log(`successfully sent first message to ${dmUser.user}`);
                                   
                                }
                            }
                            else {
                                // display message unable to send message
                            }
                        
                        
                        }
                    });
                    
                    
                    
                });
                
                // //  create new dm channel
                // const newChannel = deletedChannelList.length > 0 ? deletedChannelList[0] : channelIndex + 1;
                // const isSuccess = sendDataTopicMessage(newDm(newChannel, currentUser, dmUser));
                
                // if(isSuccess){
                //     let _dmChannelMap = {...dmChannelMap};
                //     let _dmChannelList = [...dmChannelList];
                //     let _userMap = {...userMap};
                //     console.log("sendChatMsgSuccess to new dmuser");
                //     // update local data with new dm channel created
                //     if(deletedChannelList.length > 0){
                //         let _deletedChannelList = [...deletedChannelList];
                //         _deletedChannelList.shift();
                //     } else{
                //         channelIndex = channelIndex + 1;
                //     }


                //     _dmChannelMap[newChannel] = {
                //         users: [currentUser, dmUser],
                //     };
                //     _dmChannelList.unshift(newChannel);
                //     _userMap[currentUser].dms.unshift([dmUser, newChannel]);
                //     _userMap[dmUser].dms.unshift([currentUser, newChannel]);
                //     setChannelIndexMax(newChannel);
                    
                //     // send DM message
                //     _myMessages[newChannel] = {
                //         type: MessageType.DM,
                //         msgMap: {
                //             0: {
                //                 msg: `Beginning of your chat history with ${dmUser}...`,
                //                 type: 1,
                //             },
                //         },
                //         msgList: [],
                //     };
                //     // const currentMessageIndex = myMessages[dmUser].msgList.length;
                //     const timestamp = new Date().getTime();
                //     const messageString = sendDM(newChannel, currentUser, messageInputValue, 1, timestamp);
                //     // const isSendChatMsgSuccess = sendChatTopicMessage(sendDM(newChannel, currentUser, messageInputValue, 1));
                //     const isSendChatMsgSuccess = true;
                //     if(isSendChatMsgSuccess){
                //         // const currentMessageIndex = myMessages[dmUser].msgList.length;
                //         _myMessages[newChannel].msgMap[1] = {
                //             timestamp: timestamp,
                //             msg: messageInputValue,
                //             sender: currentUser,
                //         };
                //         _myMessages[newChannel].msgList.unshift(1);
                //         chatSocket.emit("send_message", messageString);
                //         setMyMessages(_myMessages);
                //         setDmChannelMap(_dmChannelMap);
                //         setDmChannelList(_dmChannelList);
                //         setUserMap(_userMap);
                //         setMessageInputValue("");
                //     }
                // }
            }
            else {
                console.log("dmuser already exists");
                // send message to existing dm channel
                // const existingDMChannel = findExistingDmChannel();
                const existingDMChannel = dmUserProfile[0].channel;
                console.log("existingDmChannel: ", existingDMChannel);
                const dmChannel = existingDMChannel < 0 ? 0 : existingDMChannel;
                console.log("dmChannel: ", dmChannel);
                // console.log("myMessages: ", myMessages);
                // let _myMessages = {...myMessages};
                let _dmChannelMessagesMap = {...dmChannelMessagesMap};
                let _dmChannelMsgIndexes = [...dmChannelMsgIndexes];
                const currentMessageIndex = _dmChannelMsgIndexes.length;
                // const currentMessageIndex = _myMessages[dmChannel].msgList.length;
                const timestamp = new Date().getTime();
                const messageString = sendDM(dmChannel, currentUser, messageInputValue, currentMessageIndex, timestamp);
                
                console.log("sendChatMsgSuccess to existing dmuser");
                
                _dmChannelMessagesMap[currentMessageIndex] = {
                    timestamp: timestamp,
                    msg: messageInputValue,
                    sender: currentUser,
                }
                _dmChannelMsgIndexes.unshift(currentMessageIndex);
                
                // _myMessages[dmChannel].msgMap[currentMessageIndex] = {
                //     timestamp: timestamp,
                //     msg: messageInputValue,
                //     sender: currentUser,
                // };
                // _myMessages[dmChannel].msgList.unshift(currentMessageIndex);
                const messageDm = {
                    messageString: messageString,
                    dmUser: dmUser.user,
                };
                chatSocket.emit("send_message_dm", messageDm);
                setDmChannelMessagesMap(_dmChannelMessagesMap);
                setDmChannelMsgIndexes(_dmChannelMsgIndexes);
                setMessageInputValue("");
                // setMyMessages(_myMessages);
                // gunDb.get(`hca-${dmUser.user}`).put({unreads:{(""+currentUser): 1}})
                
                // const isSendChatMsgSuccess = true;
                const isSendChatMsgSuccess = await sendChatTopicMessage(messageString);
                // console.log("dmUserExists: isSendChatMsgSuccess: ", isSendChatMsgSuccess);

                if(isSendChatMsgSuccess){
                    increaseDmUserUnread();
                    console.log("sendChatMsgSuccess to existing dmuser");
                }
            }
        }
    }

    const onChangeMessageInput = (value) => {
        setMessageInputValue(value);
    }

    const increaseDmUserUnread = () => {
        const gunDmUser = gunDb.get(`hca-${dmUser.user}`);
        gunDmUser.get("unread").once((node) => {
            if(node && 
                node[currentUser] && 
                typeof node[currentUser] === "number" &&
                node[currentUser] >= 0
            ){
                console.log("increaseDmUserUnread exists: " + node[currentUser]);
                const unread = parseInt(node[currentUser]) + 1;
                gunDmUser.get("unread").get(currentUser).put(unread);
            }else{
                console.log("increaseDmUserUnread exists not");
                gunDmUser.get("unread").get(currentUser).put(1);
            }
            gunDmUser.get("unread").once((node)=> {
                console.log(`${dmUser.user} unreads after: `, node);
            })
            
        });
    }

    const resetDmUserUnread = () => {
        const gunDmUser = gunDb.get(`hca-${dmUser.user}`);
        gunDmUser.get("unread").get(currentUser).put(0);
    }

    const sendDataTopicMessage = async (dataMessage: string) => {
        let sendResponse = await new TopicMessageSubmitTransaction({
            topicId: DATA_TOPIC_ID,
            message: dataMessage,
        }).execute(hederaClient);
    
        const getReceipt = await sendResponse.getReceipt(hederaClient);
        console.log("receiptStatus: ", getReceipt.status);
        return getReceipt.status._code === 22 ;
        // console.log("The message transaction status: " + transactionStatus)
    }

    const sendChatTopicMessage = async (chatMessage: string) => {
        console.log("sendChatTopicMessage: ", chatMessage);
        let sendResponse = await new TopicMessageSubmitTransaction({
            topicId: MESSAGE_TOPIC_ID,
            message: chatMessage,
        })
        .execute(hederaClient);
    
        const getReceipt = await sendResponse.getReceipt(hederaClient);
        console.log("getReceipt: ", getReceipt );
        console.log("getReceipt.status: " + getReceipt.status );
        console.log("getReceiptStatus = 22 : ", getReceipt.status === 22 );
        return getReceipt.status._code === 22 ;
        // console.log("The message transaction status: " + transactionStatus)
    }

    const onKeyDownHandler = (event) => {
        if(event.key === 'Enter'){
            isMeTyping = false;
            chatSocket.emit("typing_event", {
                dmUser: dmUser,
                sender: currentUser,
                isTyping: false,
            });
            onClickSend();
            
        } else {
            const thisTimestamp = (new Date()).getTime();
            console.log("thisTimestamp: " + thisTimestamp);
            lastTypedTimestamp = thisTimestamp;
            if(!isMeTyping){
                chatSocket.emit("typing_event", {
                    dmUser: dmUser,
                    sender: currentUser,
                    isTyping: true,
                });
                isMeTyping = true;
            }

            setTimeout(() => {
                console.log(`thisTimestamp: ${thisTimestamp}, lastTypedTimestamp: ${lastTypedTimestamp}`);
                if(thisTimestamp === lastTypedTimestamp && isMeTyping){
                    isMeTyping = false;
                    chatSocket.emit("typing_event", {
                        dmUser: dmUser,
                        sender: currentUser,
                        isTyping: false,
                    });
                    
                }
            }, 1000);

        }
    }

    const goBackToSideBarView = () => {
        setMainWindow(null);
        setCurrentDmUser({});
    }

    const attachFileIconClicked = (event) => {
        hiddenFileInput.current.click();
    }

    const handleChange = (event) => {
        const imgURL = URL.createObjectURL(event.target.files[0]);
        // alert("imageFileUrl: " + imgURL);
        let selectedFile = event.target.files[0];
        console.log("selectedFile:", event.target.files[0]);
        const fileContainer = {
            file: event.target.files[0],
            imgUrl: imgURL,
            name: event.target.files[0].name,
        };
        let currentSelectedFiles = [...selectedFiles];
        currentSelectedFiles.push(fileContainer);
        console.log("currentSelectedFiles:", currentSelectedFiles);
        event.target.value = null;
        setSelectedFiles(currentSelectedFiles);
        
    };

    const cancelFileUpload = (index) => {
        console.log("removed index: " + index);
        const currentSelectedFiles = [...selectedFiles];
        console.log("beforeSplice: ", currentSelectedFiles);
        currentSelectedFiles.splice(index, 1);
        console.log("afterSplice: ", currentSelectedFiles);
        setSelectedFiles(currentSelectedFiles);
    }

    // console.log("ChatWindow-myMessages: ", myMessages[1]);
    console.log("$isTyping: " + isTyping);
    // const windowWidth2 = windowWidth/2;
    const defaultMsgWidth = WINDOW_WIDTH - 10;
    const windowWidth = WINDOW_WIDTH;
    const mdDefaultHeight = "h-[" + WINDOW_HEIGHT + "px]";

    const defaultWidth = "w-[" + WINDOW_WIDTH + "px]";
    const defaultMsgWidthStyle = `w-[${defaultMsgWidth}px]`;
    // const defaultWidth = "w-full";
    console.log("selectedFiles:", selectedFiles);
    return (
        <div className={`flex flex-1 flex-col sm:w-full  sm:h-[300px] w-screen h-[100px]`}>
            <div className={`flex flex-row sm:w-full w-screen h-12 bg-[#343d33]  border-y-[1px] border-[gray]`} >
                
                {WINDOW_WIDTH <= 768 &&
                    <div 
                        className={`flex text-white justify-center ml-0 w-[46px]`}
                        onClick={() => goBackToSideBarView() }
                    >
                        <ArrowBackIosNewIcon className='self-center' fontSize=''/>
                    </div>
                }
                <p className='self-center text-white ml-4'>{"Direct Message:"}</p>
                <div className={`flex ${statusIconColor} justify-center ml-4`}>
                    <CircleIcon className='self-center' fontSize=''/>
                </div>
                
                <p className='self-center font-bold text-white ml-2'>{dmUser.user}</p>
            </div>

            { isLoading ?
                <Lottie animationData={dotsLoadingAnimation} loop={true} autoplay={true}/>
                :
                <>
                <div className={`flex flex-col-reverse sm:w-full ${defaultWidth} sm:h-[200px] h-[420px] bg-[transparent] scrollbar-dark-gray grow`}>
                    
                    {
                        // myMessages[dmUser.channel].msgList.map(messageIndex => {
                        // messages.map(messageIndex => {
                        dmChannelMsgIndexes.map(messageIndex => {
                            
                            // const myMessage = myMessages[dmUser.channel].msgMap[messageIndex];
                            let myMessage = dmChannelMessagesMap[messageIndex];
                            if(messageIndex === 0){
                                myMessage = {
                                 msg: `# Beginning of your chat with ${dmUser.user} `,
                                } ;
                            }
                            console.log("myMessage: ", myMessage);
                            const sender = myMessage.sender;
                            //timestamp
                            let messageTimestamp;
                            let date;
                            let hours;
                            let minutes;
                            let meridian;
                            let month;
                            let dayOfWeek;
                            let dayOfMonth;
                            let year;
                            if(sender){
                                messageTimestamp = myMessage.timestamp;
                                date = new Date(messageTimestamp);
                                const modHour = date.getHours() % 12;
                                hours = modHour === 0 ? 12 : modHour;
                                minutes = date.getMinutes();
                                minutes = minutes < 10 ? "0" + minutes : minutes;
                                meridian = date.getHours() < 12 ? "am" : "pm";

                                dayOfWeek = date.getDay();
                                dayOfMonth = date.getDate();
                                month = date.getMonth();
                                year = date.getFullYear();

                            }

                            
                            const msgSenderColor = myMessage.sender === currentUser ? "text-[#3ff281]" : "text-[#3edced]";
                            const msgTimeColor = myMessage.sender === currentUser ? "text-[#a4edba]" : "text-[#9fe5ed]";
                            return (
                                <div className={`flex flex-col sm:w-full ${defaultMsgWidthStyle} border-t-[1px] border-[gray] p-2`}>
                                    {
                                        !!sender &&
                                        <div className={`flex flex-auto flex-row sm:w-full ${defaultMsgWidthStyle} h-8`}>
                                            <p className={`${msgSenderColor} font-bold mr-1`}>{myMessage.sender}</p>
                                            <p className={`text-[#bcd4cd] ml-2`}>{`${hours}:${minutes} ${meridian}`}</p>
                                            <div className='flex flex-row ml-0 grow justify-end '>
                                                <p className={`text-white `}>{`${DAYS_OF_WEEK[dayOfWeek]}, ${month+1}-${dayOfMonth}-${year}`}</p>
                                            </div>
                                            
                                        </div>
                                    }
                                    
                                    <div className={`flex flex-auto flex-col sm:w-full ${defaultMsgWidthStyle} grow  break-words`}>
                                        {/* {message.message} */}
                                        <p className={`flex flex-auto grow sm:w-full ${defaultMsgWidthStyle} text-white break-words line-clamp-6 `}>{myMessage.msg}</p>
                                    </div>
                                    
                                </div>
                            )
                        })
                    }
                    {
                        Object.keys(dmChannelMessagesMap).length === 0 && 
                        <div className={`flex sm:w-full ${defaultWidth} border-t-[0px] border-[gray] px-2 pt-4 sm:pb-2 pb-6`}>
                            <div className='flex flex-row w-full h-8'>
                                <p className={`text-white font-bold`}>{`No message history with ${dmUser.user}. Start a conversation...`}</p>
                            </div>
                        </div>
                    }
                </div>
            

                {   isTyping &&
                    <div className={`flex  flex-row sm:w-full ${defaultWidth} h-[20px] text-[#3edced]`}>
                        <p className="ml-3">{`${dmUser.user} typing...`}</p>
                    </div>
                }
                <div className='flex flex-col mt-2 '>
                    {selectedFiles.length > 0 &&
                        <>
                        <div className='h-8 w-full bg-[#5e6e5c]'>
                            <p className='text-white ml-2'>Attached files:</p>
                        </div>
                        <div className='scrollbar-dark-gray-horizontal bg-[#5e6e5c]'>
                            <div className='flex flex-row h-[100px] align-center'>
                                {selectedFiles.map((fileContainer, index) => {
                                    return (
                                        <div className='h-[80px] w-[80px] self-center mx-2 bg-[white] rounded-md '>
                                            
                                            <img 
                                                src={fileContainer.imgUrl}
                                                style={{height: 80, width: 80, borderRadius: 6, borderWidth: 2, borderColor: "black"}}
                                                // src={`https://arweave.net/${imageId}`}
                                                // src="https://arweave.net/OhYq0oFl-2JP5M7cr4NtbkwzqCccIe27qVJDbROr26E"
                                                alt="img"
                                            />
                                            <CancelIcon 
                                                senior
                                                sx={{fontSize: 24, height:  24, color: "white", position: "relative", top: -90, left: 65, borderRadius: 6, cursor: "pointer"}}  
                                                className="self-center bg-[#343d33]"  
                                                onClick={() => cancelFileUpload(index)}
                                            />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        </>
                    }
                    <div className={`flex flex-row sm:w-full ${defaultWidth} h-[80px] bg-[#5e6e5c] rounded-xl pl-2  justify-end`}>
                        <input
                            autoComplete={"off"}
                            className="h-12 grow self-center rounded-l-md bg-[#343d33] pl-2 text-white"
                            type="text" 
                            name="send-message" 
                            placeholder={"write a message"}
                            value={messageInputValue}
                            onChange={e => {
                                onChangeMessageInput(e.target.value);
                            }}
                            onKeyDownCapture={onKeyDownHandler}
                            ref={messageInputBox}
                        />
                        <div 
                            className='self-center rounded-r-md px-3 bg-[#343d33] hover:cursor-pointer'
                        >
                            <AttachFileIcon 
                                sx={{ fontSize: 30, height:  48, borderTopRightRadius: 6, borderBottomRightRadius: 6, color: "white"}}  
                                className="self-center bg-[#343d33]"  
                                onClick={attachFileIconClicked}
                            />
                            <input
                                type="file"
                                ref={hiddenFileInput}
                                onChange={handleChange}
                                style={{display: 'none'}}
                            />
                    
                        </div>
                        
                        <div 
                            className={`flex text-white w-12 h-10 self-center justify-center hover:cursor-pointer ${sendButtonHoverCursor} ${sendButtonBgColor}`}
                            onClick={() => onClickSend() }
                        >
                            <SendIcon className='self-center'/>
                        </div>
                    </div>
                    
                </div>
                </>
            }

        </div>
);
        
        
}

export default ChatWindow;