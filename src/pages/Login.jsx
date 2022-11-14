import React, { useState, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosAPI from "../utils/APIRoutes";
import { getChatAppUser, setChatAppUser } from "../utils/token";

const Login = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const toastOption = {
    position: "bottom-right",
    autoClose: 800,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (getChatAppUser()) {
      navigate("/");
    }
  }, []);

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleValidation = () => {
    const { password, username } = values;

    if (password === "") {
      toast.error("Must fill password form.", toastOption);
      return false;
    } else if (username === "") {
      toast.error("Must fill username form.", toastOption);
      return false;
    } else if (password.length < 5) {
      toast.error("Password should be greater than 5 character.", toastOption);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, username } = values;
    let apiData = { username, password };

    if (handleValidation()) {
      await axiosAPI
        .post("auth/login", apiData)
        .then(({ data }) => {
          if (data.status === true) {
            setChatAppUser(data.data);
            navigate("/");
          }
        })
        .catch(({ response }) => {
          if (response.data.status === false) {
            toast.error(response.data.message, toastOption);
            console.log("WHy NOT WORK");
          }
        });
    }
  };

  return (
    <>
      <FormContainer>
        <form action="" onSubmit={(e) => handleSubmit(e)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>RabbitChat</h1>
          </div>
          <input
            type="text"
            placeholder="Username..."
            name="username"
            onChange={handleChange}
            min={3}
          />

          <input
            type="password"
            placeholder="Password..."
            name="password"
            onChange={handleChange}
          />

          <button type="submit">Create User</button>
          <span>
            Already have an Account? <Link to="/register">Register</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
};

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
    input {
      background-color: transparent;
      padding: 1rem;
      border: 0.1rem solid #4e0eff;
      border-radius: 0.4rem;
      color: white;
      width: 100%;
      font-size: 1rem;
      &:focus {
        border: 0.1rem solid #997af0;
        outline: none;
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
    span {
      color: white;
      text-transform: uppercase;
      a {
        color: #4e0eff;
        text-decoration: none;
        font-weight: bold;
        transition: 0.3s ease-in-out;
        &:hover {
          color: #2131c3;
        }
      }
    }
  }
`;

export default Login;
