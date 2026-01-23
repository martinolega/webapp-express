import "dotenv/config";
import cors from "cors";
import express from "express";
import moviesRouter from "./routers/moviesRouter.js";
import routeNotFound from "./middlewares/routeNotFound.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();
app.use(express.json());
//app.use(express.urlencoded({extended: true}));

const corsFunctionality = {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
}

app.use(cors(corsFunctionality));

app.use(express.static("public"));
const port = process.env.SERVER_PORT;

app.use("/api/movies", moviesRouter);

app.use(routeNotFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});