// Tag 테이블을 관리하는 객체
const fs = require("fs").promises;
const Tag = require("./Tag");
const {TAG_PATH} = require("../config");

class TagTable {
    constructor(nextId = 0, data = []) {
        this.nextId = nextId;
        this.data = data;
    }

    static async read() {
        try {
            const text = await fs.readFile(TAG_PATH, {encoding: "utf-8"});
            const json = JSON.parse(text);
            return new TagTable(json.nextId, json.data.map(Tag.read));
        } catch(err) {
            console.log("파일 읽기 에러: ", err.message);
            console.log("새로운 테이블을 생성합니다.");
            const newTable = new TagTable();
            await newTable.write()
            console.log("새로운 TagTable 저장 성공!");
            return newTable;
        }
    }

    static async readById(id) {
        const text = await fs.readFile(TAG_PATH, {encoding: "utf-8"});
        const tag = JSON.parse(text).data.find(t => t.id === id);
        if (tag) {
            return Tag.read(tag);
        } else {
            throw new Error(`[error] id: ${id} 인 tag 가 없습니다.`);
        }
    }

    async write() {
        const json = JSON.stringify(this, null, 2);
        await fs.writeFile(TAG_PATH, json, {encoding: "utf-8"});
    }

    add(name) {
        // 중복되는 이름 찾기
        const tag = this.data.find(m => m.name === name);
        if (tag) {
            throw new Error(`[error] tagName: ${name} 인 tag 가 이미 있습니다.`);
        }

        // 빈 문자열 혹은 빈 값 처리
        if (!name) {
            throw new Error("태그 이름은 1자 이상으로 지어주세요!");
        }

        this.data.push(new Tag(this.nextId ++, name));    
    }

    delete(id) {
        if (id !== undefined) {
            this.data = this.data.filter(t => t.id !== id);
        }
    }
}

// // readById 테스트
// (async () => {
//     const tag1 = await TagTable.readById(1);
//     console.log(tag1);
//     const tag2 = await TagTable.readById(3);
//     console.log(tag2);
// })()
//     .catch(err => {
//         console.error(err.message);
//     });

// // read 테스트
// (async () => {
//     const tt = await TagTable.read();
//     tt.add("book");
//     tt.add("study");
//     console.log(tt);
//     await tt.write();
// })()
//     .catch(err => {
//         console.error(err.message);
//     });

module.exports = TagTable;