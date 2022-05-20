import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from "../redux/userSlice";
import SideBar from './SideBar';
import '../App.css';
import { Client, TopicMessageSubmitTransaction} from "@hashgraph/sdk";
import { logoutUser } from '../helper/MessageMaker';
import { sendDataTopicMessage } from '../helper/topicMessageSender';

// const hederaContractId = process.env.REACT_APP_HEDERA_CHAT_CONTRACT_ID;

const MainChatScreen = (props) => {
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user.currentUser);
    const hederaClient = useSelector((state) => state.user.hederaClient);

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
        // console.log("logoutSuccessful: ", logoutSuccessful);
        if(logoutSuccessful){
            dispatch(setUser(""));
        }
    }

    const chatScreenColor = "bg-[#292a33]";
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
                <SideBar />

                {/* Chat Room Window */}
                <div className='flex flex-col bg-[#343d33] h-full w-4/5'>
                    <div className='flex w-full h-[650px] bg-transparent'>

                    </div>

                    <div className='flex w-full h-[80px] bg-[#5e6e5c] rounded-xl'>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainChatScreen;