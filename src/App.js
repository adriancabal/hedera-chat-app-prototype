// import { useDispatch, useSelector } from 'react-redux';
// import { setHederaClient, setSocket } from "./redux/userSlice";
// import { setUserList, setUserMap } from "./redux/usersSlice";
// import { setDeletedChannelList, setDmChannelList, setGroupChannelList, setDmChannelMap, setGroupChannelMap } from "./redux/channelsSlice";
import './App.css';
// import { AppProvider } from "./AppContext";
// import AppContext from "./AppContext";
import Login from './components/Login';
import MainChatScreen from './components/MainChatScreen';
import { useContext, useEffect, useState } from 'react';
import { Client, PrivateKey, AccountId} from "@hashgraph/sdk";
import { UserAction, CHAT_SERVER_ENDPOINT} from './constants';
import socketIOClient from "socket.io-client";
import AppContext from './AppContext';
// import {
//   setChannelIndex,
//   userMap, 
//   userList, 
//   dmChannelMap, 
//   groupChannelMap, 
//   dmChannelList, 
//   groupChannelList, 
//   deletedChannelList,
//   channelIndex,
// } from './data';
// const ENDPOINT = "http://localhost:4420";
// const ENDPOINT = "http://6sqacqd9utbnvdvvks7tcnhngc.palmito.duckdns.org:4420";
const ENDPOINT = "http://i61ngaqqq1aqd9ujs91q9ptbl0.palmito.duckdns.org:4420";
// const ENDPOINT = "http://a9k83f91b18d9ak71a48pgvgss.palmito.duckdns.org:80";
// const DATA_TOPIC_ID = "0.0.34717180";
let client = null;
// let outerUserMap ={};

