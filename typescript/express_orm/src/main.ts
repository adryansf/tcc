import "dotenv/config";
import { App } from "@/app";
import { Server } from "@/server";

const PORT = Number(process.env.SERVER_PORT) || 3333;

const app = new App(new Server(PORT));

app.start();
