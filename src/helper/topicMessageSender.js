const { Client, TopicMessageSubmitTransaction } = require("@hashgraph/sdk");
const DATA_TOPIC_ID = process.env.REACT_APP_HEDERA_DATA_TOPIC_ID;
const MESSAGE_TOPIC_ID = process.env.REACT_APP_HEDERA_MESSAGE_TOPIC_ID;

export const sendDataTopicMessage = async (client: Client, dataMessage: string) => {
    let sendResponse = await new TopicMessageSubmitTransaction({
        topicId: DATA_TOPIC_ID,
        message: dataMessage,
    }).execute(client);

    const getReceipt = await sendResponse.getReceipt(client);
    console.log("receiptStatus: ", getReceipt.status);
    return getReceipt.status._code === 22 ;
    // console.log("The message transaction status: " + transactionStatus)
}

export const sendChatTopicMessage = async (client: Client, chatMessage: string) => {
    let sendResponse = await new TopicMessageSubmitTransaction({
        topicId: MESSAGE_TOPIC_ID,
        message: chatMessage,
    })
    .execute(client);

    const getReceipt = await sendResponse.getReceipt(client);
    return getReceipt.status === 22 ;
    // console.log("The message transaction status: " + transactionStatus)
}