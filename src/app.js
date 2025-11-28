const express = require("express");
const app = express();

const memoRouter = require("./routers/memoRouter");
const tagRouter = require("./routers/tagRouter");

app.use(express.json());

app.use("/api/memos", memoRouter);
app.use("/api/tags", tagRouter);


app.get("/", (req, res) => {
    res.status(200).json({
        message: "Memo API Server is running",
        timestamp: Date.now()
    });
});

// 정의되지 않은 경로
app.use((req, res, next) => {
    res.status(404).json({
        error: "not_found",
        message: "요청한 API endpoint 를 찾을 수 없습니다."
    });
});


module.exports = app;