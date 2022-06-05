// import { hederaClient } from "../data";
const { Client, TopicMessageSubmitTransaction } = require("@hashgraph/sdk");

const DATA_TOPIC_ID = process.env.REACT_APP_HEDERA_DATA_TOPIC_ID;
const MESSAGE_TOPIC_ID = process.env.REACT_APP_HEDERA_MESSAGE_TOPIC_ID;

const myAccountId = process.env.REACT_APP_MY_ACCOUNT_ID;
const myPrivateKey = process.env.REACT_APP_MY_PRIVATE_KEY;
const hederaClient = Client.forTestnet();
hederaClient.setOperator(myAccountId, myPrivateKey);

export const sendDataTopicMessage = async (dataMessage: string) => {
    let sendResponse = await new TopicMessageSubmitTransaction({
        topicId: DATA_TOPIC_ID,
        message: dataMessage,
    }).execute(hederaClient);

    const getReceipt = await sendResponse.getReceipt(hederaClient);
    console.log("receiptStatus: ", getReceipt.status);
    return getReceipt.status._code === 22 ;
    // console.log("The message transaction status: " + transactionStatus)
}

export const sendChatTopicMessage = async (chatMessage: string) => {
    let sendResponse = await new TopicMessageSubmitTransaction({
        topicId: MESSAGE_TOPIC_ID,
        message: chatMessage,
    })
    .execute(hederaClient);

    const getReceipt = await sendResponse.getReceipt(hederaClient);
    return getReceipt.status === 22 ;
    // console.log("The message transaction status: " + transactionStatus)
}