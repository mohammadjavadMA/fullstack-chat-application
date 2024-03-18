import { useTheme } from "@emotion/react";
import { Box } from "@mui/material";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { myContext } from "../context/myContext";
import { ChatContact } from "./ChatContact";
import { ChatBox } from "./ChatBox";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ImageCropper } from "./ImageCropper";
import { formatDistanceToNow } from "date-fns-jalali";
import Cookies from "js-cookie";
import { socket } from "../utils/socket";
import { produce } from "immer";
import { ImageShower } from "./ImageShower";
import { ChatShowerSkeletons } from "./ChatShowerSkeletons";
import { TextMessage } from "./TextMessage";
import { FileMessage } from "./FileMessage";
import { toast } from "react-toastify";
import { url } from "../utils/url";

export const ChatShower = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState();
  const [chats, setChats] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { mode, getProgress, uploading, newImage, newFile } =
    useContext(myContext);
  const chatsRef = useRef();
  const theme = useTheme();
  const getImageForCropper = (img) => {
    setImage(img);
  };
  const Chatbox = useCallback(() => (
    <ChatBox imageSender={getImageForCropper} sendMessage={sendMessage} />
  ));
  const getUserInfo = async () => {
    if (username) {
      try {
        const { data } = await axios({
          method: "post",
          url: `${url}/get-user-info`,
          data: { username },
        });
        if (data) {
          setUserInfo(data.user);
          setIsOnline(data.user.lastSeen);
        }
      } catch (err) {
        toast.info("کاربر مورد نظر پیدا نشد");
      }
    }
  };
  const getUserChats = async () => {
    const token = Cookies.get("token");
    try {
      const { data } = await axios({
        method: "post",
        url: `${url}/get-chat`,
        data: { username, token },
        onDownloadProgress: (p) => {
          setLoading(true);
          if (!uploading) {
            getProgress(p.loaded / p.total);
          }
        },
      });
      setLoading(false);
      const chats_temp = [];
      if (data.message == "got chat") {
        for (let index = data.chat.chats.length - 1; index >= 0; index--) {
          chats_temp.push(data.chat.chats[index]);
        }
        // setLoading(true);
        // chats_temp.forEach(async (chat, index) => {
        //   if (chat.messageType == "photo") {
        //     const { data } = await axios({
        //       method: "post",
        //       url: "http://localhost:3000/get-image",
        //       data: { imageName: chat.message },
        //     });
        //     chats_temp[index].message = data.image;
        //     setChats(chats_temp);
        //   }
        //   if (index == chats_temp.length - 1) {
        //     setLoading(false);
        //   }
        // });
        setChats(chats_temp);
      }
    } catch (err) {
      setLoading(false);
      if (err.response.data.message == "no chat") {
        setChats([]);
      } else if (err.response.data.message == "sign out") {
        navigate("/");
      }
    }
  };
  const setMessagesSeen = async () => {
    const token = Cookies.get("token");
    await axios({
      method: "post",
      url: `${url}/seen-messages`,
      data: { username, token },
    });
  };
  const checkUserIsOnline = async () => {
    if (username) {
      const { data } = await axios({
        method: "post",
        url: `${url}/check-online`,
        data: { chat: username },
      });
      if (data.isOnline) {
        setIsOnline(data.isOnline);
      } else {
        setIsOnline(data.lastSeen);
      }
    }
  };
  const sendMessage = async (e) => {
    if (e.key == "Enter") {
      await axios({
        method: "post",
        url: `${url}/ended-typing`,
        data: { token: Cookies.get("token"), to: username },
      });
      let val = e.target.value;
      e.target.value = "";
      const date = new Date();
      setChats(
        produce((draft) => {
          draft.push({
            message: val,
            from: "you",
            dateSent: date,
            isRead: false,
          });
        })
      );
      setTimeout(() => {
        chatsRef.current.scrollTop = chatsRef.current.scrollHeight;
      }, 50);
      try {
        const res = await axios({
          method: "post",
          url: `${url}/send-message`,
          data: {
            message: val,
            to: username,
            token: Cookies.get("token"),
          },
        });
        console.log(res);
      } catch (err) {
        console.log(err);
        if (err.response.data.message == "yourself") {
          toast.info("نمی توانید به خودتان پیام دهید");
        } else if (res.data.message == "no user") {
          toast.info("کاربر مورد نظر پیدا نشد");
        } else if (
          err.response.data.message == "sign out" ||
          err.response.data.message == "no token"
        ) {
          navigate("/");
        }
      }
      e.target.value = "";
    }
  };
  const onOnline = (data) => {
    if (data == username) {
      setIsOnline(true);
    }
  };
  const onOffline = (data) => {
    const date = new Date();
    if (data == username) {
      setIsOnline(date);
    }
  };
  const onMessage = async ({ message, from }) => {
    const date = new Date();
    if (from == username) {
      setChats(
        produce((draft) => {
          draft.push({ from, message, dateSent: date, isRead: true });
        })
      );
      setTimeout(() => {
        chatsRef.current.scrollTop = chatsRef.current.scrollHeight;
      }, 50);
    }
    socket.emit("seen message", {
      user: username,
      token: Cookies.get("token"),
    });
  };
  const onTyping = (data) => {
    if (username == data) {
      setIsOnline("... در حال نوشتن");
    }
  };
  const onEndedTyping = (data) => {
    if (username == data) {
      setIsOnline(true);
    }
  };
  const onSendingPhoto = (data) => {
    if (data == username) {
      setIsOnline("... در حال ارسال عکس");
    }
  };
  const onSendPhoto = async ({ from, message }) => {
    if (from == username) {
      setIsOnline(true);
      const date = new Date();
      setChats(
        produce((draft) => {
          draft.push({
            from,
            message: message,
            messageType: "photo",
            dateSent: date,
            isRead: true,
          });
        })
      );
      setTimeout(() => {
        chatsRef.current.scrollTop = chatsRef.current.scrollHeight;
      }, 50);
      socket.emit("seen message", {
        user: username,
        token: Cookies.get("token"),
      });
    }
  };
  const onFile = ({ from, fileName }) => {
    const date = new Date();
    if (from == username) {
      setChats(
        produce((draft) => {
          draft.push({
            from,
            messageType: "file",
            message: fileName,
            dateSent: date,
            isRead: true,
          });
        })
      );
      setIsOnline(true);
      setTimeout(() => {
        chatsRef.current.scrollTop = chatsRef.current.scrollHeight;
      }, 50);
      socket.emit("seen message", {
        user: username,
        token: Cookies.get("token"),
      });
    }
  };
  const onSendingFile = (data) => {
    if (data == username) {
      setIsOnline("... در حال ارسال فایل");
    }
  };
  useEffect(() => {
    if (chats) {
      const onSawmess = (data) => {
        if (data == username) {
          //////////////////////////// make messages read with unread message count ///////////////////////////
          setChats(
            produce((draft) => {
              draft.forEach((c) => {
                c.isRead = true;
              });
            })
          );
        }
      };
      const onSawMessages = (data) => {
        if (data == username) {
          setChats(
            produce((draft) => {
              const lastmsg = draft[chats.length];
              if (lastmsg) {
                lastmsg.isRead = true;
              } else {
                draft[chats.length - 1].isRead = true;
              }
            })
          );
        }
      };
      socket.on("saw messages", onSawMessages);
      socket.on("sawmess", onSawmess);
      return () => {
        socket.off("saw messages", onSawMessages);
        socket.off("sawmess", onSawmess);
      };
    }
  }, [chats, username]);
  useEffect(() => {
    getUserInfo();
    getUserChats();
    setMessagesSeen();
    checkUserIsOnline();
    socket.on("online", onOnline);
    socket.on("offline", onOffline);
    socket.on("message", onMessage);
    socket.on("typing", onTyping);
    socket.on("ended-typing", onEndedTyping);
    socket.on("sending-photo", onSendingPhoto);
    socket.on("image", onSendPhoto);
    socket.on("sending-file", onSendingFile);
    socket.on("file", onFile);
    if (username) {
      setTimeout(() => {
        chatsRef.current.scrollTop = chatsRef.current.scrollHeight;
      }, 500);
    }
    return () => {
      socket.off("online", onOnline);
      socket.off("offline", onOffline);
      socket.off("message", onMessage);
      socket.off("typing", onTyping);
      socket.off("ended-typing", onEndedTyping);
      socket.off("sending-photo", onSendingPhoto);
      socket.off("image", onSendPhoto);
      socket.off("sending-file", onSendingFile);
      socket.off("file", onFile);
    };
  }, [username]);
  useEffect(() => {
    const date = new Date();
    newImage &&
      setChats(
        produce((draft) => {
          draft.push({
            from: "you",
            message: newImage,
            messageType: "photo",
            dateSent: date,
            isRead: false,
            isReal: true,
          });
        })
      );
    setTimeout(() => {
      chatsRef.current.scrollTop = chatsRef.current.scrollHeight;
    }, 50);
  }, [newImage]);
  useEffect(() => {
    const date = new Date();
    newFile &&
      setChats(
        produce((draft) => {
          draft.push({
            from: "you",
            message: "file_" + newFile.name,
            messageType: "file",
            dateSent: date,
            isRead: false,
          });
        })
      );
    setTimeout(() => {
      chatsRef.current.scrollTop = chatsRef.current.scrollHeight;
    }, 50);
  }, [newFile]);
  // useEffect(() => {
  //   socket.on("online", (data) => {
  //     setUserCameOnline(data);
  //   });
  //   socket.on("offline", (data) => {
  //     setUserCameOffline(data);
  //   });
  // }, []);
  // useEffect(() => {
  //   if (username == userCameOnline) {
  //     setIsOnline(true);
  //   }
  // }, [userCameOnline, username]);
  // useEffect(() => {
  //   if (username == userCameOffline) {
  //     const date = new Date();
  //     setIsOnline(date);
  //   }
  // }, [userCameOffline, username]);
  return (
    <>
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor:
            mode === "light"
              ? theme.palette.primary.dark
              : theme.palette.primary.contrastText,
        }}
      >
        <ImageCropper image={image} />
        {userInfo && username && (
          <ChatContact
            contactName={userInfo.contactName}
            contactProfileLink={userInfo.contactProfileLink}
            contactType={"person"}
            lastSeen={
              isOnline == true
                ? "آنلاین"
                : isOnline == "... در حال نوشتن"
                ? "... در حال نوشتن"
                : isOnline == "... در حال ارسال عکس"
                ? "... در حال ارسال عکس"
                : isOnline == "... در حال ارسال فایل"
                ? "... در حال ارسال فایل"
                : formatDistanceToNow(isOnline)
            }
          />
        )}
        {loading ? (
          <ChatShowerSkeletons />
        ) : (
          <Box
            ref={chatsRef}
            sx={{ height: "95vh", overflowX: "hidden", overflowY: "scroll" }}
          >
            {chats &&
              chats != undefined &&
              !loading &&
              chats.map((chat) =>
                chat.messageType != "photo" && chat.messageType != "file" ? (
                  <TextMessage key={chat.dateSent} chat={chat} />
                ) : chat.messageType == "photo" ? (
                  <ImageShower
                    imageName={chat.message}
                    dateSent={chat.dateSent}
                    from={chat.from}
                    isRead={chat.isRead}
                    key={chat.dateSent}
                    newImage={chat.isReal && chat.isReal}
                  />
                ) : (
                  <FileMessage chat={chat} key={chat.dateSent} />
                )
              )}
          </Box>
        )}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            margin: "10px",
            height: "50px",
          }}
        >
          <Chatbox />
        </Box>
      </Box>
    </>
  );
};
