class Tag {
    constructor(id, name, createdAt = Date.now()) {
        this.id = id;
        this.name = name;
        this.createdAt = createdAt
    }

    static fromJson(json) {

    }

    static fromString(str) {

    }
}


module.exports = Tag;