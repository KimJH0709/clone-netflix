# Netflix Clone

🎥 **Netflix Clone**은 Netflix의 UI와 주요 기능을 재현한 웹 애플리케이션입니다. Vue.js와 TMDB API를 사용하여 인기 영화, 최신 영화, 검색 및 찜하기 등의 기능을 제공합니다.

---

## 🌟 주요 기능 (Features)

1. **회원가입 및 로그인**

   - 이메일과 비밀번호를 이용한 사용자 인증.
   - `Remember Me` 및 `Auto Login` 기능 지원.

2. **인기 영화 및 최신 영화 표시**

   - TMDB API를 통해 인기 영화와 최신 영화를 가져와 화면에 표시.
   - 메인 배너에 인기 영화 자동 슬라이드.

3. **영화 검색**

   - 사용자가 원하는 영화 제목 또는 조건(장르, 평점 등)을 검색 가능.

4. **찜하기 (Wishlist)**

   - 영화 포스터에 "찜하기" 버튼을 클릭하여 개인 찜 목록 관리.

5. **반응형 UI**

   - 데스크톱과 모바일 화면에서 최적화된 반응형 디자인.

6. **테이블 뷰 및 무한 스크롤 뷰**
   - 영화 목록을 테이블 뷰 또는 무한 스크롤 뷰로 전환 가능.

---

## 🛠️ 기술 스택 (Tech Stack)

- **Frontend**:
  - Vue.js 3
  - Vue Router
  - Axios
  - TMDB API (영화 데이터)
- **Styling**:
  - CSS3 (Scoped 스타일링)
  - Responsive Design
- **Backend**:
  - LocalStorage (사용자 인증 및 찜 목록 데이터 저장)

---

## ⚙️ 설치 및 실행 방법 (Installation)

### **저장소 클론**

```bash
git clone https://github.com/KimJH0709/clone-netflix.git
cd clone-netflix
```

### **필수 의존성 설치**

아래 명령어를 실행하여 프로젝트에 필요한 의존성을 설치합니다:

```bash
npm install
```

### **_로컬 서버 실행_**

```bash
npm run serve
```
