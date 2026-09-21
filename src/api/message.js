import Cookies from "js-cookie";

export const getUserRoomMessages = async (chatRoomId) => {
    try {
        const response = await fetch(
            `http://localhost:8080/api/v1/user/messages/room/${chatRoomId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Cookies.get("userTk")}`, // Assuming the token is stored in cookies
                },
            },
        );

        const data = await response.json();
        return data; // Assuming the server returns a list of users
    } catch (error) {
        console.error("Error during user search:", error);
        throw error;
    }
};

export const updateUserChatMessagesStatus = async (username) => {
    try {
        const response = await fetch(
            `http://localhost:8080/api/v1/user/chats/status`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Cookies.get("userTk")}`, // Assuming the token is stored in cookies
                },
                body: JSON.stringify({ username }),
            },
        );

        const data = await response.text();
        return data; // Assuming the server returns a success message or updated status
    } catch (error) {
        console.error("Error during updating chat messages status:", error);
        throw error;
    }
};

export const updateMessageStatus = async (messageId, status) => {
    try {
        const response = await fetch(
            `http://localhost:8080/api/v1/user/messages/${messageId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Cookies.get("userTk")}`, // Assuming the token is stored in cookies
                },
                body: `${status}`,
            },
        );

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error during message status update ", error);
    }
};

export const updateMessagesStatusToSeen = async (chatRoomId) => {
    try {
        const response = await fetch(
            `http://localhost:8080/api/v1/user/messages/room/${chatRoomId}/status`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Cookies.get("userTk")}`, // Assuming the token is stored in cookies
                },
                body: `${chatRoomId}`,
            },
        );

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error during message status update ", error);
    }
};
