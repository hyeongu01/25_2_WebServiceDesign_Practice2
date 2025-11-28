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
| 번호 | 기능명                     | 설명                     | CRUD | Method + URL |
|------|-----------------------------|---------------------------|------|---|
| 1    | 메모 생성                   | 새 메모 작성              | C    | `POST /api/memos` |
| 2    | 태그 생성                   | 새 태그 추가              | C    | `POST /api/tags` |
| 3    | 메모 전체 읽기             | 모든 메모 목록 조회       | R    | `GET /api/memos` |
| 4    | 메모 선택 읽기             | 특정 메모 상세 조회       | R    | `GET /api/memos/:{id}` |
| 5    | 태그 전체 읽기             | 모든 태그 읽기       | R    | `GET /api/tags` |
| 6    | 메모 수정                   | 기존 메모 내용 업데이트   | U    | `PUT /api/memos/:{id}` |
| 7    | 메모 삭제 (Soft Delete)    | 메모 임시 삭제 처리       | D    | `DELETE /api/memos/:{id}` |
| 8    | 휴지통 확인                | 삭제된 메모 목록 조회     | R    | `GET /api/memos/trash` |
| 9    | 메모 복구                   | 휴지통의 메모 복원        | U    | `PATCH /api/memos/trash/:{id}` |
| 10   | 태그 삭제 (Hard Delete) | 태그 데이터 완전 제거     | D    | `DELETE /api/tags/:{id}` |

<details>
<summary>각 기능 세부 설계</summary>
<div markdown="1">

## 1. 메모 생성
- `POST` - `/api/memos`
- 요청 예시
  ```json
  {
    "title": "첫 번째 메모",
    "content": "메모 본문",
    "tagId": 1
  }
  ```
- 응답 예시
  - 201 Created
    ```json
    {
        "data": {
            "id": 0,
            "title": "test0",
            "content": "testestsfdsfsdfaf",
            "createdAt": 1764257258171,
            "updatedAt": 1764257258171,
            "deletedAt": null,
            "tagId": null
        },
        "meta": {
            "timestamp": 1764257258171
        }
    }
    ```
  - 400 Bad Request
    ```json
    {
        "error": "bad_request",
        "message": "Memo title must be at least 1 character."
    }
    ```

## 2. 태그 생성
- `POST` - `"/api/tags"`
- 요청 예시
    ```json
    {
        "name": "book"
    }
    ```
- 응답 예시
  - 201 Created
    ```json
    {
        "data": {
            "id": 0,
            "name": "book",
            "createdAt": 1764256356888
        },
        "meta": {
            "timestamp": 1764256356888
        }
    }
    ```
  - 400 Bad Request
    ```json
    {
        "error": "bad_request",
        "message": "Tag name must be at least 1 character."
    }
    ```
  - 409 Conflict
    ```json
    {
        "error": "Conflict",
        "message": "이미 동일한 name 의 태그가 있습니다." 
    }
    ```

## 3. 메모 전체 읽기
- `GET` - `"/api/memos"`
- 응답 예시
  - 200 OK
    ```json
    {
        "data": [
            {
                "id": 0,
                "title": "test0",
                "content": "testestsfdsfsdfaf",
                "createdAt": 1764257258171,
                "updatedAt": 1764257258171,
                "deletedAt": null,
                "tagId": null
            },
            {
                "id": 1,
                "title": "test1",
                "content": "testestsfdsfsdfaf",
                "createdAt": 1764257277114,
                "updatedAt": 1764257277114,
                "deletedAt": null,
                "tagId": null
            }
        ],
        "meta": {
            "counts": 2,
            "timestamp": 1764257277114
        }
    }
    ```

