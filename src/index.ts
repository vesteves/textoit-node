import express, { Express } from "express";
import dotenv from "dotenv";
import Main from "./main";
import filmRoute from './module/film/film.route'

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use('/film', filmRoute)

const port = process.env.PORT || 8000;
const host = process.env.HOST || "http://localhost";

app.listen(port, () => {
    console.info(`Server started at ${host}:${port}`)
    const main = new Main('./movielist.csv')
    main.initate()
});
