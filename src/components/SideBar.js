import { useDispatch, useSelector } from 'react-redux';
import '../App.css';
import { userMap, userList, groupChannelList, groupChannelMap } from '../data';
const mockUsers = ["user1", "user2", "user3", "user4", "user5", "user6", "user7", "user8", "user9", "user10", "user11", "user12", "user13", "user14", "user15", "user16", "user17", "user18", "user19", "user20", "user21", "user22", "user23", , "user24", "user25", "user26", "user27"];

const SideBar = () => {
    const user = useSelector((state) => state.user.currentUser);
    
    return (
        <div className='flex-col hbg-[red] h-full w-1/5 Scrollbar custom-scrollbar' >
            {/* Direct Messages */}
            <div className='flex-col justify-center'>
                <div className=' flex flex-row h-12 justify-center bg-[black]'>
                    <p className='self-center text-white text-sm'>{"Direct Messages"}</p>
                </div>
            
                {
                    userList.map(user => 
                        <div className='flex h-10 border-2 border-black bg-[blue] justify-center'>
                            <p className='self-center'>{user}</p>
                        </div>
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