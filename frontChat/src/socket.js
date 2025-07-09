// const io = new Server(server, {
//   cors: { origin: "http://localhost:5173", credentials: true },
// });


import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

export default socket;