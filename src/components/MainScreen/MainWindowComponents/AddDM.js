import { useState, useEffect, useRef, useContext } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CircleIcon from '@mui/icons-material/Circle';
import AppContext from "../../../AppContext";
// import { userList, userMap } from "../../../data";

const AddDM = (props) => {
    const { currentUser, dataSocket, userList, userMap } = useContext(AppContext);
    const [searchInputValue, setSearchInputValue] = useState("");
    const [allUsers, setAllUsers] = useState([]);
    const [dmUserList, setDmUserList] = useState(allUsers);
    const [offlineUserColor, setOfflineUserColor] = useState([null]);
    const setMainWindow = props.setMainWindow;
    const setCurrentDmUser = props.setCurrentDmUser;

    useEffect(() => {
        console.log("AddDM useeffect");
        
        dataSocket.emit("getAllUsers", currentUser);
        dataSocket.on("getAllUsers_response", allUsersList => {
            console.log("AddDM: getAllUsers_response: ", allUsersList);
            setDmUserList(allUsersList);
            setAllUsers(allUsersList);
            // const dmUsers = JSON.parse(response).myDms;
            // console.log("getDMUsers_response: ", dmUsers );
            // setUserDms(response);
            
            // dataSocket.removeAllListeners("getDMUsers_response");
        });
        
    }, []);

    const onChangeSearchInput = (value) => {
        setSearchInputValue(value);
        findRelatedUsers(value);

    }

    const findRelatedUsers = (value) => {
        const relevantUserList = [];
        console.log("dmUserList: ", dmUserList);
        allUsers.forEach(dmUser => {
            if(dmUser.user.startsWith(value)){
                relevantUserList.push(dmUser);
            }
        });
        console.log("relevantUserList: ", relevantUserList);
        setDmUserList(relevantUserList);
    };

    const getArrayReversed = (array) =>{
        return [...array].reverse();
    }

    const onClickUser = (user) => {
        // const userDmChannels = userMap[user].dms;
        // check if DM is already established with selected user
        // let isDmEstablished = false;
        // userDmChannels.forEach(dm => {
        //     if(dm[0] === user){
        //         isDmEstablished = true;
        //     }
        // });
        setCurrentDmUser(user);
        setMainWindow('chatDM');
        // open chat window
    }

    return ( 
        <div 
            className="flex flex-col h-full w-full]"
            // onFocus={(e) => {
            //     console.log('Focused on input');
            //     dataSocket.emit("getAllUsers", currentUser);
            //     dataSocket.on("getAllUsers_response", allUsersList => {
            //         console.log("AddDM: getAllUsers_response: ", allUsersList);
            //         setDmUserList(allUsersList);
            //     });
            // }}
        >
            {/* Search for DMs */}
            <div className="flex flex-row w-full h-14 bg-[#292a33] justify-center border-y-[1px] border-[gray] text-white">
                <div className='flex h-10 w-10 bg-[#292a33] justify-center self-center rounded-l-md border-[1px] border-[gray]'>
                    <SearchIcon className='text-white self-center' />
                </div>
                <input
                    autoComplete={"off"}
                    className='w-72 h-10 bg-[gray] mt self-center rounded-r-md focus:outline-none pl-2 search-input-placeholder '
                    type="text" 
                    name="name" 
                    placeholder={" Search Direct Message"}
                    value={searchInputValue}
                    onChange={e => {
                        onChangeSearchInput(e.target.value);
                    }}
                />
            </div>

            {/* List of Users */}
            <div className='flex flex-col grow w-full Scrollbar scrollbar-dark-gray bg-[#292a33]'>
                    {getArrayReversed(dmUserList).map((user) => {
                        // let offlineUserColor = "text-[#292a33]";
                        // const setOfflineUserColor = () => {
                        //     offlineUserColor = "text-[white]";
                        //     return "bg-[#292a33]";
                        // }
                        const isUserOnline = user.isLoggedIn;
                        // const isUserOnline = userMap[user].isLoggedIn;
                        const userColor =  isUserOnline ? "text-[#0be633]" : offlineUserColor[0] === user.user ? "text-[white]" : "text-[#292a33]";
                        const onMouseEnterOfflineUser = () => {
                            if(!isUserOnline){
                                setOfflineUserColor([user.user, "text-[white]"]);
                            }
                        }
                        const onMouseLeaveOfflineUser = () => {
                            setOfflineUserColor([null])
                        }
                        
                        return (
                            <div 
                                className={`flex flex-row h-10 w-full bg-[gray] border-b-[1px] border-[black] hover:cursor-pointer hover:bg-[#292a33]`}
                                onMouseEnter={() => onMouseEnterOfflineUser()}
                                onMouseLeave={() => onMouseLeaveOfflineUser()}
                                onClick={()=> {onClickUser(user)}}
                            >
                                <div className='flex flex-col w-8 justify-center '>
                                    <CircleIcon className={`self-center ${userColor}`} fontSize=''/>
                                </div>
                                <p className={`self-center font-bold ${userColor} `}>{user.user}</p>
                            </div>
                        )
                       
                    }   
                    )}
            </div>


        </div>
    );
}

export default AddDM;