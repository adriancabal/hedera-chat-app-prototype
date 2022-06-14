import { createContext, useState, useEffect } from "react";
import { UserAction } from "./constants";
import { Client, PrivateKey, AccountId} from "@hashgraph/sdk";
import socketIOClient from "socket.io-client";
import { current } from "@reduxjs/toolkit";
const ENDPOINT = "http://localhost:4001";

const AppContext = createContext();

 export function AppProvider({children}){
    // const [test, setTest] = useState("initial-test");
    const [currentUser, setCurrentUser] = useState("");
    const [userMap, setUserMap] = useState();
    // console.log("AppContext: userMap: ", userMap);
    const [userList, setUserList] = useState([]);
    const [dmChannelMap, setDmChannelMap] = useState({});
    const [dmChannelList, setDmChannelList] = useState([]);
    const [groupChannelMap, setGroupChannelMap] = useState({});
    const [groupChannelList, setGroupChannelList] = useState([]);
    const [deletedChannelList, setDeletedChannelList] = useState([]);
    const [channelIndex, setChannelIndex] = useState(0);
    const [hederaClient, setHederaClient] = useState(null);
    const [myMessages, setMyMessages] = useState({});
    const [chatSocket, setChatSocket] = useState(null);
    const [dataSocket, setDataSocket] = useState(null);
    const [userDms, setUserDms] = useState([]);
    const [currentDmMessages, setCurrentDmMessages] = useState([]);
    const [unreadMsgs, setUnreadMsgs]= useState({})
    const [currentDmUser, setCurrentDmUser] = useState({});

    const resetCurrentDmMessages = () => {
        setCurrentDmMessages([]);
    }

    const setChannelIndexMax = (index) => {
        if(index > channelIndex){
            setChannelIndex(index);
        }
    }

    return (
        <AppContext.Provider
            value={{
                currentUser, 
                currentDmUser,
                currentDmMessages,
                userMap, 
                userList,
                dmChannelMap, 
                dmChannelList, 
                groupChannelMap, 
                groupChannelList, 
                deletedChannelList, 
                channelIndex, 
                hederaClient, 
                myMessages,
                chatSocket,
                dataSocket,
                userDms,
                unreadMsgs,
                setCurrentUser,
                setCurrentDmUser,
                setCurrentDmMessages,
                resetCurrentDmMessages,
                setChatSocket,
                setDataSocket,
                setMyMessages,
                setHederaClient,
                setUserMap,
                setUserList,
                setDmChannelMap,
                setDmChannelList,
                setGroupChannelMap,
                setGroupChannelList,
                setDeletedChannelList,
                setChannelIndexMax,
                setUserDms,
                setUnreadMsgs,
            }}
        >
            {children}
        </AppContext.Provider>
    )
 }

 export default AppContext;