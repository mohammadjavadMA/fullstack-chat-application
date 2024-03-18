import { useTheme } from "@emotion/react";
import { Box, Skeleton } from "@mui/material";
import { myContext } from "../context/myContext";
import { useCallback, useContext, useEffect, useState } from "react";
import { ChatNavbar } from "./ChatNavbar";
import { ContactShower } from "./ContactShower";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { socket } from "../utils/socket";
import { produce } from "immer";
import { ChatsSkeletons } from "./ChatsSkeletons";
import { url } from "../utils/url";

export const Chats = () => {
  const [contacts, setContacts] = useState([]);
  const { username } = useParams();
  const navigate = useNavigate();
  const { getProgress, uploading, mode } = useContext(myContext);
  const theme = useTheme();
  const Chatnavbar = useCallback(() => <ChatNavbar />);
  const getContacts = async () => {
    try {
      const { data } = await axios({
        method: "post",
        url: `${url}/get-contacts`,
        data: { token: Cookies.get("token") },
        onDownloadProgress: (p) => {
          if (!uploading) {
            getProgress(p.loaded / p.total);
          }
        },
      });
      if (data.message == "got chats") {
        setContacts(data.chats);
        data.chats.forEach(async (chat) => {
          const { data } = await axios({
            method: "post",
            url: `${url}/check-online`,
            data: { chat: chat.user },
          });
          if (data.isOnline) {
            setContacts(
              produce((draft) => {
                const contact = draft.find((c) => c.user == chat.user);
                contact.isOnline = true;
              })
            );
          }
        });
      }
    } catch (err) {
      if (err.response.data.message == "sign out") {
        navigate("/");
      }
    }
  };
  const getter = async () => {
    const token = Cookies.get("token");
    try {
      const { data } = await axios({
        method: "post",
        url: `${url}/verify-token`,
        data: { token },
      });
      if (data.message !== "chat") {
        navigate("/");
      } else {
        socket.emit("online", data.username);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const onOnline = (data) => {
    setContacts(
      produce((draft) => {
        const contact = draft.find((c) => c.user === data);
        if (contact) {
          contact.isOnline = true;
        }
      })
    );
  };
  const onOffline = (data) => {
    setContacts(
      produce((draft) => {
        const contact = draft.find((c) => c.user === data);
        if (contact) {
          contact.isOnline = false;
        }
      })
    );
  };
  const onMessage = ({ message, from }) => {
    if (username != from) {
      setContacts(
        produce((draft) => {
          const contact = draft.find((c) => c.user == from);
          if (contact) {
            let date = new Date();
            date = date.toISOString();
            contact.chats.unshift({
              from,
              message,
              dateSent: date,
            });
          } else {
            let date = new Date();
            dateSent = date.toISOString();
            draft.push({
              user: from,
              chats: [{ from, message, dateSent }],
              isOnline: true,
            });
          }
        })
      );
    }
  };
  const onImage = ({ from }) => {
    setContacts(
      produce((draft) => {
        const contact = draft.find((c) => c.user == from);
        contact.chats.shift();
      })
    );
    if (from != username) {
      setContacts(
        produce((draft) => {
          const contact = draft.find((c) => c.user == from);
          if (contact) {
            let date = new Date();
            date = date.toISOString();
            contact.chats.unshift({
              from,
              message: "image",
              messageType: "photo",
              dateSent: date,
            });
          } else {
            let date = new Date();
            date = date.toISOString();
            draft.push({
              user: from,
              chats: [
                {
                  from,
                  message: "image",
                  dateSent: date,
                  messageType: "photo",
                },
              ],
              isOnline: true,
            });
          }
        })
      );
    }
  };
  const onFile = ({ from, fileName }) => {
    if (from != username) {
      setContacts(
        produce((draft) => {
          const contact = draft.find((c) => c.user == from);
          if (contact) {
            let date = new Date();
            date = date.toISOString();
            contact.chats.unshift({
              from,
              message: fileName,
              messageType: "file",
              dateSent: date,
            });
          } else {
            let date = new Date();
            date = date.toISOString();
            draft.push({
              user: from,
              chats: [
                {
                  from,
                  message: fileName,
                  messageType: "file",
                  dateSent: date,
                },
              ],
              isOnline: true,
            });
          }
        })
      );
    }
  };
  const onTyping = (data) => {
    setContacts(
      produce((draft) => {
        const contact = draft.find((c) => c.user == data);
        if (contact) {
          contact.chats.unshift({
            message: "... در حال نوشتن",
            dateSent: contact.chats[0].dateSent,
          });
        }
      })
    );
  };
  const onEndedTyping = (data) => {
    setContacts(
      produce((draft) => {
        const contact = draft.find((c) => c.user == data);
        if (contact) {
          contact.chats.shift();
        }
      })
    );
  };
  const onSendingPhoto = (data) => {
    setContacts(
      produce((draft) => {
        const contact = draft.find((c) => c.user == data);
        if (contact) {
          contact.chats.unshift({
            message: "... در حال ارسال عکس",
            dateSent: contact.chats[0].dateSent,
          });
        }
      })
    );
  };
  useEffect(() => {
    getter();
    getContacts();
    socket.on("online", onOnline);
    socket.on("offline", onOffline);
    socket.on("typing", onTyping);
    socket.on("ended-typing", onEndedTyping);
    socket.on("sending-photo", onSendingPhoto);
    return () => {
      socket.off("online", onOnline);
      socket.off("offline", onOffline);
      socket.off("typing", onTyping);
      socket.off("ended-typing", onEndedTyping);
      socket.off("sending-photo", onSendingPhoto);
    };
  }, []);
  useEffect(() => {
    socket.on("message", onMessage);
    socket.on("image", onImage);
    socket.on("file", onFile);
    return () => {
      socket.off("message", onMessage);
      socket.off("image", onImage);
      socket.off("file", onFile);
    };
  }, [username]);
  return (
    <>
      <Box
        sx={{
          backgroundColor:
            mode === "light"
              ? theme.palette.primary.dark
              : theme.palette.primary.light,
          height: "100vh",
        }}
      >
        <Chatnavbar />
        {contacts ? (
          contacts.map((contact) => {
            let unreadMessagesCount = 0;
            contact.chats.forEach((message) => {
              if (!message.isRead && message.from != "you") {
                unreadMessagesCount++;
              }
            });
            return (
              <ContactShower
                contactName={contact.user}
                contactType={"person"}
                contactProfileLink={contact.user}
                lastMessage={
                  contact.chats[0].messageType == "photo"
                    ? "تصویر"
                    : contact.chats[0].messageType == "file"
                    ? contact.chats[0].message.split("_")[1]
                    : contact.chats[0].message
                }
                lastMessageDate={contact.chats[0].dateSent}
                isOnline={contact.isOnline}
                unreadMessagesCount={
                  contact.chats[0].message != "... در حال نوشتن" &&
                  contact.chats[0].message != "... در حال ارسال عکس" &&
                  contact.chats[0].message != "... در حال ارسال فایل" &&
                  unreadMessagesCount != 0 &&
                  unreadMessagesCount
                }
                key={contact.user}
              />
            );
          })
        ) : (
          <ChatsSkeletons />
        )}
      </Box>
    </>
  );
};
