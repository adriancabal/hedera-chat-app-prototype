import AllMessages from "./MainWindowComponents/AllMessages";
import AddDM from "./MainWindowComponents/AddDM";
import ChatWindow from "./MainWindowComponents/ChatWindow";
// import AppContext from "../../AppContext";

const MainWindow = (props) => {
    const mainWindow = props.mainWindow;
    const setMainWindow = props.setMainWindow;
    const currentDmUser = props.currentDmUser;
    // const setCurrentDmUser = props.setCurrentDmUser;
    // const myMessages = props.myMessages;
    // const setMyMessages = props.setMyMessages;
    // const chatSocket = props.chatSocket;
    console.log("mainWindowInnerWidth: " + window.innerWidth);
    const defaultMainWindowWidth = mainWindow ? `w-[${window.innerWidth}px]` : "w-0";
    return(
        <div className={`flex flex-auto flex-col bg-[#343d33] h-full md:w-4/5 ${defaultMainWindowWidth}`}>
            {/* All Messages */}
            {
                mainWindow === "all" && <AllMessages />
            }
            

            {/* Add DM */}
            {
               mainWindow === "addDM" && <AddDM setMainWindow={props.setMainWindow} />
            }   
            {/* Add Group */}

            {/* Chat Window */}
            {
                mainWindow === "chatDM" && <ChatWindow currentDmUser={currentDmUser} setMainWindow={setMainWindow}/>
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