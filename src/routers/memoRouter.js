// memo router
const express = require("express");
const router = express.Router();
const memoController = require("../controllers/memoController");

// 1. 메모 생성
router.post("/", memoController.createMemo);

// 3. 메모 전체 조회
router.get("/", memoController.getAllMemos);

// // 8. 휴지통 조회
// router.get("/trash", memoController.getDeletedMemos);

// // 4. 메모 선택 조회
// router.get("/:id", memoController.getMemoById);

// // 6. 메모 수정
// router.put("/:id", memoController.updateMemo);

// // 7. 메모 삭제 (soft delete)
// router.delete("/:id", memoController.deleteMemo);

// // 9. 메모 복구
// router.patch("/trash/:id", memoController.restoreMemo);

module.exports = router;
