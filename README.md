# [25_2_웹서비스설계: 실습2] HTTP 매소드별 API 구현
## 📚 요구사항
1. HTTP 메소드별 API 구현
2. POST / GET / PUT / DELETE 각각 2개씩 총 8개의 API 구현
3. 미들웨어 구현
4. 응답 코드 다양성 확보
5. 표준화된 응답 형식 사용


## 🔥 설계

> [!tip]
> 메모장 백엔드를 구상한다고 가정하고, 이를 위한 API 설계 및 구현  
> 데이터는 JSON 형식으로 저장!

### 지원한 기능 선정
| 번호 | 기능명                     | 설명                     | CRUD |
|------|-----------------------------|---------------------------|------|
| 1    | 메모 생성                   | 새 메모 작성              | C    |
| 2    | 태그 생성                   | 새 태그 추가              | C    |
| 3    | 메모 전체 읽기             | 모든 메모 목록 조회       | R    |
| 4    | 메모 선택 읽기             | 특정 메모 상세 조회       | R    |
| 5    | 태그 전체 읽기             | 모든 태그 읽기       | R    |
| 6    | 메모 수정                   | 기존 메모 내용 업데이트   | U    |
| 7    | 메모 삭제 (Soft Delete)    | 메모 임시 삭제 처리       | D    |
| 8    | 휴지통 확인                | 삭제된 메모 목록 조회     | R    |
| 9    | 메모 복구                   | 휴지통의 메모 복원        | U    |
| 10   | 태그 삭제 (Hard Delete) | 태그 데이터 완전 제거     | D    |

### ERD 작성
> 링크: [dbdiagram.io](https://dbdiagram.io/d/MemoPad-ERD-690196a7357668b7321b5f31)

<img src="./assets/MemoPad ERD.png" width="450">

<details>
<summary>ERD 설계 코드 - dbdiagram.io</summary>
<div markdown="1">

```sql
Table Memo {
    id integer [PK, increment]
    title varchar(100) [not null]
    content text
    createdAt timestamp [default: "now()"]
    updatedAt timestamp [default: "now()"]
    deletedAt timestamp [default: null]
    tagId integer [ref: < Tag.id]

    Indexes {
        title
    }
}

Table Tag {
    id integer [pk, increment]
    name varchar(50) [unique, not null]
    createdAt timestamp [default: "now()"]
}
```
</div>
</details>


### Memo 를 다루는 객체 생성

