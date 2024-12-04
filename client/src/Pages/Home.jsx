import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import Sidebar from "../Component/SideBar";
import NoChatSelected from "../Component/NoChatSelected";
import ChatSchreen from "../Component/ChatSchreen";

const Home = () => {
  const { selectedUser, users, getUsers } = useChatStore();
  // console.log(users);
  useEffect(() => {
    getUsers();
  }, []);
  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-[80rem] h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatSchreen />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
