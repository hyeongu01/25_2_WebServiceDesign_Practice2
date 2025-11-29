const { ErrorRequestForm } = require("../controllers/requestForm");
const TagTable = require("../models/TagTable");

async function validateTagId(req, res, next) {
    const {tagId} = req.body;

    if (tagId === undefined || tagId === null) {
        return next();
    }

    const id = Number(tagId);
    if (Number.isNaN(id)) {
        return res.status(400).json(ErrorRequestForm(
            "bad_request",
            `tagId는 숫자이어야 합니다.`
        ))
    }

    // tagId 인 tag 를 찾기
    try {
        await TagTable.readById(id);
        return next();
    } catch(err) {
        return res.status(400).json(ErrorRequestForm(
            "bad_request",
            `id == ${id} 인 tag 가 존재하지 않습니다.`
        ))
    }
}

module.exports = validateTagId