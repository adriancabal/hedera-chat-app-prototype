import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../App.css';
import { ContractCallQuery, ContractExecuteTransaction, ContractFunctionParameters, Hbar } from "@hashgraph/sdk";
// import SearchIcon from '@mui/icons-material/Search';
const hederaContractId = process.env.REACT_APP_HEDERA_CHAT_CONTRACT_ID;

const mockUsers = ["user1", "user2", "user3", "user4", "user5", "user6", "user7", "user8", "user9", "user10", "user11", "user12", "user13", "user14", "user15", "user16", "user17", "user18", "user19", "user20", "user21", "user22", "user23", , "user24", "user25", "user26", "user27"];

const MainChatScreen = (props) => {
    const hederaContractId = useSelector((state) => state.user.smartContractId);
    const user = useSelector((state) => state.user.currentUser);

    const chatScreenColor = "bg-[purple]";
    return(
        <div className={`flex flex-row ${chatScreenColor} h-full w-[1000px] rounded-xl`}>

            {/* sidebar */}
            <div className='flex-col hbg-[red] h-full w-1/5 Scrollbar custom-scrollbar' >
                {
                    mockUsers.map(user => 
                        <div className='h-12 border-2 border-black bg-[blue]'>
                            {user}
                        </div>
                    )

                }
                {/* <ul className='flex flex-col w-96 bg-[red] justify-content'>
                    {
                        mockUsers.map(user => 
                        <li className='h-10 border-2 border-black'>{user}</li>)
                    }
                </ul> */}
                
            </div>

            {/* Chat Room Window */}
            <div className='flex flex-col bg-[#343d33] h-full w-4/5'>
                <div className='flex w-full h-[650px] bg-transparent'>

                </div>

                <div className='flex w-full h-[80px] bg-[#5e6e5c]'>

                </div>
            </div>
        </div>
    )
}

export default MainChatScreen;