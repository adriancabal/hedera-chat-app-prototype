import { MessageType, UserAction } from '../constants';

export const newUser = (user: string, pw: string) => {
    const msgObj = {
        type: UserAction.NEW_USER,
        user: user,
        pw: pw,
    };
    return JSON.stringify(msgObj);
};

export const newDm = (channel: number, user1: string, user2: string) => {
    const msgObj = {
        type: UserAction.NEW_DM,
        user1: user1,
        user2: user2,
        channel: channel,
    };
    return JSON.stringify(msgObj);
};

export const newGroup = (channel: number, creator: string, users) => {
    const msgObj = {
        type: UserAction.NEW_GROUP,
        channel: channel,
        creator: creator,
        users: users,
    };
    return JSON.stringify(msgObj);
};

export const deleteGroup = (channel, sender) => {
    const msgObj = {
        type: UserAction.DELETE_GROUP,
        channel: channel,
        sender: sender,
    };
    return JSON.stringify(msgObj);
};

export const loginUser = (user: string) => {
    const msgObj = {
        type: UserAction.LOGIN,
        user: user,
    };
    return JSON.stringify(msgObj);
};

export const logoutUser = (user: string) => {
    const msgObj = {
        type: UserAction.LOGOUT,
        user: user,
    };
    return JSON.stringify(msgObj);
}

// Send DM Message
export const sendDM = (channel: number, sender: string, message: string, index: number, timestamp: number) => {
    const msgObj = {
        type: MessageType.DM,
        channel: channel,
        sender: sender,
        message: message,
        index: index,
        timestamp: timestamp,
    };
    return JSON.stringify(msgObj);
};

//Send Group Message
export const sendGroupMessage = (channel: number, sender: string, message: string) => {
    const msgObj = {
        type: MessageType.GROUP,
        channel: channel,
        sender: sender,
        message: message,
    };
    return JSON.stringify(msgObj);
};