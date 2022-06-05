import { useDispatch, useSelector } from 'react-redux';
import { useState, useContext, useEffect } from 'react';
import '../../App.css';
import AppContext from "../../AppContext";
// import { userMap, userList, groupChannelList, groupChannelMap } from '../../data';
import AddIcon from '@mui/icons-material/Add';
import CircleIcon from '@mui/icons-material/Circle';
// import { set } from 'immer/dist/internal';
// const mockUsers = ["user1", "user2", "user3", "user4", "user5", "user6", "user7", "user8", "user9", "user10", "user11", "user12", "user13", "user14", "user15", "user16", "user17", "user18", "user19", "user20", "user21", "user22", "user23", , "user24", "user25", "user26", "user27"];

const SideBar = (props) => {
    const {currentUser, dataSocket, userDms, setUserDms, myMessages} = useContext(AppContext);
    // const currentUser = "user1";
    const userMap ={};
    // const user = useSelector((state) => state.user.currentUser);
    const setMainWindow = props.setMainWindow;
    const setCurrentDmUser = props.setCurrentDmUser;
    // const myMessages = props.myMessages;
    console.log("Sidebar: myMessages: ", myMessages);
    // const [userDms, setUserDms] = useState([]);
    // const [_userMap, setUserMap] = useState(userMap);
    // const [userDms, setUserDms] = useState(userMap[currentUser] ? userMap[currentUser].dms.map(dm => dm[0]) : []) ;


    useEffect(() => {
        console.log("Sidebar useeffect");
        
        dataSocket.emit("getDmUsers", currentUser);
        dataSocket.once("getDMUsers_response", response => {
            // console.log("Sidebar: getDMUsers_response1: "+ response);
            console.log("Sidebar: getDMUsers_response: ", response);
            // const dmUsers = JSON.parse(response).myDms;
            // console.log("getDMUsers_response: ", dmUsers );
            setUserDms(response);
            
            // dataSocket.removeAllListeners("getDMUsers_response");
        });
        
    }, [currentUser]);

    const onClickAddDM = () => {
        setCurrentDmUser(null);
        setMainWindow("addDM");
    }

    const onClickDmUser = (dmUser) => {
        setCurrentDmUser(dmUser)
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
                                {  myMessages[user.channel] && myMessages[user.channel].unread &&
                                    <div className='circle self-center ml-5 justify-center'>
                                        <p className='self-center text-white font-bold text-sm'>
                                            {`${myMessages[user.channel].unread}`}
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