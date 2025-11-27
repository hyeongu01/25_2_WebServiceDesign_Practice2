// Tag 테이블을 관리하는 객체
const fs = require("fs").promises;
const Tag = require("./Tag");

class TagTable {
    constructor(path, nextId = 0, data = []) {
        this.path = path;
        this.nextId = nextId;
        this.data = data;
    }

    static async read(path) {
        try {
            const text = await fs.readFile(path, {encoding: "utf-8"});
            const json = JSON.parse(text);
            return new TagTable(json.path, json.nextId, json.data.map(Tag.read));
        } catch(err) {
            console.log("파일 읽기 에러: ", err.message);
            console.log("새로운 테이블을 생성합니다.");
            const newTable = new TagTable(path);
            newTable.write()
                .then(console.log("새로운 테이블 저장 성공!"))
                .catch(err => {
                    console.log(`새로운 파일 생성 실패 - ${err}`);
                })
            return newTable;
        }
    }

    static async readById(path, id) {
        const text = await fs.readFile(path, {encoding: "utf-8"});
        const tag = JSON.parse(text).data.find(t => t.id === id);
        if (tag) {
            return tag;
        } else {
            throw `id: ${id} 인 tag 가 없습니다.`
        }
    }

    async write() {
        const json = JSON.stringify(this);
        await fs.writeFile(this.path, json, {encoding: "utf-8"});
    }

    add(name) {
        if (name) {
            this.data.push(new Tag(this.nextId ++, name));
        } else {
            console.log("태그 이름은 1자 이상으로 지어주세요!");
        }
    }

    delete(id) {
        if (id !== undefined) {
            this.data = this.data.filter(t => t.id !== id);
        }
    }
}

module.exports = TagTable;