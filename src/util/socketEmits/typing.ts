import socket from "../socket";

export const handleEmitTyping = ({
    senderId,
    receiverId,
    isTyping,
}: {
    senderId: number;
    receiverId: number;
    isTyping: boolean;
}) => {
    socket.emit("typing", {
        senderId: senderId,
        receiverId: receiverId,
        isTyping: isTyping,
    });
};
