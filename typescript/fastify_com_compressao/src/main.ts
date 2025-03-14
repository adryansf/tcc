// import "dotenv/config";
import { App } from "@/app";
import { Server } from "@/server";

const PORT = Number(process.env.SERVER_PORT) ?? 3333;
const HOST = process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost";

const app = new App(new Server(PORT, HOST));

app.start();
