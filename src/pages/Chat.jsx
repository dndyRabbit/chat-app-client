import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import axiosAPI from "../utils/APIRoutes";
import { getChatAppUser } from "../utils/token";
import { io } from "socket.io-client";
import { host } from "../utils/url";

const Chat = () => {
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);

  const navigate = useNavigate();

  useEffect(() => {
    if (!getChatAppUser()) {
      navigate("/login");
    } else {
      setCurrentUser(getChatAppUser());
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser?._id);
    }
    console.log(host, "FROM ENV");
  }, [currentUser]);

  useEffect(() => {
    async function getContactsUser() {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const { data } = await axiosAPI.get(
            `auth/get-alluser/${currentUser._id}`
          );
          setContacts(data.data);
        } else {
          navigate("/choose-avatar");
        }
      }
    }
    getContactsUser();
  }, [currentUser]);

  const handleChangeChat = (chat) => {
    setCurrentChat(chat);
  };

  return (
    currentUser && (
      <Container>
        <div className="container">
          <Contacts
            contacts={contacts}
            currentUser={currentUser}
            changeChat={handleChangeChat}
          />
          {currentChat === undefined ? (
            <Welcome currentUser={currentUser} />
          ) : (
            <ChatContainer
              currentChat={currentChat}
              currentUser={currentUser}
              socket={socket}
            />
          )}
        </div>
      </Container>
    )
  );
};

export default Chat;

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
