import { useDispatch, useSelector } from 'react-redux';
import { useState, useContext, useEffect } from 'react';
import '../../App.css';
import AppContext from "../../AppContext";
import AddIcon from '@mui/icons-material/Add';
import CircleIcon from '@mui/icons-material/Circle';

const SideBar = (props) => {
    const {currentUser, dataSocket, userDms, setUserDms, myMessages, unreadMsgs, setUnreadMsgs, currentDmUser, setCurrentDmUser} = useContext(AppContext);
    const userMap ={};
    const setMainWindow = props.setMainWindow;
    console.log("Sidebar: myMessages: ", myMessages);


    useEffect(() => {
        console.log("Sidebar useeffect");
        
        dataSocket.emit("getDmUsers", currentUser);
        dataSocket.once("getDMUsers_response", response => {
            // console.log("Sidebar: getDMUsers_response1: "+ response);
            console.log("Sidebar: getDMUsers_response: ", response);
            setUserDms(response);
            
            // dataSocket.removeAllListeners("getDMUsers_response");
        });
        
    }, [currentUser]);

    const onClickAddDM = () => {
        setCurrentDmUser(null);
        setMainWindow("addDM");
    }

    const onClickDmUser = (dmUser) => {
        // if(dmUser.user !== currentDmUser.user){

        // }
        let _unreadMsgs = {...unreadMsgs};
        if(_unreadMsgs[dmUser.channel]){
            _unreadMsgs[dmUser.channel] = 0;
        }
        setUnreadMsgs(_unreadMsgs);
        
        setCurrentDmUser(dmUser);
        console.log("sideBar: setCurrentDmUser: ", dmUser);
        setMainWindow("chatDM");

    }
    // const onClickDMAddmary
    return (
        <div className='flex-col  h-full w-1/5 Scrollbar custom-scrollbar' >

            {/* All Messages */}
            <div 
                className=' flex flex-row h-12 justify-center bg-[black] border-y-[1px] border-[gray] hover:cursor-pointer hover:bg-[#292a33]'
                onClick={() => setMainWindow("all")}
            >
                    <p className='self-center text-white text-sm'>{"All Messages"}</p>
                </div>
            {/* <div className='flex-col justify-center'>

            </div> */}
            {/* Direct Messages */}
            <div className='flex-col justify-center'>
                <div className='flex flex-row h-10 bg-[black]'>
                    <p className='self-center ml-6 text-white text-sm'>{"Direct Messages"}</p>
                    <div 
                        className='flex ml-4 text-white self-center h-full w-9 justify-center hover:bg-[#292a33] hover:cursor-pointer'
                        onClick={() => onClickAddDM()}
                    >
                        <AddIcon className='self-center' color='white'/>
                    </div>
                    
                    {/* <svg data-testid="AddIcon"></svg> */}
                </div>
            
                {
                    userDms.map(user => {
                        console.log("userDms.map: ", user);
                        const userColor =  user.isLoggedIn ? "text-[#0be633]" : "text-[gray]";
                        // const userColor =  userMap[user].isLoggedIn ? "text-[#0be633]" : "text-[gray]";
                        return(

                        
                            <div 
                                className='flex flex-row h-10 border-2 border-black bg-[#292a33] justify-center hover:cursor-pointer'
                                onClick={() => onClickDmUser(user)}
                            >   
                                <div className='flex flex-col w-8 justify-center '>
                                        <CircleIcon className={`self-center ${userColor}`} fontSize=''/>
                                    </div>
                                <p className='self-center text-white'>{user.user}</p>
                                {/* {  myMessages[user.channel] && myMessages[user.channel].unread && */}
                                {unreadMsgs[user.channel] &&
                                    <div className='circle self-center ml-5 justify-center'>
                                        <p className='self-center text-white font-bold text-sm'>
                                            {`${unreadMsgs[user.channel] }`}
                                            {/* {"9+"} */}
                                        </p>
                                    </div>
                                }
                                {!unreadMsgs[user.channel] &&
                                    <div className='noNewMessage self-center ml-5 justify-center'>
                                        <p className='self-center text-white font-bold text-sm'>
                                            {/* {`${unreadMsgs[user.channel] }`} */}
                                            {/* {"9+"} */}
                                        </p>
                                    </div>
                                }
                                
                            </div>
                        )
                        
                        }
                    )
                }
            </div>

            {/* Group Channels */}
            <div className='flex-col justify-center'>
                <div className=' flex flex-row h-12 justify-center bg-[black]'>
                    <p className='self-center text-white text-sm'>{"Group Channels"}</p>
                </div>
            
                {/* {
                    userList.map(user => 
                        <div className='flex h-10 border-2 border-black bg-[blue] justify-center'>
                            <p className='self-center'>{user}</p>
                        </div>
                    )
                } */}
            </div>
        </div>
    )
}

export default SideBar;