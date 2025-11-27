// 요청 처리, 응답 코드 모음
const MemoTable = require("../models/MemoTable");

const RequestForm = (data, meta) => {
    return {
        data: data,
        meta: meta
    }
}

const ErrorRequestForm = (error, message) => {
    return {
        error: error,
        message: message
    }
}

module.exports = {
    // 1. 메모 생성
    async createMemo(req, res) {
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

            return res.status(201).json({
                data: newMemo,
                meta: { timestamp: Date.now() }
            });
        } catch (err) {
            return res.status(400).json({
                error: "bad_request",
                message: err.message
            });
        }
    },

    // 3. 메모 전체 읽기
    async getAllMemos(req, res) {
        const mt = await MemoTable.read();
        const memos = mt.data;

        return res.status(200).json({
            data: memos,
            meta: {
                counts: memos.length,
                timestamp: Date.now()
            }
        });
    },

//     // 4. 메모 선택 읽기
//     async getMemoById(req, res) {
//         const id = Number(req.params.id);

//         const memo = await memoService.getMemoById(id);
//         if (!memo || memo.deletedAt !== null) {
//             return res.status(404).json({
//                 error: "not_found",
//                 message: `id == ${id} 인 메모가 없거나 삭제된 상태입니다.`
//             });
//         }

//         return res.status(200).json({
//             data: memo,
//             meta: { timestamp: Date.now() }
//         });
//     },

//     // 6. 메모 수정
//     async updateMemo(req, res) {
//         const id = Number(req.params.id);
//         const { title, content, tagId } = req.body;

//         const result = await memoService.updateMemo(id, { title, content, tagId });

//         if (result === "not_found") {
//             return res.status(404).json({
//                 error: "not_found",
//                 message: `id == ${id} 인 메모를 찾을 수 없습니다.`
//             });
//         }

//         if (result === "no_change") {
//             return res.status(204).send(); // body 없음
//         }

//         return res.status(200).json({
//             data: result,
//             meta: { timestamp: Date.now() }
//         });
//     },

//     // 7. Soft Delete
//     async deleteMemo(req, res) {
//         const id = Number(req.params.id);

//         const deleted = await memoService.deleteMemo(id);

//         if (!deleted) {
//             return res.status(404).json({
//                 error: "not_found",
//                 message: `id == ${id} 인 메모를 찾을 수 없습니다.`
//             });
//         }

//         return res.status(200).json({
//             data: {
//                 id: deleted.id,
//                 deletedAt: deleted.deletedAt
//             },
//             meta: { timestamp: Date.now() }
//         });
//     },

//     // 8. 휴지통 조회
//     async getDeletedMemos(req, res) {
//         const deleted = await memoService.getDeletedMemos();

//         return res.status(200).json({
//             data: deleted,
//             meta: {
//                 counts: deleted.length,
//                 timestamp: Date.now()
//             }
//         });
//     },

//     // 9. 복구
//     async restoreMemo(req, res) {
//         const id = Number(req.params.id);

//         const restored = await memoService.restoreMemo(id);

//         if (restored === "not_found") {
//             return res.status(404).json({
//                 error: "not_found",
//                 message: `id == ${id} 인 메모를 찾을 수 없습니다.`
//             });
//         }

//         if (restored === "not_deleted") {
//             return res.status(204).send(); // 삭제되지 않은 메모
//         }

//         return res.status(200).json({
//             data: { id },
//             meta: { timestamp: Date.now() }
//         });
//     }
};
