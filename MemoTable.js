// Memo Table 을 표현하는 객체 선언
// Memo 들의 정보와 테이블에서 필요한 정보들 저장

const fs = require("fs").promises;
const Memo = require("./Memo");

class MemoTable {
    constructor(path, nextId = 0, data = []) {
        this.path = path;
        this.nextId = nextId;
        this.data = data;
    }

    // 경로에 파일이 없거나 내용이 없으면 빈 내용을 생성
    static async read(path) {
        try {
            const text = await fs.readFile(path, {encoding: "utf-8"});
            // console.log(text)
            const json = JSON.parse(text);
            // console.log(json)
            return MemoTable.fromJsonObject(json);
        } catch(err) {
            console.log("파일 읽기 오류. 새로 생성합니다.")
            console.log(new MemoTable(path))
            return new MemoTable(path);
        }
    }

    static async readById(path, id) {
        try {
            const text = await fs.readFile(path, {encoding: "utf-8"});
            const memo = JSON.parse(text).data.find(m => m.id === id);
            if (!memo) {
                throw id;
            }

            return Memo.read(memo);
        } catch(err) {
            throw `id: ${id} 인 메모가 없습니다.`
        }
    }

    async write() {
        await fs.writeFile(this.path, JSON.stringify(this), {encoding: "utf-8"});
    }

    static fromJsonObject(json) {
        return new MemoTable(
            json.path,
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
        this.data = this.data.map(m => {
            if (m.id === id) {
                m.update({newTitle: title, newContent: content, newTag: tagId});
            }
            return m;
        })
    }

    delete(id) {
        const target = this.data.find(m => m.id === id);
        if (!target.deletedAt) {
            target.delete();
        }
    }
}

(async (path) => {
    const mt = await MemoTable.read(path);
    // mt.add("test2");
    console.log(mt);
    const memo = await MemoTable.readById(path, 0);
    console.log(memo)
    // await mt.write();
})("./tempStorage.json").catch(err=>{
    console.log(err)
});

// (async (path) => {
//     const mt = await MemoTable.read(path);
//     console.log(mt);
//     mt.add("test3");
//     // mt.update(0, {title: "updated"});
//     console.log(mt);
//     // mt.delete(1);
//     // console.log(mt)
//     await mt.write();
// })("./tempStorage.json");

module.exports = MemoTable;