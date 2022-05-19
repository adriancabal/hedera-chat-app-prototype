// import logo from './logo.svg';
import { useDispatch, useSelector } from 'react-redux';
import { setHederaClient, setSmartContractId } from "./redux/userSlice";
import { setUserList, setUserMap } from "./redux/usersSlice";
import { setDeletedChannelList, setDmChannelList, setGroupChannelList, setDmChannelMap, setGroupChannelMap } from "./redux/channelsSlice";
import { test } from './components/TopicQuery';
import './App.css';
import Login from './components/Login';
import MainChatScreen from './components/MainChatScreen';
import { useEffect, useState } from 'react';
import { Client, TopicMessageQuery, PrivateKey, AccountId} from "@hashgraph/sdk";
import { UserAction } from './constants';
const DATA_TOPIC_ID = "0.0.34717180";
let client = null;

function App() {
  // const hederaClient = useSelector((state) => state.user.hederaClient);
  const dispatch = useDispatch();
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isNewAccountCreated, setNewAccountCreated] = useState(true);
  const userList = useSelector((state) => state.users.userList);
  const userMap = useSelector((state) => state.users.userMap);
  const deletedChannelList = useSelector((state) => state.channels.deletedChannelList);
  const dmChannelMap = useSelector((state) => state.channels.dmChannelMap);
  const groupChannelMap = useSelector((state) => state.channels.groupChannelMap);
  const dmChannelList = useSelector((state) => state.channels.dmChannelList);
  const groupChannelList = useSelector((state) => state.channels.groupChannelList);
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
    // dispatch(setHederaClient(client));
    // dispatch(setSmartContractId(hederaContractId));
    // initializeDataTopicConnection()

    console.log("initializingDataTopicConnection...");
    // try {
    //   new TopicMessageQuery()
    //     .setTopicId("0.0.34717180")
    //         // 'May 7, 2022 10:15:30'
    //     .setStartTime(new Date('May 18, 2022 13:50:30'))
    //     .subscribe(client, null, (message) => {
    //       let messageAsString = Buffer.from(message.contents, "utf8").toString();
    //       // dataController(messageAsString);
          
    //       console.log(`${message.consensusTimestamp.toDate()} Received: ${messageAsString}`);
    //   });
    // }
    // catch(err){
    //     console.log("err!: ", err);
    // }
    
    

  }, []);

  // useEffect(() => {
  //   if(!!hederaClient){
  //     // initializeDataTopicConnection();
  //   }
  // }, [hederaClient]);

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

    if(msgType === UserAction.ADD_USER){
        const user = msgObj.user
        if(!userMap[user]){
            userMap[user] = {
                pw: msgObj.pw, 
                channels: [],
                isLoggedIn: false,
            };
            userList.push(user);

            // dispatch(setUserMap(userMap));
            // dispatch(setUserList(userList));
        }
    }
    else if(msgType === UserAction.ADD_DM){
        const channel = msgObj.channel;
        const user1 = msgObj.user1;
        const user2 = msgObj.user2;
        if(!dmChannelMap[channel] && !groupChannelMap[channel]){
            dmChannelMap[channel] = {
                users: [user1, user2],
            };
            dmChannelList.unshift(channel);
            userMap[user1].channels.unshift(channel);
            userMap[user2].channels.unshift(channel);

            // dispatch(setUserMap(userMap));
            // dispatch(setDmChannelList(dmChannelList));
            // dispatch(setDmChannelMap(dmChannelMap))
        };
    }
    else if(msgType === UserAction.ADD_GROUP){
        const channel = msgObj.channel;
        if(!groupChannelMap[channel] && !dmChannelMap[channel]){
            const groupUsers = msgObj.users;
            groupChannelMap[channel] = {
                creator: msgObj.creator,
                name: msgObj.name,
                users: groupUsers,
            };
            groupChannelList.unshift(channel);
            groupUsers.forEach(user => userMap[user].channels.unshift(channel));

            // dispatch(setGroupChannelMap(groupChannelMap))
            // dispatch(setGroupChannelList(groupChannelList));
            // dispatch(setUserMap(userMap));
        };
    }
    else if(msgType === UserAction.DELETE_GROUP){
        const channel = msgObj.channel;
        const groupChannel = groupChannelMap[channel];
        if(groupChannel && msgObj.sender === groupChannel.creator){
            const groupUsers = groupChannel.users;
            delete groupChannelMap[channel];
            const groupListIndex = groupChannelList.indexOf(channel);
            if(groupListIndex > -1){
                groupChannelList.splice(groupListIndex, 1);
            }
            deletedChannelList.push(channel);

            groupUsers.forEach(user => {
                const index = userMap[user].channels.indexOf(channel);
                if(index > -1){
                    userMap[user].channels.splice(index, 1);
                }
            });

            // dispatch(setGroupChannelMap(groupChannelMap))
            // dispatch(setGroupChannelList(groupChannelList));
            // dispatch(setDeletedChannelList(deletedChannelList));
            // dispatch(setUserMap(userMap));

        };
    }
    else if(msgType === UserAction.LOGIN){
        userMap[msgObj.user].isLoggedIn = true;
        // dispatch(setUserMap(userMap));
    }
    else if(msgType === UserAction.LOGOUT){
        userMap[msgObj.user].isLoggedIn = false;
        // dispatch(setUserMap(userMap));
    }

  }

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
      {
          !isLoggedIn && isNewAccountCreated &&
          <p className='text-[#03fc6f] font-bold text-3xl text-center'>Account Created Successfully!</p>
        }
      <div className='flex mt-16 justify-center h-[700px] w-[1000px] bg-[black] self-center'>
        
        { 
          isLoggedIn 
          ? <MainChatScreen />
          : <Login setLoggedIn={setLoggedIn} setNewAccountCreated={setNewAccountCreated}/>
        }
        
      </div>
      
      
    </div>
  );
}

{/* <img src={logo} className="App-logo" alt="logo" />
  <p>
    Edit <code>src/App.js</code> and save to reload.
  </p>
  <a
    className="App-link"
    href="https://reactjs.org"
    target="_blank"
    rel="noopener noreferrer"
  ></a> */}

export default App;






