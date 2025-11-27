class Tag {
    constructor(id, name, createdAt = Date.now()) {
        this.id = id;
        this.name = name;
        this.createdAt = createdAt
    }

    static read(json) {
        return new Tag(json.id, json.name, json.createdAt);
    }
}

module.exports = Tag;