import "dotenv/config";
import express from "express";
import moviesRouter from "./routers/moviesRouter.js";
import routeNotFound from "./middlewares/routeNotFound.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();
const port = process.env.SERVER_PORT;

app.use("/api/movies", moviesRouter);

app.use(routeNotFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});