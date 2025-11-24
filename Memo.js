class Memo {
    constructor(
        id,
        title,
        content = null,
        createdAt = Date.now(),
        updatedAt = Date.now(),
        deletedAt = null,
        tagId = null
    ) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
        this.tagId = tagId;
    }

    static fromJson(json) {

    }

    static fromString(str) {

    }

    update(newTitle, newContent, newTag) {

    }

    delete() {

    }
}
