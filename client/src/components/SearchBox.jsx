import { Box, Button } from "@mui/material";
import { useContext, useRef, useState } from "react";
import { myContext } from "../context/myContext";
import { useTheme } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import axios from "axios";
import { ContactShower } from "./ContactShower";
import { url } from "../utils/url";

export const SearchBox = () => {
  const [foundUser, setFoundUser] = useState();
  const [noUser, setNoUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const { mode } = useContext(myContext);
  const theme = useTheme();
  const navigate = useNavigate();
  const searchInp = useRef();
  let searchTimeout;
  const findUsersByUsername = async () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {
      try {
        setLoading(true);
        const { data } = await axios({
          method: "post",
          url: `${url}/search-user`,
          data: { search: searchInp.current.value },
        });
        setLoading(false);
        if (data.message !== "no user") {
          setNoUser(false);
          setFoundUser(data.user);
        } else {
          setFoundUser("");
          setNoUser(true);
        }
      } catch (err) {
        console.log(err);
      }
    }, 1000);
  };
  return (
    <Box
      sx={{
        backgroundColor:
          mode === "light"
            ? theme.palette.primary.dark
            : theme.palette.primary.light,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box sx={{ width: "100%", display: "flex", justifyContent: "start" }}>
        <Button
          onClick={() => {
            navigate("/chats");
          }}
        >
          <ArrowBack
            sx={{
              color:
                mode === "light"
                  ? theme.palette.primary.light
                  : theme.palette.primary.dark,
            }}
          />
        </Button>
      </Box>
      <input
        ref={searchInp}
        autoFocus={true}
        onChange={findUsersByUsername}
        style={{
          width: "90%",
          color:
            mode === "light"
              ? theme.palette.primary.light
              : theme.palette.primary.dark,
        }}
        type="text"
        name="search"
        id="search"
      />
      {loading && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
            style={{ width: "70px" }}
            src="/gifs/loading.gif"
            alt="loading"
          />
        </div>
      )}
      {foundUser && !noUser && !loading && (
        <ContactShower
          contactName={foundUser.username}
          contactProfileLink={foundUser.photoLink}
          contactType={"person"}
          isMuted={false}
          isOnline={false}
          key={foundUser.username}
          lastMessage={""}
          lastMessageDate={""}
          unreadMessagesCount={""}
        />
      )}
      {noUser && !loading && (
        <div>
          <h2
            style={{
              color:
                mode === "light"
                  ? theme.palette.primary.light
                  : theme.palette.primary.dark,
            }}
          >
            کاربری با این نام کاربری پیدا نشد
          </h2>
        </div>
      )}
    </Box>
  );
};
