import './App.css';
import Login from './components/Login';
import MainChatScreen from './components/MainChatScreen';
import { useContext, useEffect, useState, useCallback } from 'react';
import { Client, PrivateKey, AccountId} from "@hashgraph/sdk";
import io from "socket.io-client";
import AppContext from './AppContext';

// Particles Import
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import particlesOptions from "./particles.json";

// const ENDPOINT = "http://localhost:8787";
// const ENDPOINT = "http://192.168.0.59:8880"; //for connect mobile device to desktop localhost
// const ENDPOINT = "http://localhost:8880";
const ENDPOINT = "https://pacific-spire-35776.herokuapp.com/";
let client = null;
const WINDOW_WIDTH = window.innerWidth;
const WINDOW_HEIGHT = window.innerHeight;

const App = () => {
  const {setHederaClient, currentDmUser, gunDb, gunHederaChatUsers} = useContext(AppContext);
  const { currentUser, setDataSocket} = useContext(AppContext);
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [isNewAccountCreated, setNewAccountCreated] = useState(false);
  const handleResize = () => {
    console.log("handleResize");
    setWindowWidth("w-[" + window.screen.width + "px]");
    setWindowHeight("h-[" + window.screen.height + "px]");
  }
  
  useEffect(() => {
    gunDb.get('hca-adrian').get('unread').once(node => {
      console.log("hca-adrian-unread: ", node);
    })
    window.addEventListener("resize", handleResize);
    setWindowWidth("w-[" + (window.screen.width - 20) + "px]");
    setWindowHeight("h-[" + window.screen.height + "px]");

    const myAccountId = process.env.REACT_APP_MY_ACCOUNT_ID;
    const myPrivateKey = process.env.REACT_APP_MY_PRIVATE_KEY;
    if (myAccountId == null ||
        myPrivateKey == null ) {
        throw new Error("Environment variables myAccountId and myPrivateKey must be present");
    }

    // Establish client connection
    client = Client.forTestnet();
    client.setOperator(AccountId.fromString(myAccountId) ,PrivateKey.fromString(myPrivateKey));
    setHederaClient(client);
    const _dataSocket = io(ENDPOINT, {transports: ['websocket', 'polling', 'flashsocket']});
    setDataSocket(_dataSocket);

  }, []);
  
  const bodyMarginTop = currentUser ? "mt-0" : "mt-16 md:mt-0";
  const mdWindowHeight = "md:" + windowHeight;
  const mainViewWidth = !!currentUser ? "w-screen" : "w-[350px]";

  const particlesInit = useCallback(main => {
    loadFull(main);
  }, []);

  return (
    <div className={`flex flex-col w-screen h-screen md:h-[1200px]`}>
        {/* <video  class="lazy" autoPlay loop muted playsInline id='video' >
          <source src={blockchainVideo}  type={'video/mp4'}/>
        </video> */}
        <Particles options={particlesOptions} init={particlesInit} />

      { ((currentDmUser && Object.keys(currentDmUser).length === 0)
        || (currentDmUser && Object.keys(currentDmUser).length > 0 && window.innerWidth >= 640)) &&
        <div className={`flex flex-col mt-8 sm:mt-16 sm:mb-16 mb-0 h-20 justify-center `}>
          <p className="text-center text-white text-4xl md:text-6xl">
            Hash Chat
          </p>
          <p className="text-center text-white text-md md:text-xl mt-2">
            powered by Hedera Hashgraph
          </p>
        </div>
      }
      {
        !!!currentUser && isNewAccountCreated &&
        <p className='text-[#03fc6f] font-bold text-3xl text-center'>Account Created Successfully!</p>
      }
      <div className={`flex flex-1  ${bodyMarginTop}  justify-center h-full md:h-[800px]  sm:w-[640px] md:w-[768px] lg:w-[1024px] ${mainViewWidth} self-center`}>
        
        { 
          !!currentUser 
          ? <MainChatScreen />
          : <Login setNewAccountCreated={setNewAccountCreated}/>
        }
      </div>
    </div>
  );
}

export default App;






