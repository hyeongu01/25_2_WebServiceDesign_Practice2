// 요청 처리, 응답 코드 모음
const Memo = require("../models/Memo");
const MemoTable = require("../models/MemoTable");

const { RequestForm, ErrorRequestForm } = require("./requestForm")

module.exports = {
    // 1. 메모 생성
    async createMemo(req, res) {
        console.log(req.body);
        const { title, content, tagId } = req.body;
        

        // title 이 falsy 인 경우 400 Bad Request
        if (!title) {
            return res.status(400).json(ErrorRequestForm("Bad Request", "메모 제목은 필수입니다."));
        }

        // 메모 읽기
        try {
            // 메모 읽기
            const mt = await MemoTable.read();
            const newMemo = mt.add(title, content, tagId);
            await mt.write()

            return res.status(201).json(RequestForm(
                newMemo, 
                { timestamp: Date.now() }
            ));
        } catch (err) {
            return res.status(400).json(ErrorRequestForm(
                "bad_request", 
                err.message
            ));
        }
    },

    // 3. 메모 전체 읽기
    async getAllMemos(req, res) {
        const mt = await MemoTable.read();
        let memos = mt.data;
        // 삭제된거 필터링
        memos = memos.filter(m => m.deletedAt === null);

        return res.status(200).json(RequestForm(memos, {counts: memos.length, timestamp: Date.now()}));
    }, 

    // 4. 메모 선택 읽기
    async getMemoById(req, res) {
        const id = Number(req.params.id);

        try {
            const memo = await MemoTable.readById(id);

            if (memo.deletedAt !== null) {
                throw new Error(`id: ${id}인 메모는 ${new Date(memo.deletedAt).toLocaleString()} 에 삭제되었습니다.`);
            }

            return res.status(200).json(RequestForm(
                memo,
                {timestamp: Date.now()}
            ));
        } catch(err) {
            return res.status(404).json(ErrorRequestForm(
                "not_found",
                err.message
            ))
        }
    },

    // 6. 메모 수정
    async updateMemo(req, res) {
        const id = Number(req.params.id);
        const { title, content, tagId } = req.body;

        const mt = await MemoTable.read();
        const result = mt.update(id, {title, content, tagId});

        if (result === "not_found") {
            return res.status(404).json({
                error: "not_found",
                message: `id == ${id} 인 메모를 찾을 수 없습니다.`
            });
        }

        if (result === "no_change") {
            return res.status(204).send();
        }

        await mt.write();
        return res.status(200).json(RequestForm(
            result,
            {timestamp: Date.now()}
        ))
    },

    // 7. Soft Delete
    async deleteMemo(req, res) {
        const id = Number(req.params.id);

        const mt = await MemoTable.read();
        const result = mt.delete(id);

        if (result === "not_found") {
            return res.status(404).json(ErrorRequestForm(
                "not_found",
                `id == ${id} 인 메모를 찾을 수 없습니다.`
            ))
        }

        if (result === "no_change") {
            return res.status(204).send();
        }
        await mt.write();

        return res.status(200).json({
            data: {
                id: result.id,
                deletedAt: result.deletedAt
            },
            meta: { timestamp: Date.now() }
        });
    },

    // 8. 휴지통 조회
    async getDeletedMemos(req, res) {
        const mt = await MemoTable.read();
        const deletedMemos = mt.data.filter(m => m.deletedAt !== null);
        
        return res.status(200).json(RequestForm(
            deletedMemos,
            {
                counts: deletedMemos.length,
                timestamp: Date.now()
            }
        ));
    },

    // 9. 메모 복구
    async restoreMemo(req, res) {
        const id = Number(req.params.id);

        const mt = await MemoTable.read();
        const result = mt.restore(id);

        if (result === "not_found") {
            return res.status(404).json(ErrorRequestForm(
                "not_found",
                `id == ${id} 인 메모를 찾을 수 없습니다.`
            ));
        }

        if (result === "no_change") {
            return res.status(204).send(); // 이미 삭제된 메모
        }

        return res.status(200).json(RequestForm(
            {id: id},
            {timestamp: Date.now()}
        ));
    }
};
