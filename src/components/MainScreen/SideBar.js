import { useDispatch, useSelector } from 'react-redux';
import { useState, useContext, useEffect } from 'react';
import '../../App.css';
import AppContext from "../../AppContext";
import AddIcon from '@mui/icons-material/Add';
import CircleIcon from '@mui/icons-material/Circle';
const WINDOW_WIDTH = window.innerWidth;

const SideBar = (props) => {
    const {currentUser, currentDmUser, dataSocket, userDms, setUserDms, myMessages, unreadMsgs, setUnreadMsgs, setCurrentDmUser} = useContext(AppContext);
    const {typingStatus, gunDb, gunHederaChatUsers} = useContext(AppContext);
    const mainWindow = props.mainWindow;
    const setMainWindow = props.setMainWindow;
    console.log("Sidebar: myMessages: ", myMessages);


    useEffect(() => {
        console.log("Sidebar useeffect");
        
        dataSocket.emit("getDmUsers", currentUser);
        dataSocket.once("getDMUsers_response", response => {
            // console.log("Sidebar: getDMUsers_response1: "+ response);
            console.log("Sidebar: getDMUsers_response: ", response);
            setUserDms(response);

            
            // get unreads of dmUsers from gun and update it 
            const gunCurrentUser = gunDb.get(`hca-${currentUser}`);
            gunCurrentUser.get("unread").once((node)=>{
                console.log("sideBarGunCurrentUser: ", node);
                const unreads = node;
                let _unreadMsgs = {...unreadMsgs}; 
                let isUnreads = false;
                if(unreads){
                    for(let i=0;i<response.length; i++){
                        if(typeof unreads[response[i].user] === "number" 
                            && unreads[response[i].user] > 0) {
                                _unreadMsgs[response[i].channel] = unreads[response[i].user];  
                                isUnreads = true;
                        }
                    }
                    if(isUnreads){
                        setUnreadMsgs(_unreadMsgs);
                    }
                }
            });

            // listen to changes in login status of all added users
            for(let i=0;i<response.length; i++){
                let userid = `hca-${response[i].user}`;
                console.log(`userid${i}:` + userid);
                let gunUser = gunDb.get(userid);
                gunUser.on((node) => {
                    let _userDms = [...response];
                    const _userId = node.userid;
                    const _isLoggedIn = node.isLoggedIn;
                    for(let j=0; j<_userDms.length; j++){
                        if(_userDms[j].user === _userId){
                            _userDms[j].isLoggedIn = _isLoggedIn;
                            if(currentDmUser && currentDmUser.user === _userId){
                                setCurrentDmUser(_userDms[j]);
                            }
                            break;
                        }
                    }
                    setUserDms(_userDms);
                });
            }
            
            // dataSocket.removeAllListeners("getDMUsers_response");
        });
        
    }, [currentUser]);

    // useEffect(() => {
    //     let gunUser = gunUsers.get("user2");

    //     gunUser.on((node) => {
    //         let _userDms = [...userDms];
    //         const _userId = node.userId;
    //         const _isLoggedIn = node.isLoggedIn;
    //         for(let j=0; j<_userDms.length; j++){
    //             if(_userDms[j].user === _userId){
    //                 _userDms[j].isLoggedIn = _isLoggedIn;
    //                 if(currentDmUser && currentDmUser.user === _userId){
    //                     setCurrentDmUser(_userDms[j]);
    //                 }
    //                 break;
    //             }
    //         }
    //         setUserDms(_userDms);
    //     });
    // }, [userDms])

    const onClickAddDM = () => {
        setCurrentDmUser(null);
        setMainWindow("addDM");
    }

    const onClickDmUser = (dmUser) => {
        // if(dmUser.user !== currentDmUser.user){

        // }
        let _unreadMsgs = {...unreadMsgs};
        if(_unreadMsgs[dmUser.channel]){
            _unreadMsgs[dmUser.channel] = undefined;
        }
        setUnreadMsgs(_unreadMsgs);
        
        setCurrentDmUser(dmUser);
        console.log("sideBar: setCurrentDmUser: ", dmUser);
        setMainWindow("chatDM");

    }

    // console.log("Sidebar-dmUserUnreadMsgs: " + unreadMsgs["user2"]);
    // const onClickDMAddmary
    const windowWidth = WINDOW_WIDTH;
    const windowWidthStyle = "w-[" + windowWidth + "px]";
    const defaultSideBarWidth = mainWindow ? "w-0" : "w-full";
    return (
        <div className={`flex-col flex-none  h-full sm:w-1/5 ${defaultSideBarWidth} Scrollbar custom-scrollbar`} >

            {/* All Messages */}
            {/* <div 
                className=' flex flex-row h-12 justify-center bg-[black] border-y-[1px] border-[gray] hover:cursor-pointer hover:bg-[#292a33]'
                onClick={() => setMainWindow("all")}
            >
                <p className='self-center text-white text-sm'>{"All Messages"}</p>
            </div> */}
            {/* <div className='flex-col justify-center'>

            </div> */}
            {/* Direct Messages */}
            <div className='flex-col justify-center'>
                <div className='flex flex-row h-10 bg-[black] justify-center'>
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
                                {unreadMsgs[user.channel] && unreadMsgs[user.channel] > 0 && !typingStatus[user.user] &&
                                    <div className='circle self-center ml-5 justify-center'>
                                        <p className='self-center text-white font-bold text-sm'>
                                            {unreadMsgs[user.channel]}
                                        </p>
                                    </div>
                                }
                                {!unreadMsgs[user.channel] && !typingStatus[user.user] &&
                                    <div className='noNewMessage self-center ml-5 justify-center'>
                                        <p className='self-center text-white font-bold text-sm'>
                                      
                                        </p>
                                    </div>
                                }
                                {/* typing status */}
                                {typingStatus[user.user] &&
                                    <div className='noNewMessage self-center ml-5 justify-center'>
                                        <p className='self-center text-[#3edced] font-bold text-sm'>
                                            {"typing..."}
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