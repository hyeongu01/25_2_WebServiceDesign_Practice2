const express = require("express");
const app = express();

const memoRouter = require("./routers/memoRouter");



app.use("/api/memos", memoRouter);