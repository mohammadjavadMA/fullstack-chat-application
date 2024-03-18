import { io } from "socket.io-client";

export const socket = io("https://api.bigchat.ir", { autoConnect: false });
