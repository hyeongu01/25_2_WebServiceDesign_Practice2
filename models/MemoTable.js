// Memo Table 을 표현하는 객체 선언
// Memo 들의 정보와 테이블에서 필요한 정보들 저장

const fs = require("fs").promises;
const Memo = require("./Memo");
const {MEMO_PATH} = require("../config");

class MemoTable {
    constructor(nextId = 0, data = []) {
        this.nextId = nextId;
        this.data = data;
    }

    // 경로에 파일이 없거나 내용이 없으면 빈 내용을 생성
    static async read() {
        try {
            const text = await fs.readFile(MEMO_PATH, {encoding: "utf-8"});
            // console.log(text)
            const json = JSON.parse(text);
            // console.log(json)
            return MemoTable.fromJsonObject(json);
        } catch(err) {
            console.log("파일 읽기 오류 - ", err.message);
            const newMemoTable = new MemoTable();
            await newMemoTable.write();
            console.log("빈 memoTable 의 새 파일을 생성했습니다.")
            return newMemoTable;
        }
    }

    static async readById(id) {
        try {
            const text = await fs.readFile(MEMO_PATH, {encoding: "utf-8"});
            const memo = JSON.parse(text).data.find(m => m.id === id);
            if (!memo) {
                throw new Error(`[error] id: ${id} 인 메모가 없습니다.`);
            }
            return Memo.read(memo);
        } catch(err) {
            throw err;
        }
    }

    async write() {
        const json = JSON.stringify(this, null, 2);
        await fs.writeFile(MEMO_PATH, json, {encoding: "utf-8"});
    }

    static fromJsonObject(json) {
        return new MemoTable(
            json.nextId,
            json.data.map(Memo.read)
        )
    }

    add(title, content = null, tagId = null) {
        const newMemo = new Memo(
            this.nextId ++,
            title,
            {
                content: content,
                tagId: tagId
            }
        );
        this.data.push(newMemo);
    }

    update(id, {title, content, tagId}) {
        if (title === undefined && content === undefined && tagId === undefined) {
            throw new Error("[MemoTable update error] 변경되는 값이 없습니다.")
        }

        const target = this.data.find(m => m.id === id);
        if (!target) {
            throw new Error(`[MemoTable update error] memoId == ${id} 인 메모가 없습니다.`);
        }

        target.update({newTitle: title, newContent: content, newTag: tagId});
    }

    delete(id) {
        const target = this.data.find(m => m.id === id);
        if (!target) {
            throw new Error(`[MemoTable delete error] memoId == ${id} 인 메모가 없습니다.`);
        }

        if (target.deletedAt) {
            throw new Error(`[MemoTable delete error] memoId == ${id} 인 메모는 ${new Date(target.deletedAt).toLocaleString()} 에 이미 삭제되었습니다.`)
        }

        target.delete();
    }
}

// // read, write, add 테스트
// (async () => {
//     const mt = await MemoTable.read();
//     console.log(mt);
//     mt.add("test1", "testestsfdsfsdfaf");
//     await mt.write();
// })()
//     .catch(err => {
//         console.log(err);
//     });

// // readById 테스트
// (async () => {
//     const memo = await MemoTable.readById(2);
//     console.log(memo);
// })()
//     .catch(err => {console.log(err.message)})

// update, delete 테스트
(async () => {
    const mt = await MemoTable.read();
    // mt.update(5, {title: "updated test3"});
    mt.delete(2);
    await mt.write();
})()
    .catch(err => console.log(err.message));

// 객체 공유
module.exports = MemoTable;