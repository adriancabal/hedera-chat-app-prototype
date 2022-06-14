import { useState, useContext, useRef } from 'react';
import logo from '../logo.svg';
import { setUser } from "../redux/userSlice";
import { setUserList, setUserMap } from "../redux/usersSlice";
import { UserAction } from '../constants';
// import { useDispatch, useSelector } from 'react-redux';
import AppContext from "../AppContext";
import { TopicMessageSubmitTransaction } from "@hashgraph/sdk";
import { loginUser, newUser } from '../helper/MessageMaker';
import socketIOClient from "socket.io-client";
import { CHAT_SERVER_ENDPOINT} from '../constants';
import App from '../App';
// import { userMap, userList } from '../data';
// import SearchIcon from '@mui/icons-material/Search';
// const hederaContractId = process.env.REACT_APP_HEDERA_CHAT_CONTRACT_ID;


const Login = (props) => {
    // const dispatch = useDispatch();
    // const { setCurrentUser, hederaClient } = useContext(AppContext);
    // const dataSocket = props.dataSocket;
    // const myMessages = props.myMessages;
    // console.log("Login: myMessages: ", myMessages);
    // const hederaClient = props.hederaClient;
    const {dataSocket, setCurrentUser, hederaClient, setDmChannelList, chatSocket, setChatSocket, setMyMessages} = useContext(AppContext);
    // const setCurrentUser = props.setCurrentUser;
    const userList = props.userList;
    const userMap = props.userMap;
    // console.log("Login: userMap: " , userMap);
    // const hederaClient = useSelector((state) => state.user.hederaClient);
    // const userList = useSelector((state) => state.users.userList);
    // const userMap = useSelector((state) => state.users.userMap);
    const [loginType, setLoginType]= useState("login");
    const [usernameInputValue, setUsernameInputValue] = useState("");
    const [passwordInputValue, setPasswordInputValue] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const modalColor = loginType === "login" ? "bg-[blue]" : "bg-[green]";
    const userIdText = loginType === "login" ? "username" : "set Username";
    const passwordText = loginType === "login" ? "password" : "set Password";
    const buttonColor = loginType === "login" ? "bg-[#03bafc]" : "bg-[#03fc7f]";
    

    const onChangeUsernameInput = (username: string) => {
        setUsernameInputValue(username);
    }

    const onChangePasswordInput = (pw: string) => {
        setPasswordInputValue(pw);
    }

    const onClickSubmit = async() => {
        // alert("user: " + usernameInputValue +", pw: " + passwordInputValue );
        if(loginType === "login"){
            //call athenticate contract method
            authenticateUserLogin();

        }else if(loginType === "create"){
            //call add new user contract method
            const isUsernameAvailable = await checkUsernameAvailability();
            console.log("onClickSubmit: isUsernameAvailable: ", isUsernameAvailable);
            // if(!isUsernameAvailable){
            //     setErrorMessage("User already exists.")
            // }else {
            //     await createNewAccount();
            // }
        }
    }

    const authenticateUserLogin = async () => {
        console.log("authenticateUserLogin...");
        setIsLoading(true);
        //1. authenticate user
        // dataSocket.emit("authenticate", {user: usernameInputValue, pw: passwordInputValue, timestamp: new Date().getTime()});
        dataSocket.on("authenticate_response", async (response) => {
            console.log("authenticate_response: ", response);
            setIsLoading(false);
            if(response.isAuthorized){
                setCurrentUser(usernameInputValue);
                setErrorMessage("");
                setDmChannelList(response.userDmChannels);
                // const _chatSocket = socketIOClient(CHAT_SERVER_ENDPOINT, 
                //     {
                //     withCredentials: true, 
                //     extraHeaders: {
                //       "hedera-chat-message": "abcd",
                //     }
                //   }
                // );
                // setChatSocket(_chatSocket);
                
                // _chatSocket.on("get_init_msg_load_response", msgLoad => {
                //     console.log("chatSocketMessageLoadResponse: ", msgLoad);
                //     setMyMessages(msgLoad);
                //     setCurrentUser(usernameInputValue);
                //     setErrorMessage("");
                //     setDmChannelList(response.userDmChannels);


                // });
                // const initialMsgLoadData = {
                //     user: usernameInputValue,
                //     channels: response.userDmChannels,
                // };
                // console.log("emit: get_init_msg_load: ", initialMsgLoadData);
                // _chatSocket.emit("get_init_msg_load", initialMsgLoadData);

                // dataSocket.removeAllListeners("authenticate");
                if(!response.isCurrentlyLoggedIn){
                    let sendResponse = await new TopicMessageSubmitTransaction({
                            topicId: "0.0.34717180",
                            message: loginUser(usernameInputValue),
                        })
                        .execute(hederaClient);
                    const getReceipt = await sendResponse.getReceipt(hederaClient);
                    console.log("receiptStatus: " + getReceipt.status);
                    // let loginSuccessful = getReceipt.status._code === 22 ;
                }
            }
            else {
                
                setErrorMessage("Invalid credentials. Try again.");
            }
        });
        dataSocket.emit("authenticate", {user: usernameInputValue, pw: passwordInputValue, timestamp: new Date().getTime()});
    };

    // const authenticateUserLogin = async () => {
    //     console.log("authenticateUserLogin");
    //     console.log("!! : ", userMap );
    //     const user = userMap[usernameInputValue];
    //     console.log("user: ", user);
    //     console.log("user.pw: " + user.pw +", pwinput: " + passwordInputValue );
    //     if(user && user.pw === passwordInputValue){
    //         console.log("here!");
    //         let loginSuccessful = true;
    //         console.log("authenticating log in");
    //         if(!user.isLoggedIn){
    //             console.log("user is not yet logged in");
    //             let sendResponse = await new TopicMessageSubmitTransaction({
    //                 topicId: "0.0.34717180",
    //                 message: loginUser(usernameInputValue),
    //             })
    //             .execute(hederaClient);
    //             const getReceipt = await sendResponse.getReceipt(hederaClient);
    //             console.log("receiptStatus: " + getReceipt.status);
    //             loginSuccessful = getReceipt.status._code === 22 ;
    //         //    loginSuccessful = await sendDataTopicMessage(hederaClient, loginUser(user));
    //         }
    //         if(loginSuccessful) {
    //             console.log("login successful");
    //             // dispatch(setUser(usernameInputValue));
    //             setCurrentUser(usernameInputValue);
    //             setErrorMessage("");
    //         }
    //         // alert("logged in");
    //    }else {
    //         setErrorMessage("Invalid credentials. Try again.");
    //     }
    
    //     // const contractQuery = await new ContractCallQuery()
    //     //     .setGas(100000)
    //     //     .setContractId(hederaContractId)
    //     //     .setFunction(
    //     //         "authenticate", 
    //     //         new ContractFunctionParameters().addString(usernameInputValue).addString(passwordInputValue)
    //     //     )
    //     //     .setQueryPayment(new Hbar(1));
    
    //     // //Submit to a Hedera network
    //     // const getMessage = await contractQuery.execute(hederaClient);
    //     // const message = getMessage.getString(0);
    //     // // console.log("The contract message: authenticate? " + message);
    //     // // console.log("4. Balance after querying big file smartcontract: " + await getAccountBalance(myAccountId, client));
       
       
    //     // if(message === "success"){
    //     //     //call callback to show user dashboard
    //     //     props.setLoggedIn(true);
    //     //     setErrorMessage("");
    //     //     dispatch(setUser(usernameInputValue));
    //     //     alert("logged in");
    //     // }else {
    //     //     setErrorMessage("Invalid credentials. Try again.");
    //     // }
    // }

    const checkUsernameAvailability = async () => {
        setIsLoading(true);
        console.log("checkUsernameAvailability...");
        dataSocket.on("isUsernameAvailable_response", async (response) => {
            console.log("isUsernameAvailable_response: " + response);
            if(response === false){
                setIsLoading(false);
                setErrorMessage("User already exists.")
            }else {
                await createNewAccount();
            }
        });
        dataSocket.emit("isUsernameAvailable", usernameInputValue);
        // if(userMap[usernameInputValue]){
        //     return false;
        // }
        // return true;

        // const contractQuery = await new ContractCallQuery()
        //     .setGas(100000)
        //     .setContractId(hederaContractId)
        //     .setFunction(
        //         "isUserRegistered", 
        //         new ContractFunctionParameters().addString(usernameInputValue)
        //     )
        //     .setQueryPayment(new Hbar(1));
        // const getMessage = await contractQuery.execute(hederaClient);
        // const isUserRegistered = getMessage.getBool(0);
        // return isUserRegistered;

        
    }

    const createNewAccount = async () => {
        console.log("createNewAccount...");
        console.log("userMap: ", userMap);
        let sendResponse = await new TopicMessageSubmitTransaction({
            topicId: "0.0.34717180",
            message: newUser(usernameInputValue, passwordInputValue),
        })
        .execute(hederaClient);
        const getReceipt = await sendResponse.getReceipt(hederaClient);
        console.log("receiptStatus: " + getReceipt.status);
        const createNewAccountSuccess = getReceipt.status._code === 22 ;
        console.log("getReceiptStatusTypeOf: ", getReceipt.status);
        // const isSuccess = await sendDataTopicMessage(hederaClient, );
        setIsLoading(false);
        if(createNewAccountSuccess){
            console.log("createNewAccountSuccess!");
            // if(!userMap[usernameInputValue]){
            //     console.log("new user doesn't exist in userMap");
            //     // let userMapTemp = {...userMap};
            //     userMap[usernameInputValue] = {
            //         pw: passwordInputValue, 
            //         channels: [],
            //         isLoggedIn: false,
            //     };
            //     // let userListTemp = [...userList];
            //     userList.push(usernameInputValue);
            //     // dispatch(setUserMap(userMapTemp));
            //     // dispatch(setUserList(userListTemp));
            // }
            console.log("finalize createNewAccountSuccess");
            props.setNewAccountCreated(true);
            setLoginType("login");
            setUsernameInputValue('');
            setPasswordInputValue('');
            setErrorMessage("");
        }

        // const contractExecTx= await new ContractExecuteTransaction()
        //     .setContractId(hederaContractId)
        //     .setGas(100000)
        //     .setFunction(
        //         "addUser", 
        //         new ContractFunctionParameters().addString(usernameInputValue).addString(passwordInputValue)
        //     );
        // const submitExecTx = await contractExecTx.execute(hederaClient);
        // const receipt = await submitExecTx.getReceipt(hederaClient);

        // // If receipt.status is SUCCESS, proceed to dashboard with the newly created account
        // if(receipt.status.toString() === "SUCCESS"){
        //     props.setNewAccountCreated(true);
        //     setLoginType("login");
        // }
    }

    const onClickBottomLink = () => {
        console.log("onClickBottomLink-userMap: ", userMap);
        if(loginType === "login"){
            setLoginType("create");
            props.setNewAccountCreated(false);
        }else {
            setLoginType("login");
        }
        setUsernameInputValue('');
        setPasswordInputValue('');
        setErrorMessage('');
    }

    return (
        <div className={`flex flex-col ${modalColor} h-96 w-96 rounded-xl`}>
            {   isLoading &&
                <img src={logo} className="App-logo" alt="logo" />
            }

            {
            !isLoading &&
            <>
            <p className='self-center text-3xl text-white mt-8'>
                {loginType === "login" ? "Login" : "New User"}
            </p>

            {/* Inputs */}
            
            
            
            
            {/* username */}
            <div className='flex flex-row self-center mt-8'>
                {/* <div className='flex flex-col  justify-center mr-3'>
                    <p className='text-white'>{userIdText}</p>
                </div> */}
                
                <input
                    autoComplete={"off"}
                    className=' w-64 h-12 bg-white mt'
                    type="text" 
                    name="name" 
                    placeholder={loginType === "login" ? "username" : "new username"}
                    value={usernameInputValue}
                    onChange={e => {
                        onChangeUsernameInput(e.target.value);
                    }}
                />
            </div>

            {/* password */}
            <div className='flex flex-row self-center mt-8 mb-5'>
                {/* <div className='flex flex-col  justify-center mr-3'>
                    <p className='text-white'>{passwordText}</p>
                </div> */}
                
                <input
                    autoComplete={"off"}
                    className=' w-64 h-12 bg-white mt'
                    type={"password"}
                    name="name" 
                    placeholder={loginType === "login" ? "password" : "new password"}
                    value={passwordInputValue}
                    onChange={e => {
                        onChangePasswordInput(e.target.value);
                    }}
                />
            </div>

            {/* Error message */}
            <div className='self-center'>
                <p className='text-[red] text font-bold'>
                    {errorMessage}
                </p>
            </div>

            {/* Submit Button */}
            <button 
                className={`self-center ${buttonColor} h-10 w-48 mt-5`}
                onClick={()=>{onClickSubmit()}}
            
            >
                {loginType === "login" ? "Login" : "Create New Account"}
            </button>


            {/* Bottom Link suggestion */}
            <div className='flex flex-row self-center mt-5 mr-6'>
                <p className='text-white'>
                    {loginType === "login" ? "New user?" : "Already have an existing account?"}
                </p>
                <p 
                    className='text-white font-bold ml-2 hover:cursor-pointer'
                    onClick={()=> onClickBottomLink()}
                >
                     {loginType === "login" ? "Create an account" : "Log In"}
                    
                </p>
            </div>

            </>

            }
            
        </div>
    )
}

export default Login;

