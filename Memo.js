class Memo {
    constructor(
        id,
        title,
        {
            content = null,
            tagId = null,
            createdAt = Date.now(),
            updatedAt = Date.now(),
            deletedAt = null
        }
    ) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
        this.tagId = tagId;
    }

    static fromJsonObject(json) {
        return new Memo(
            json.id,
            json.title,
            {
                content: json.content,
                createdAt: json.createdAt,
                updatedAt: json.updatedAt,
                deletedAt: json.deletedAt,
                tagId: json.tagId
            }
        )
    }

    static fromJsonString(str) {

    }

    update(newTitle, newContent, newTag) {

    }

    delete() {

    }
}

module.exports = Memo;