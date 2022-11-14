export const setChatAppUser = (payload) => {
  return localStorage.setItem("chat-app-user", JSON.stringify(payload));
};

export const getChatAppUser = () => {
  return JSON.parse(localStorage.getItem("chat-app-user"));
};

export const clearChatAppUser = () => {
  return localStorage.clear("chat-app-user");
};
