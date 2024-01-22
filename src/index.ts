import express, { Express } from "express";
import dotenv from "dotenv";
import { Main } from "./module/main";
import filmRoute from './module/film/film.route'

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use('/film', filmRoute)

const port = process.env.PORT || 8000;
const host = process.env.HOST || "http://localhost";

app.listen(port, async () => {
    console.info(`Server started at ${host}:${port}`)
    const main = new Main()
    main.initate()
});
