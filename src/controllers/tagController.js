
const TagTable = require("../models/MemoTable");
const { RequestForm, ErrorRequestForm } = require("./requestForm");

module.exports = {
    // 2. 태그 생성
    async createTag(req, res) {
        const tt = await TagTable.read();
        const result = tt.add();

        if (result === "conflict") {
            return res.status(409).json(ErrorRequestForm(
                "conflict",
                "이미 동일한 name 의 태그가 있습니다."
            ))
        }

        if (result === "bad_request") {
            return res.status(400).json(ErrorRequestForm(
                "bad_request",
                "Tag Name 은 1글자 이상이어야 합니다."
            ))
        }
        await tt.write();

        return res.status(201).json(RequestForm(
            result,
            {timestamp: Date.now()}
        ))
    },

    // 5. 태그 전체 조회
    async getAllTags(req, res) {
        const tt = await TagTable.read();

        return res.status(200).json(RequestForm(
            tt.data,
            {counts: tt.data.length, timestamp: Date.now()}
        ));
    },

    // 10. 태그 삭제
    async deleteTag(req, res) {

    }
}


// // 2. 태그 생성
// router.post("/", tagController.createTag);

// // 5. 태그 전체 조회
// router.get("/", tagController.getAllTags);

// // 10. 태그 삭제
// router.delete("/:id", tagController.deleteTag);