const App = () => {
  // const hederaClient = useSelector((state) => state.user.hederaClient);
  // const { currentUser, setHederaClient, userMap, setUserMap, userList, setUserList, dmChannelList, setDmChannelList, dmChannelMap, setDmChannelMap, groupChannelMap, groupChannelList, deletedChannelList, channelIndex, setChannelIndex} = useContext(AppContext);
  const {setHederaClient} = useContext(AppContext);
  const [userMap, setUserMap] = useState({});
  const [userList, setUserList] = useState([]);
  // const [hederaClient, setHederaClient] = useState(null);
  const { currentUser, setDataSocket, setChatSocket, setMyMessages } = useContext(AppContext);
  // const [currentUser, setCurrentUser] = useState("");
  const  [dmChannelMap, setDmChannelMap] = useState({});
  const [dmChannelList, setDmChannelList] = useState([]);
  const [groupChannelMap, setGroupChannelMap] = useState({});
  const [groupChannelList, setGroupChannelList] = useState([]);
  const [channelIndex, setChannelIndex] = useState(0);
  const [deletedChannelList, setDeletedChannelList] = useState([]);
  // const [myMessages, setMyMessages] = useState([]);
  // const [dataSocket, setDataSocket] = useState(null);

  // const dispatch = useDispatch();
  // const [isLoggedIn, setLoggedIn] = useState(false);
  const [isNewAccountCreated, setNewAccountCreated] = useState(false);
  // const [topicMsg, setTopicMsg] = useState("init");
  // const [appUserList, setAppUserList] = useState([]);

  // const currentUser = useSelector((state) => state.user.currentUser);
  // const userList = useSelector((state) => state.users.userList);
  // const userMap = useSelector((state) => state.users.userMap);
  // const deletedChannelList = useSelector((state) => state.channels.deletedChannelList);
  // const dmChannelMap = useSelector((state) => state.channels.dmChannelMap);
  // const groupChannelMap = useSelector((state) => state.channels.groupChannelMap);
  // const dmChannelList = useSelector((state) => state.channels.dmChannelList);
  // const groupChannelList = useSelector((state) => state.channels.groupChannelList);
  // const hederaClient = useSelector((state) => state.user.hederaClient);

  useEffect(() => {
    console.log("AppContext: ", currentUser);
    console.log("APP.JS useeffect");

    const myAccountId = process.env.REACT_APP_MY_ACCOUNT_ID;
    const myPrivateKey = process.env.REACT_APP_MY_PRIVATE_KEY;
    // If we weren't able to grab it, we should throw a new error
    if (myAccountId == null ||
        myPrivateKey == null ) {
        throw new Error("Environment variables myAccountId and myPrivateKey must be present");
    }

    // Establish client connection
    client = Client.forTestnet();
    client.setOperator(AccountId.fromString(myAccountId) ,PrivateKey.fromString(myPrivateKey));
    // hederaClient = client;
    // console.log("client: ", client._mirrorNetwork);
    // dispatch(setHederaClient(client));
    setHederaClient(client);
    // dispatch(setSmartContractId(hederaContractId));

    console.log("initializingDataTopicConnection...");
    
    const _dataSocket = socketIOClient(ENDPOINT
      // {
      //   withCredentials: true, 
      //   extraHeaders: {
      //     "hedera-chat-app": "abcd",
      //     // 'Access-Control-Allow-Credentials': true,
      //   }
      // }
    );

    setDataSocket(_dataSocket);

    // const _chatSocket = socketIOClient(CHAT_SERVER_ENDPOINT, 
    //     {
    //     withCredentials: true, 
    //     extraHeaders: {
    //       "hedera-chat-message": "abcd",
    //     }
    //   }
    // );
    // setChatSocket(_chatSocket);

    // _chatSocket.once("get_init_msg_load_response", msgLoad => {
    //     console.log("get_init_msg_load_response: ", msgLoad);
    //     setMyMessages(msgLoad);
    // });
    // const initialMsgLoadData = {
    //     user: currentUser,
    //     channels: dmChannelList,
    // };
    // console.log("emit: get_init_msg_load: ", initialMsgLoadData);
    // _chatSocket.emit("get_init_msg_load", initialMsgLoadData);

    // const socket = socketIOClient(CHAT_SERVER_ENDPOINT, 
    //   {
    //     withCredentials: true, 
    //     extraHeaders: {
    //       "hedera-chat-message": "abcd",
    //       // 'Access-Control-Allow-Credentials': true,
    //     }
    //   }
    // );

    // socket.disconnect();

    // dispatch(setSocket(socket));


    // const socket = socketIOClient(ENDPOINT, {
    //   withCredentials: true, 
    //   transportOptions: {
    //     polling: {
    //       extraHeaders: {
    //         "hedera-chat-app": "abcd"
    //       }
    //     }
    //   }
    // });
    
    // const socket = socketIOClient(ENDPOINT);
    // socket.connect();
    // console.log("App.js right before getDmUsers...");
    // socket.emit("getDmUsers", "user1" );

    // socket.on("getDMUsers_response", data => {
    //   console.log("getDMUsers_response: ", data);
    //   // setTopicMsg(data);
    //   // dataController(data);
    // });

    // socket.on("ChatMessages", message => {
    //     console.log("on chatMessages...: ", message);
    //     console.log("myMessages: ", myMessages);
    //     let _myMessages =[...myMessages];
    //     _myMessages.push(message);
    //     setMyMessages(_myMessages);
    //     // console.log("messageTimestamp: ", message.consensusTimestamp.seconds.low);
    //     // const messageAsString = Buffer.from(message.contents, "utf8").toString();
    //     // chatMessageController(messageAsString);
    // });

  }, []);

  // Establish topic connection
  // const initializeDataTopicConnection = async () => {
  //   console.log("initializingDataTopicConnection...");
  //   try {
  //      new TopicMessageQuery()
  //       .setTopicId("0.0.34717180")
  //       // 'May 7, 2022 10:15:30'
  //       .setStartTime(new Date('May 18, 2022 13:50:30'))
  //       .subscribe(client, null, (message) => {
  //           let messageAsString = Buffer.from(message.contents, "utf8").toString();
  //           dataController(messageAsString);
            
  //           console.log(`${message.consensusTimestamp.toDate()} Received: ${messageAsString}`);
  //       });
  //   }
  //   catch(err){
  //       console.log("err!: ", err);
  //   }
  // }

  const dataController = (message) => {
    
    const msgObj = JSON.parse(message);
    const msgType = msgObj.type;
    // console.log("topicMsg: " + topicMsg);
    console.log("userMap: ", userMap);
    // console.log("msgObj: ", msgObj);
    // console.log("userList: ", userList);
    if(msgType === UserAction.NEW_USER){
        const user = msgObj.user;
        if(!userMap[user]){
          let _userMap = {...userMap};
          _userMap[user] = {
              pw: msgObj.pw, 
              dms:[],
              groups: [],
              isLoggedIn: false,
          };
          let _userList = [...userList];
          _userList.push(user);
          setUserMap(_userMap);
          setUserList(_userList);
            // userListTemp.push(user);
            // console.log("userMap2: ", userMapTemp);
            // console.log("userList2: ", userListTemp);
            // dispatch(setUserMap(userMapTemp));
            // dispatch(setUserList(userListTemp));
        }
    }
    else if(msgType === UserAction.NEW_DM){
        const channel = msgObj.channel;
        const user1 = msgObj.user1;
        const user2 = msgObj.user2;
        if(!dmChannelMap[channel] && !groupChannelMap[channel]){
            // let dmChannelMapTemp = {...dmChannelMap};
            let _dmChannelMap = {...dmChannelMap};
            _dmChannelMap[channel] = {
                users: [user1, user2],
            };

            let _dmChannelList = [...dmChannelList];
            _dmChannelList.unshift(channel);

            let _userMap = {...userMap};
            _userMap[user1].dms.unshift([user2, channel]);
            _userMap[user2].dms.unshift([user1, channel]);

            setDmChannelMap(_dmChannelMap);
            setDmChannelList(_dmChannelList);
            setUserMap(_userMap);
            setChannelIndex(channel);
            // dispatch(setUserMap(userMapTemp));
            // dispatch(setDmChannelList(dmChannelListTemp));
            // dispatch(setDmChannelMap(dmChannelMapTemp))
        };
    }
    else if(msgType === UserAction.NEW_GROUP){
        const channel = msgObj.channel;
        if(!groupChannelMap[channel] && !dmChannelMap[channel]){
            const groupUsers = msgObj.users;
            // let groupChannelMapTemp = {...groupChannelMap};
            // let groupChannelListTemp = [...groupChannelList];
            // let userMapTemp = {...userMap};
            groupChannelMap[channel] = {
                creator: msgObj.creator,
                name: msgObj.name,
                users: groupUsers,
            };
            groupChannelList.unshift(channel);
            groupUsers.forEach(user => userMap[user].groups.unshift(channel));
            setChannelIndex(channel);
            // dispatch(setGroupChannelMap(groupChannelMapTemp))
            // dispatch(setGroupChannelList(groupChannelListTemp));
            // dispatch(setUserMap(userMapTemp));
        };
    }
    else if(msgType === UserAction.DELETE_GROUP){
        const channel = msgObj.channel;
        const groupChannel = groupChannelMap[channel];
        if(groupChannel && msgObj.sender === groupChannel.creator){
            const groupUsers = groupChannel.users;
            // let groupChannelMapTemp = {...groupChannelMap};
            delete groupChannelMap[channel];

            // let groupChannelListTemp = [...groupChannelList];
            const groupListIndex = groupChannelList.indexOf(channel);
            if(groupListIndex > -1){
              groupChannelList.splice(groupListIndex, 1);
            }

            // let deletedChannelListTemp = [...deletedChannelList];
            deletedChannelList.push(channel);

            // let userMapTemp = {...userMap};
            groupUsers.forEach(user => {
                const index = userMap[user].channels.indexOf(channel);
                if(index > -1){
                  userMap[user].channels.splice(index, 1);
                }
            });

            if(channel === channelIndex){
              const maxIndex = Math.max(...groupChannelList);
              let _channelIndex =  maxIndex!==-Infinity && !isNaN(maxIndex) ? maxIndex : 0;
              setChannelIndex(_channelIndex);
            }

            // dispatch(setGroupChannelMap(groupChannelMapTemp))
            // dispatch(setGroupChannelList(groupChannelListTemp));
            // dispatch(setDeletedChannelList(deletedChannelListTemp));
            // dispatch(setUserMap(userMapTemp));

        };
    }
    else if(msgType === UserAction.LOGIN){
        let _userMap = {...userMap};
        // console.log("UserAction.Login:userMapTemp: ", userMapTemp);
        if(_userMap[msgObj.user]){
          // let userTemp = userMapTemp[msgObj.user];
          _userMap[msgObj.user].isLoggedIn = true;
          setUserMap(_userMap);
          // userMap[msgObj.user] = {
          //   ...userTemp,
          //   isLoggedIn: true,
          // };
          // dispatch(setUserMap(userMapTemp));
        }
        
    }
    else if(msgType === UserAction.LOGOUT){
        let _userMap = {...userMap};
        if(_userMap[msgObj.user]){
          _userMap[msgObj.user].isLoggedIn = false;
          setUserMap(_userMap);
          // dispatch(setUserMap(userMapTemp));
        }
    }

  }

  const bodyMarginTop = currentUser ? "mt-0" : "mt-16";

  return (
      <div className="flex flex-col w-screen bg-black h-screen ">
        <div className='flex flex-col mt-16 mb-16 h-20 justify-center bg-[black]'>
          <h1 className="text-center text-white text-4xl ">
            Chat App Prototype
          </h1>
          <h1 className="text-center text-white text-md mt-2">
            powered by Hedera Hashgraph
          </h1>
        </div>
        {/* <p className='text-[white] text-3xl text-center'>{topicMsg}</p> */}
        {
          !!!currentUser && isNewAccountCreated &&
          <p className='text-[#03fc6f] font-bold text-3xl text-center'>Account Created Successfully!</p>
        }
        <div className={`flex ${bodyMarginTop} justify-center h-[700px] w-[1000px] bg-[black] self-center`}>
          
          { 
            !!currentUser 
            ? <MainChatScreen />
            : <Login setNewAccountCreated={setNewAccountCreated}/>
          }
        </div>
      </div>
  );
}

export default App;






