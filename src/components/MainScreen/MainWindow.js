import AllMessages from "./MainWindowComponents/AllMessages";
import AddDM from "./MainWindowComponents/AddDM";
import ChatWindow from "./MainWindowComponents/ChatWindow";
// import AppContext from "../../AppContext";

const MainWindow = (props) => {
    const mainWindow = props.mainWindow;
    const currentDmUser = props.currentDmUser;
    const setCurrentDmUser = props.setCurrentDmUser;
    // const myMessages = props.myMessages;
    // const setMyMessages = props.setMyMessages;
    // const chatSocket = props.chatSocket;

    return(
        <div className='flex flex-col bg-[#343d33] h-full w-4/5'>
            {/* All Messages */}
            {
                mainWindow === "all" && <AllMessages />
            }
            

            {/* Add DM */}
            {
               mainWindow === "addDM" && <AddDM setMainWindow={props.setMainWindow} setCurrentDmUser={setCurrentDmUser} />
            }   
            {/* Add Group */}

            {/* Chat Window */}
            {
                mainWindow === "chatDM" && <ChatWindow currentDmUser={currentDmUser}/>
                // mainWindow === "chatDM" && <ChatWindow chatSocket={chatSocket} currentDmUser={currentDmUser} myMessages={myMessages} setMyMessages={setMyMessages}/>
            }
            {/* <div className='flex w-full h-[650px] bg-transparent'>

            </div>

            <div className='flex w-full h-[80px] bg-[#5e6e5c] rounded-xl'>

            </div> */}
        </div>
    )
}

export default MainWindow;