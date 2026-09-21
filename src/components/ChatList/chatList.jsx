/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { ChatListItem } from "..";
import "./chatList.css";

export default function ChatList({
  setCurrentView,
  setSelectedChat,
  selectedChat,
  chats,
  setChats,
  user,
  publish,
  updateUnread
}) {
  
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchValue(e.target.value);
    setChats(
      chats.filter((chat) => chat.name.toLowerCase().includes(query))
    );
  };

  
  return (
    <div className="chat-list pe-2">
      <div className={`chat-list-header`}>
        <div className="action-container ms-3 mb-2">
          <h5>Chats</h5>
        </div>
        <div className="search-box ms-3">
          <input
            type="text"
            className="search"
            placeholder={`Search`}
            onChange={handleSearchChange}
            value={searchValue}
          />
        </div>
        <div className="toggle-btn d-flex align-items-center justify-content-center"></div>
      </div>
      <div className="chat-list-container">
        {chats.map((chat) => (
          <ChatListItem
            key={chat.chatRoomId}
            item={chat}
            active={
              selectedChat &&
              selectedChat.chatRoomId === chat.chatRoomId &&
              "active"  
            }
            type={'chat'}
            setCurrentView={setCurrentView}
            setSelectedChat={setSelectedChat}
            user={user}
            publish={publish}
          />
        ))}
        <ChatListItem setCurrentView={setCurrentView} type={'chat'} updateUnread={updateUnread} />
      </div>
      
    </div>
  );
}
