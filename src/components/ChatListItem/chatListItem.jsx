import { updateMessagesStatusToSeen } from "../../api/message";
import { dateConverter } from "../../utils/utils";
import "./chatListItem.css";

export default function ChatListItem({
    item,
    active,
    setCurrentView,
    setSelectedChat,
    type,
    user,
}) {
    const getView = (type) => {
        let view = "home/";
        switch (type) {
            case "chat":
                view += "chat-list/chat-room";
                break;
            case "request":
                view += "requests/request-user-details";
                break;
            case "search-result":
                view += "search/user";
                break;
            default:
        }
        return view;
    };

    return (
        <div
            type="button"
            style={{
                border: "none",
                outline: "none",
                height: `${type === "request" ? "100px" : "75px"}`,
            }}
            className={`chat-list-item btn mb-1 ${active}`}
            onClick={() => {
                setCurrentView(getView(type));
                window.history.pushState({ view: getView(type) }, "", "");
                type === 'chat' && updateMessagesStatusToSeen(item.chatRoomId)
                setSelectedChat(item);
            }}
        >
            <div>
                <div className="avatar mr-3 mt-1">
                    {/* Avatar image will go here */}
                </div>
                <div className="chat-info">
                    <div className="d-flex justify-content-between align-items-center w-100 mt-1">
                        <h6>{item ? item.name : "User name"}</h6>
                        {type === "chat" && (
                            <span className="unread-count badge badge-primary">
                                {item ? item.unread === 0 ? "" : item.unread : "99+"}
                            </span>
                        )}
                    </div>
                    <div className="chat-meta d-flex justify-content-between align-items-center w-100">
                        {type === "chat" && (
                            <>
                                <p>
                                    {item
                                        ? item.lastMessage
                                            ? (item.lastMessage.sender.username === user.username ? "You: " + item.lastMessage.content : item.lastMessage.content)
                                            : "Start conversation."
                                        : "last_message"}
                                </p>
                                <span className="last-message-time">
                                    {item
                                        ? (
                                            item.lastMessage ? dateConverter(item.lastMessage.lastUpdate) : dateConverter(item.lastUpdate)
                                        )
                                        : "12:00am"}
                                </span>
                            </>
                        )}
                        {type !== "chat" && `@${item ? item.username : "username"}`}
                    </div>
                </div>
            </div>
            {/* {type === "request" && (
                <div className="cta-container mt-2">
                    <button className="">
                        <i className="fa-solid fa-check"></i>
                        <span className="d-inline ms-2">Accept</span>
                    </button>
                    <button className="">
                        <i className="fa-solid fa-circle-xmark"></i>
                        <span className="d-inline ms-2">Reject</span>
                    </button>
                </div>
            )} */}
        </div>
    );
}
