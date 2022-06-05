import { userMessages } from "../../../messages";
import { MessageType } from "../../../constants";

const AllMessages = () => {
    return (
        <div className="flex flex-col w-full">
            <div className="flex flex-row justify-center bg-[gray] h-10">
                <p className="self-center">
                    {"Recent Messages"}
                </p>
            </div>
            <div className="flex-col h-full Scrollbar custom-scrollbar">
                {
                    userMessages.map((message) => {
                        // const msgHeaderColor = message.type === MessageType.DM ? "bg-[green]" : "bg-[purple]";
                        // const msgBodyColor = message.type === MessageType.DM ? "bg-[#88bd96]" : "bg-[#a188b3]";
                        const msgHeaderColor = "bg-[#242226]";
                        const msgBodyColor = "bg-[#242226]";
                        return(
                            <div className="flex flex-col w-full h-20 border-2 border-[black]">
                                <div className="flex flex-row w-full">

                                    {/* Message From */}
                                    <div className={`flex ${msgHeaderColor} px-5 justify-center pt-2`}>
                                        <p className="self-center text-white font-bold">
                                            {message.type === MessageType.DM
                                                ? message.from
                                                : <><span className="text-[#c934eb]">{`[${message.groupName}]: `}</span>{`${message.from}`}</>
                                            }
                                        </p>
                                    </div>
                                    {/* Message Type */}
                                    <div className={`flex flex-row-reverse grow ${msgHeaderColor} pr-4`}>
                                        <p className="self-center text-[yellow]">
                                            {message.timestamp}
                                        </p>
                                    </div>
                                    {/* <div className={`flex ${msgHeaderColor} grow justify-center`}>
                                        
                                    </div> */}

                                    
                                </div>

                                {/* Message Content */}
                                <div className={`flex grow w-full ${msgBodyColor} pl-5 pb-2`}>
                                    <p className="self-center text-white">
                                        {message.content}
                                    </p>
                                </div>
                                
                            </div>
                        )
                    })
                }
            </div>
            
            
        </div>
    )
}

export default AllMessages;