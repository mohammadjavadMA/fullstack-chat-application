import { Avatar, Badge, Box } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { myContext } from "../context/myContext";
import { useTheme } from "@emotion/react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { parseISO, formatDistanceToNow } from "date-fns-jalali";
import axios from "axios";
import { url } from "../utils/url";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

export const ContactShower = ({
  contactName,
  contactType,
  lastMessage,
  lastMessageDate,
  isOnline,
  unreadMessagesCount,
}) => {
  const [photoLink, setPhotoLink] = useState();
  useEffect(() => {
    const getUserPhotoLink = async () => {
      const { data } = await axios({
        method: "post",
        url: `${url}/get-user-photo`,
        data: { username: contactName },
      });
      setPhotoLink(data.photoLink);
    };
    getUserPhotoLink();
  }, []);
  const { mode } = useContext(myContext);
  const theme = useTheme();
  return (
    <Link
      style={{ textDecoration: "none", width: "98%" }}
      to={`/chats/u/${contactName}`}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          margin: "2px",
          padding: "3px",
          transition: "0.4s all",
          cursor: "pointer",
          "&:hover": { backgroundColor: theme.palette.primary.main },
          borderRadius: "10px",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", width: "50%" }}>
          {unreadMessagesCount && (
            <Badge badgeContent={unreadMessagesCount} color="info" />
          )}
          <p
            style={{
              color:
                mode === "light"
                  ? theme.palette.primary.light
                  : theme.palette.primary.dark,
              width: "50%",
              marginLeft: "5px",
            }}
          >
            {lastMessageDate && formatDistanceToNow(parseISO(lastMessageDate))}
          </p>
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "start",
            flexDirection: "column",
            padding: "10px",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "100%", display: "flex", justifyContent: "end" }}>
            <p>{contactType === "channel" ? <></> : null}</p>
            <h3
              style={{
                color:
                  mode === "light"
                    ? theme.palette.primary.light
                    : theme.palette.primary.dark,
                margingRight: "5px",
              }}
            >
              {contactName}
            </h3>
          </Box>
          <Box sx={{ width: "100%", display: "flex", justifyContent: "end" }}>
            {lastMessage && lastMessage.length > 34 ? (
              <p
                style={{
                  color:
                    mode === "light"
                      ? theme.palette.primary.light
                      : theme.palette.primary.dark,
                }}
              >
                ... {lastMessage.slice(0, 33)}
              </p>
            ) : (
              <p
                style={{
                  color:
                    mode === "light"
                      ? theme.palette.primary.light
                      : theme.palette.primary.dark,
                }}
              >
                {lastMessage}
              </p>
            )}
          </Box>
        </Box>
        {isOnline ? (
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
          >
            <Avatar
              sx={{ width: "55px", height: "55px" }}
              alt={contactName}
              src={photoLink}
            />
          </StyledBadge>
        ) : (
          <Avatar
            sx={{ width: "55px", height: "55px" }}
            alt={contactName}
            src={photoLink}
          />
        )}
      </Box>
    </Link>
  );
};
