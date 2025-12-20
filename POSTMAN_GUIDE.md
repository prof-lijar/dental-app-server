# Postman API Sample for Health Check Submit

## Quick Setup

### Option 1: Import Postman Collection
1. Open Postman
2. Click **Import** button
3. Select `postman_health_check_sample.json`
4. The collection will be imported with the sample request

### Option 2: Manual Setup
1. Create a new request in Postman
2. Set method to **POST**
3. Set URL to: `http://localhost:3000/api/health-check/submit`
4. Go to **Body** tab
5. Select **raw** and **JSON** format
6. Copy the content from `postman_request_body_example.json` and paste it

## Request Details

**Method:** `POST`  
**URL:** `http://localhost:3000/api/health-check/submit`  
**Headers:**
```
Content-Type: application/json
```

**Body:** See `postman_request_body_example.json` for the complete JSON payload

## Sample Response

**Success Response (200):**
```json
{
  "success": true,
  "result": "입력하신 내용을 바탕으로 현재 구강 관리 상태를 정리해드릴게요. 전체적으로는 ①양치 습관 ②식습관 ③보조용품 사용 ④치과 관리 네 가지를 기준으로 평가했습니다.\n\n양치 횟수는 적절하게 유지하고 계세요. 양치 시간도 적절한 편입니다..."
}
```

**Error Response (400):**
```json
{
  "error": "sectionA is required and must be an array"
}
```

## Alternative Answer Options

### Section A - Question 1 (양치 횟수)
- `"0번"`
- `"1번"`
- `"2번"`
- `"3번"`
- `"3번 이상"`

### Section A - Question 2 (양치 시간)
- `"1분 이하"`
- `"2~3분"`
- `"3분 이상"`
- `"4분 이상"`

### Section A - Question 3 (양치 방법)
- `"가로로 왔다 갔다 닦아요"`
- `"위에서 아래로 / 아래서 위로 닦아요"`
- `"둥글둥글 원을 그리며 닦아요"`
- `"잇몸 쪽에 칫솔을 대고 부드럽게 흔들어요"`
- `"잇몸에서 치아 쪽으로 굴리듯 쓸어내려요 (추천 양치법)"`
- `"잘 모르겠어요"`

### Section A - Question 4 (칫솔 종류)
- `"딱딱한 칫솔"`
- `"중간 정도 칫솔"`
- `"부드러운 칫솔(미세모)"`
- `"잘 모르겠어요"`

### Section A - Question 5 (치약 느낌)
- `"닦을 때 약간 까끌까끌하거나 강하게 느껴져요"`
- `"그냥 평범해요"`
- `"부드럽고 순하게 느껴져요(시린 이 전용 등)"`
- `"잘 모르겠어요"`

### Section B - Question 6 (보조용품)
- `"치실"`
- `"치간칫솔"`
- `"구강세정기(워터픽 등)"`
- `"혀 클리너"`
- `"사용하지 않아요"`

### Section B - Question 7 (보조용품 빈도)
- `"매일"`
- `"주 3~5회"`
- `"주 1~2회"`
- `"거의 사용하지 않아요"`

### Section C - Question 8 (양치 타이밍)
- `"아침에 일어나자마자"`
- `"아침 식사 후"`
- `"점심 식사 후"`
- `"저녁 식사 후"`
- `"간식 섭취 후"`
- `"자기 전"`
- `"불규칙하거나 생각날 때만"`

### Section D - Question 9 (단 음식)
- `"거의 안 먹어요"`
- `"주 1~2번"`
- `"주 3~5번"`
- `"하루에 한 번"`
- `"하루 여러 번"`

### Section D - Question 10 (단 음료)
- `"거의 안 마셔요"`
- `"주 1~2회"`
- `"주 3~5회"`
- `"하루에 한 잔"`
- `"하루 여러 잔"`

### Section E - Question 11 (치과 검진)
- `"6개월 이내에 받았어요"`
- `"1년 안에 받았어요"`
- `"2년 넘었어요"`
- `"기억이 안 나요"`

### Section E - Question 12 (치과 치료)
- `"스케일링(치석 제거)"`
- `"충치 치료"`
- `"잇몸 치료"`
- `"교정 중이에요"`
- `"임플란트/크라운/브릿지 있어요"`
- `"특별히 없어요"`

### Section F - Question 13 (잇몸 출혈)
- `"아니요"`
- `"가끔"`
- `"자주"`

### Section F - Question 14 (시림/통증)
- `"아니요"`
- `"차가운 것에만 시려요"`
- `"씹을 때 아파요"`
- `"가만히 있어도 욱신거려요"`

### Section F - Question 15 (입 냄새)
- `"아니요"`
- `"가끔"`
- `"자주 느껴져요"`

### Section F - Question 16 (고민)
- `"이가 시려요"`
- `"잇몸이 붓거나 피가 나요"`
- `"치아가 누래 보여요"`
- `"입 냄새가 걱정돼요"`
- `"양치를 잘하고 있는지 모르겠어요"`
- `"특별히 없어요"`

