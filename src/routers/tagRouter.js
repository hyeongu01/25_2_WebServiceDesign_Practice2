// tag router
const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tagController");

// // 2. 태그 생성
// router.post("/", tagController.createTag);

// // 5. 태그 전체 조회
// router.get("/", tagController.getAllTags);

// // 10. 태그 삭제
// router.delete("/:id", tagController.deleteTag);

module.exports = router;
