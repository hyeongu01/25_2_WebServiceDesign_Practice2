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

    static read(json) {
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

    update({newTitle, newContent, newTag}) {
        if (newTitle !== undefined && this.title !== newTitle) {
            this.title = newTitle;
            this.updatedAt = Date.now();
        }
        if (newContent !== undefined && this.content !== newContent) {
            this.content = newContent;
            this.updatedAt = Date.now();
        }
        if (newTag !== undefined && this.tagId !== newTag) {
            this.tagId = newTag;
            this.updatedAt = Date.now();
        }
    }

    delete() {
        this.deletedAt = Date.now();
    }
}

module.exports = Memo;