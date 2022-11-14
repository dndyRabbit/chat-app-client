import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getChatAppUser, setChatAppUser } from "../utils/token";
import axios from "axios";

import { Buffer } from "buffer";
import axiosAPI from "../utils/APIRoutes";

const SetAvatar = () => {
  const apiimage = "https://api.multiavatar.com/45678945";
  const navigate = useNavigate();

  const [avatars, setAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const toastOption = {
    position: "top-right",
    autoClose: 800,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (!getChatAppUser()) {
      navigate("/login");
    }
  }, []);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOption);
    } else {
      const user = await getChatAppUser();

      const { data } = await axiosAPI.patch(`auth/set-avatar/${user._id}`, {
        image: avatars[selectedAvatar],
      });

      console.log(data);

      if (data?.data?.isAvatarImageSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.data.avatarImage;
        setChatAppUser(user);
        navigate("/");
      } else {
        toast.error("Error setting avatar, Please try again.", toastOption);
      }
    }
  };

  useEffect(() => {
    async function getImageAPI() {
      setLoading(true);
      const data = [];
      for (let i = 0; i < 4; i++) {
        const image = await axios.get(
          `${apiimage}/${Math.round(Math.random() * 1000)}`
        );
        const buffer = new Buffer(image.data);
        data.push(buffer.toString("base64"));
      }
      setAvatars(data);
      setLoading(false);
    }
    getImageAPI();
  }, []);

  return (
    <>
      {loading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Pick an Avatar as your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => {
              return (
                <div
                  key={index}
                  className={`avatar ${
                    selectedAvatar === index ? "selected" : ""
                  }`}
                >
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              );
            })}
          </div>

          <button type="button" onClick={setProfilePicture}>
            Set as profile picture
          </button>
        </Container>
      )}

      <ToastContainer />
    </>
  );
};

export default SetAvatar;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;
  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }

  .avatars {
    display: flex;
    gap: 2rem;
    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.2s ease-in-out;
      img {
        height: 6rem;
      }
    }

    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }

  button {
    background-color: #997af0;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    transition: 0.5s ease-in-out;
    &:hover {
      background-color: #4e0eff;
    }
  }
`;
