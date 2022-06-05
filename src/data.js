export let userMap = {};
export let userList = [];

export let deletedChannelList = [];
export let dmChannelMap = {};
export let groupChannelMap = {};
export let dmChannelList = [];
export let groupChannelList = [];

export let channelIndex = 0;

export const setChannelIndex = (index) => {
    if(index > channelIndex){
        channelIndex = index;
    }
}
export let myMessages ={};
// export let myMessagesMap = {};
// export let myMessagesList = [];

export let hederaClient = null;