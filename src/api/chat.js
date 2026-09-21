import Cookies from "js-cookie";

export const updateChatRoomOpenTime = async (chatRoomId) => {
    console.log(chatRoomId)
    try {
        const response = await fetch(
            `http://localhost:8080/api/v1/user/chat/chat_room/open`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Cookies.get("userTk")}`, // Assuming the token is stored in cookies
                },
                body: chatRoomId,
            },
        );

        const data = await response.json();
        return data; // Assuming the server returns a success message or status
    } catch (error) {
        console.error("Error during updating the open room time:", error);
        throw error;
    }
};
