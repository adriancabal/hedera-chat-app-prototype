const { Client, TopicMessageSubmitTransaction } = require("@hashgraph/sdk");
const DATA_TOPIC_ID = process.env.REACT_APP_HEDERA_DATA_TOPIC_ID;
const MESSAGE_TOPIC_ID = process.env.REACT_APP_HEDERA_MESSAGE_TOPIC_ID;

export const sendDataTopicMessage = async (client: Client, dataMessage: string) => {
    let sendResponse = await new TopicMessageSubmitTransaction({
        topicId: DATA_TOPIC_ID,
        message: dataMessage,
    })
    // set max chunks let you increase the amount of characters you can send in one message. 1 chunk = 1000 chars. Defualt limit is 20 chunks = 20k chars.
    // .setMaxChunks(100)
    .execute(client);

    const getReceipt = await sendResponse.getReceipt(client);
    return getReceipt.status === 22 ;
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