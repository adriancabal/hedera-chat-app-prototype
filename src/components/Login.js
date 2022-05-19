import { useState, useEffect, useRef } from 'react';
import { setUser } from "../redux/userSlice";
import { setUserList, setUserMap } from "../redux/usersSlice";
import { sendDataTopicMessage } from '../helper/topicMessageSender';
import { UserAction } from '../constants';
import { useDispatch, useSelector } from 'react-redux';

import { ContractCallQuery, ContractExecuteTransaction, ContractFunctionParameters, Hbar, TopicMessageSubmitTransaction } from "@hashgraph/sdk";
// import SearchIcon from '@mui/icons-material/Search';
const hederaContractId = process.env.REACT_APP_HEDERA_CHAT_CONTRACT_ID;


const Login = (props) => {
    const dispatch = useDispatch();
    const hederaClient = useSelector((state) => state.user.hederaClient);
    const userList = useSelector((state) => state.users.userList);
    const userMap = useSelector((state) => state.users.userMap);
    const [loginType, setLoginType]= useState("login");
    const [usernameInputValue, setUsernameInputValue] = useState("");
    const [passwordInputValue, setPasswordInputValue] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

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
            const isUserRegistered = await checkUsernameAvailability();
            console.log("isUserRegistered: " + isUserRegistered);
            if(isUserRegistered){
                setErrorMessage("User already exists.")
            }else {
                await createNewAccount();
            }
        }
    }

    const authenticateUserLogin = async () => {
    //     if(userMap[usernameInputValue] && userMap[usernameInputValue].pw === passwordInputValue){
    //         props.setLoggedIn(true);
    //         setErrorMessage("");
    //         dispatch(setUser(usernameInputValue));
    //         // alert("logged in");
    //    }else {
    //         setErrorMessage("Invalid credentials. Try again.");
    //     }
    
        const contractQuery = await new ContractCallQuery()
            .setGas(100000)
            .setContractId(hederaContractId)
            .setFunction(
                "authenticate", 
                new ContractFunctionParameters().addString(usernameInputValue).addString(passwordInputValue)
            )
            .setQueryPayment(new Hbar(1));
    
        //Submit to a Hedera network
        const getMessage = await contractQuery.execute(hederaClient);
        const message = getMessage.getString(0);
        // console.log("The contract message: authenticate? " + message);
        // console.log("4. Balance after querying big file smartcontract: " + await getAccountBalance(myAccountId, client));
       
       
        if(message === "success"){
            //call callback to show user dashboard
            props.setLoggedIn(true);
            setErrorMessage("");
            dispatch(setUser(usernameInputValue));
            alert("logged in");
        }else {
            setErrorMessage("Invalid credentials. Try again.");
        }
    }

    const checkUsernameAvailability = async () => {
        console.log("checkUsernameAvailability...");
        
        const contractQuery = await new ContractCallQuery()
            .setGas(100000)
            .setContractId(hederaContractId)
            .setFunction(
                "isUserRegistered", 
                new ContractFunctionParameters().addString(usernameInputValue)
            )
            .setQueryPayment(new Hbar(1));
        const getMessage = await contractQuery.execute(hederaClient);
        const isUserRegistered = getMessage.getBool(0);
        return isUserRegistered;

        // if(userMap[usernameInputValue]){
        //     return false;
        // }
        // return true;
    }

    const createNewAccount = async () => {
        console.log("createNewAccount...");
        // const addUserMessage = {
        //     type: UserAction.ADD_USER,
        //     user: usernameInputValue,
        //     pw: passwordInputValue,
        // };
        // const stringifiedNewUserMsg = JSON.stringify(addUserMessage);
        // const isSuccess = await sendDataTopicMessage(hederaClient, stringifiedNewUserMsg);

        // if(isSuccess){
        //     if(!userMap[usernameInputValue]){
        //         userMap[usernameInputValue] = {
        //             pw: passwordInputValue, 
        //             channels: [],
        //             isLoggedIn: false,
        //         };
        //         userList.push(usernameInputValue);
        //         dispatch(setUserMap(userMap));
        //         dispatch(setUserList(userList));
        //     }
        //     props.setNewAccountCreated(true);
        //     setLoginType("login");
        // }

        const contractExecTx= await new ContractExecuteTransaction()
            .setContractId(hederaContractId)
            .setGas(100000)
            .setFunction(
                "addUser", 
                new ContractFunctionParameters().addString(usernameInputValue).addString(passwordInputValue)
            );
        const submitExecTx = await contractExecTx.execute(hederaClient);
        const receipt = await submitExecTx.getReceipt(hederaClient);

        // If receipt.status is SUCCESS, proceed to dashboard with the newly created account
        if(receipt.status.toString() === "SUCCESS"){
            props.setNewAccountCreated(true);
            setLoginType("login");
        }
    }

    const onClickBottomLink = () => {
        if(loginType === "login"){
            setLoginType("create");
        }else {
            setLoginType("login");
        }
        setUsernameInputValue('');
        setPasswordInputValue('');
        setErrorMessage('');
    }

    return (
        <div className={`flex flex-col ${modalColor} h-96 w-96 rounded-xl`}>
            <p className='self-center text-3xl text-white mt-8'>
                {loginType === "login" ? "Login" : "New User"}
            </p>

            {/* Inputs */}

            {/* username */}
            <div className='flex flex-row self-center mt-8'>
                <div className='flex flex-col  justify-center mr-3'>
                    <p className='text-white'>{userIdText}</p>
                </div>
                
                <input
                    autoComplete={"off"}
                    className=' w-56 h-12 bg-white mt'
                    type="text" 
                    name="name" 
                    placeholder={loginType === "login" ? "enter username" : "enter new username"}
                    value={usernameInputValue}
                    onChange={e => {
                        onChangeUsernameInput(e.target.value);
                    }}
                />
            </div>

            {/* password */}
            <div className='flex flex-row self-center mt-8 mb-5'>
                <div className='flex flex-col  justify-center mr-3'>
                    <p className='text-white'>{passwordText}</p>
                </div>
                
                <input
                    autoComplete={"off"}
                    className=' w-56 h-12 bg-white mt'
                    type={"password"}
                    name="name" 
                    placeholder={loginType === "login" ? "enter password" : "enter new password"}
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
            
        </div>
    )
}

export default Login;

