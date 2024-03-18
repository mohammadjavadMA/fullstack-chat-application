import { Grid } from "@mui/material";
import { ChatShower } from "../components/ChatShower";
import { Chats } from "../components/Chats";
import { SearchBox } from "../components/SearchBox";
import { Helmet } from "react-helmet-async";
import { useCallback, useEffect, useState } from "react";
import { socket } from "../utils/socket";
import { useParams } from "react-router-dom";

export const ScreenContainer = ({ path }) => {
  const { username } = useParams();
  useEffect(() => {
    socket.connect();
  }, []);
  return (
    <>
      <Helmet>
        <title>چت های شما</title>
      </Helmet>
      {!username || (username && window.innerWidth > 900) ? (
        <Grid container direction={"row"}>
          {path.pathname !== "/chats/search" ? (
            <Grid xs={12} sm={12} md={4} lg={4} xl={4} item>
              <Chats />
            </Grid>
          ) : (
            <Grid xs={12} sm={12} md={4} lg={4} xl={4} item>
              <SearchBox />
            </Grid>
          )}
          <Grid item xs={0} sm={0} md={8} lg={8} xl={8}>
            <ChatShower />
          </Grid>
        </Grid>
      ) : (
        <ChatShower />
      )}
    </>
  );
};