## 4. 메모 선택 읽기
- `GET` - `"/api/memos/:{id}"`
- 요청 예시: `GET /api/memos/1`
- 응답 예시
  - 200 OK
    ```json
    {
        "data": {
            "id": 1,
            "title": "test1",
            "content": "testestsfdsfsdfaf",
            "createdAt": 1764257277114,
            "updatedAt": 1764257277114,
            "deletedAt": null,
            "tagId": null
        },
        "meta": {
            "timestamp": 1764257277114
        }
    }
    ```
  - 404 Not Found
    ```json
    {
        "error": "not_found",
        "message": "id == 1 인 메모가 없거나 삭제된 상태입니다."
    }
    ```

## 5. 태그 전체 읽기
- `GET` - `"/api/tags"`
- 요청 예시: `GET /api/tags`
- 응답 예시
  - 200 OK
    ```json
    {
        "data": [
            {
                "id": 0,
                "name": "book",
                "createdAt": 1764256356888
            },
            {
                "id": 1,
                "name": "study",
                "createdAt": 1764256356888
            }
        ],
        "meta": {
            "counts": 2,
            "timestamp": 1764256356888
        }
    }
    ```

## 6. 메모 수정
- `PUT` - `"/api/memos/:{id}"`
- 요청 예시
    ```json
    {
        "title": "updated title",
        "content": "updated content",
        "tagId": 1
    }
    ```
- 응답 예시
  - 200 OK - 값 변경 완료
    ```json
    {
        "data": {
            "id": 1,
            "title": "test0",
            "content": "testestsfdsfsdfaf",
            "createdAt": 1764257258171,
            "updatedAt": 1764257258171,
            "deletedAt": null,
            "tagId": null
        },
        "meta": {
            "timestamp": 1764256356888
        }
    }
    ```
  - 204 No Content - 변경된 값이 없을 떄
    - 응답 body 없음
  - 404 Not Found
    ```json
    {
        "error": "not_found",
        "message": "id == 1 인 메모를 찾을 수 없습니다."
    }
    ```

## 7. 메모 삭제 (Soft Delete)
- `DELETE` - `"/api/memos/:{id}"`
- 요청 형식: `DELETE /api/memos/1`
- 응답 형식
  - 200 OK
    ```json
    {
        "data": {
            "id": 1,
            "deletedAt": 1764256356888
        },
        "meta": {
            "timestamp": 1764256356888
        }
    }
    ```
  - 204 No Content
    - 응답 body 없음
  - 404 Not Found
    ```json
    {
        "error": "not_found",
        "message": "id == 1 인 메모를 찾을 수 없습니다."
    }
    ```

## 8. 휴지통 확인
- `GET` - `"/api/memos/trash"`
- 요청 형식: `GET /api/memos/trash`
- 응답 형식
  - 200 OK
    ```json
    {
        "data": [
            {
                "id": 2,
                "title": "updated test3",
                "content": "testestsfdsfsdfaf",
                "createdAt": 1764257280650,
                "updatedAt": 1764257871757,
                "deletedAt": 1764257914434,
                "tagId": null
            }
        ],
        "meta": {
            "counts": 1,
            "timestamp": 1764256356888
        }
    }
    ```

## 9. 메모 복구
- `PATCH` - `/api/memos/trash/:{id}`
- 요청 형식: `PATCH /api/memos/trash/2`
- 응답 형식
  - 200 OK - 복구 성공
    ```json
    {
        "data": {
            "id": 2
        },
        "meta": {
            "timestamp": 1764256356888
        }
    }
    ```

  - 204 No Content - 삭제되지 않은 메모
    - 응답 body 없음
  - 404 Not Found - ID 를 찾을 수 없음
    ```json
    {
        "error": "not_found",
        "message": "id == 1 인 메모를 찾을 수 없습니다."
    }
    ```

## 10. 태그 삭제 (Hard Delete)
- `DELETE` - `/api/tags/:{id}`
- 요청 형식: `DELETE /api/tags/1`
- 응답 형식
  - 200 OK
    ```json
    {
        "data": {
            "id": 1
        },
        "meta": {
            "timestamp": 1764256356888
        }
    }
    ```
  - 404 Not Found
    ```json
    {
        "error": "not_found",
        "message": "id == 1 인 태그를 찾을 수 없습니다."
    }
    ```

</div>
</details>

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


