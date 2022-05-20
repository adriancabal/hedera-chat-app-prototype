// import logo from './logo.svg';
import { useDispatch, useSelector } from 'react-redux';
import { setHederaClient, setSmartContractId } from "./redux/userSlice";
// import { setUserList, setUserMap } from "./redux/usersSlice";
// import { setDeletedChannelList, setDmChannelList, setGroupChannelList, setDmChannelMap, setGroupChannelMap } from "./redux/channelsSlice";
import './App.css';
import Login from './components/Login';
import MainChatScreen from './components/MainChatScreen';
import { useEffect, useState } from 'react';
import { Client, PrivateKey, AccountId} from "@hashgraph/sdk";
import { UserAction } from './constants';
import socketIOClient from "socket.io-client";
import { userMap, userList, dmChannelMap, groupChannelMap, dmChannelList, groupChannelList, deletedChannelList} from './data';
const ENDPOINT = "http://localhost:4001";
const DATA_TOPIC_ID = "0.0.34717180";
let client = null;
// let outerUserMap ={};

function App() {
  // const hederaClient = useSelector((state) => state.user.hederaClient);
  const dispatch = useDispatch();
  // const [isLoggedIn, setLoggedIn] = useState(false);
  const [isNewAccountCreated, setNewAccountCreated] = useState(false);
  // const [topicMsg, setTopicMsg] = useState("init");
  // const [appUserList, setAppUserList] = useState([]);

  const currentUser = useSelector((state) => state.user.currentUser);
  // const userList = useSelector((state) => state.users.userList);
  // const userMap = useSelector((state) => state.users.userMap);
  // const deletedChannelList = useSelector((state) => state.channels.deletedChannelList);
  // const dmChannelMap = useSelector((state) => state.channels.dmChannelMap);
  // const groupChannelMap = useSelector((state) => state.channels.groupChannelMap);
  // const dmChannelList = useSelector((state) => state.channels.dmChannelList);
  // const groupChannelList = useSelector((state) => state.channels.groupChannelList);
  const hederaClient = useSelector((state) => state.user.hederaClient);

  useEffect(() => {
    

    const myAccountId = process.env.REACT_APP_MY_ACCOUNT_ID;
    const myPrivateKey = process.env.REACT_APP_MY_PRIVATE_KEY;
    const hederaContractId = process.env.REACT_APP_HEDERA_CHAT_CONTRACT_ID;
    console.log("$$$$$$$$$$$$$$$$$$$$$$$$")
    console.log("myAccountId: " +  myAccountId);
    console.log("myPrivateKey: " + myPrivateKey);
    // If we weren't able to grab it, we should throw a new error
    if (myAccountId == null ||
        myPrivateKey == null ) {
        throw new Error("Environment variables myAccountId and myPrivateKey must be present");
    }

    // Establish client connection
    client = Client.forTestnet();
    client.setOperator(AccountId.fromString(myAccountId) ,PrivateKey.fromString(myPrivateKey));
    // console.log("client: ", client._mirrorNetwork);
    dispatch(setHederaClient(client));
    // dispatch(setSmartContractId(hederaContractId));

    console.log("initializingDataTopicConnection...");
    const socket = socketIOClient(ENDPOINT, 
      {
      withCredentials: true, 
      extraHeaders: {
        "hedera-chat-app": "abcd",
        // 'Access-Control-Allow-Credentials': true,
      }
    }
    );

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
    socket.on("FromAPI", data => {
      console.log(data);
      // setTopicMsg(data);
      dataController(data);
    });

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
    console.log("userList: ", userList);
    if(msgType === UserAction.NEW_USER){
        const user = msgObj.user;
        if(!userMap[user]){
            // let userMapTemp = {...outerUserMap};
            // let userListTemp = [...appUserList, user];
            userMap[user] = {
                pw: msgObj.pw, 
                channels: [],
                isLoggedIn: false,
            };
            userList.push(user);
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
            dmChannelMap[channel] = {
                users: [user1, user2],
            };

            // let dmChannelListTemp = [...dmChannelList];
            dmChannelList.unshift(channel);

            // let userMapTemp = {...userMap};
            userMap[user1].channels.unshift(channel);
            userMap[user2].channels.unshift(channel);

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
            groupUsers.forEach(user => userMap[user].channels.unshift(channel));

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

            // dispatch(setGroupChannelMap(groupChannelMapTemp))
            // dispatch(setGroupChannelList(groupChannelListTemp));
            // dispatch(setDeletedChannelList(deletedChannelListTemp));
            // dispatch(setUserMap(userMapTemp));

        };
    }
    else if(msgType === UserAction.LOGIN){
        // let userMapTemp = {...userMap};
        // console.log("UserAction.Login:userMapTemp: ", userMapTemp);
        if(userMap[msgObj.user]){
          // let userTemp = userMapTemp[msgObj.user];
          userMap[msgObj.user].isLoggedIn = true;
          // userMap[msgObj.user] = {
          //   ...userTemp,
          //   isLoggedIn: true,
          // };
          // dispatch(setUserMap(userMapTemp));
        }
        
    }
    else if(msgType === UserAction.LOGOUT){
        // let userMapTemp = {...userMap};
        if(userMap[msgObj.user]){
          userMap[msgObj.user].isLoggedIn = false;
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






