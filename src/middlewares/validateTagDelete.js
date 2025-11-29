const { ErrorRequestForm } = require("../controllers/requestForm");
const TagTable = require("../models/TagTable");
const MemoTable = require("../models/MemoTable");

async function validateTagDelete(req, res, next) {
    const tagId = Number(req.params.id);

    if (Number.isNaN(tagId)) {
        return res.status(400).json(ErrorRequestForm(
            "bad_request",
            "id 는 숫자이어야 합니다."
        ))
    }

    // 태그 존재 확인
    try {
        const tag = await TagTable.readById(tagId);
    } catch(err) {
        return res.status(404).json(ErrorRequestForm(
            "not_found",
            `id == ${tagId} 인 태그를 찾을 수 없습니다.`
        ))
    }
    

    // 메모 존재 확인
    const mt = await MemoTable.read();
    const memos = mt.data.filter(m => m.tagId === tagId);
    if (memos.length > 0) {
        return res.status(409).json(ErrorRequestForm(
            "conflict",
            `해당 tag 를 참조하는 memo 가 [${memos.map(m => m.id)}] 있습니다.`
        ))
    }

    return next();
}

module.exports = validateTagDelete;