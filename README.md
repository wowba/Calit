# :calendar: Calit

**세상에서 가장 간단한** 달력 기반 애자일 협업 툴  
[사이트 링크](https://calit-2f888.web.app)  
[피그마 링크](https://www.figma.com/file/1aqki74c3mvyESVHEtZ8NE/hellstudy-final?type=design&node-id=0-1&mode=design&t=Ux2uxU1KFzSGqSWL-0)

## Calit 개요

<img width="1166" alt="스크린샷 2023-11-18 17 56 56" src="https://github.com/wowba/Calit/assets/87873821/d76ace65-0f74-4bd8-933c-b488d35a633d">

Calit 프로젝트는 프론트엔드 개발자 3명이서 기획 / 디자인 / 백엔드 / 프론트엔드 4 분야를  
6주의 기간동안 진행하였습니다. (2023/10/16 ~ 2023/11/17)

각 분야에 모두 다 참여하여 최대한 유기적으로 회의 및 개발을 진행하였으며  
firebase의 onSnapshot 기능을 주로 이용하여 실시간으로 작업 상황을 공유할 수 있는 협업툴을 만들었습니다.

6주의 기간동안 힘들어도 끝까지 진행하여 좋은 프로젝트를 만들어 나간 팀원 분들께 감사의 말씀 드립니다.

## Calit 유저 플로우

![image](https://github.com/wowba/Calit/assets/87873821/71ff21a1-884d-4243-83fa-a85d67b6f0c4)

## Calit 기능 소개

### 1. 로그인 페이지

- firebase 구글 연동 로그인

![로그인 페이지](https://github.com/wowba/Calit/assets/87873821/cf1b6223-a229-4f38-9d9b-105922bc0227)

### 2. 프로젝트 리스트 페이지

- 프로젝트 CRUD (이미지 및 제목 변경)

![프로젝트 리스트 페이지](https://github.com/wowba/Calit/assets/87873821/1a220dbc-869a-4f07-81ad-fdd19acda4cf)

### 3. 프로젝트 메인 페이지 헤더

- 프로젝트 멤버 / 북마크 / 프로필 모달

![헤더 기능 보여주기](https://github.com/wowba/Calit/assets/87873821/181a09a6-1b7a-43df-9157-dca5cfc66ba2)

### 4. 프로젝트 메인 페이지 캘린더 모달

- 드래그를 통한 칸반 생성 및 RUD

![캘린더 모달 내 칸반 생성 및 드래그](https://github.com/wowba/Calit/assets/87873821/1df6d0a8-872e-43bd-8ef0-ad23fdb01724)
![캘린더 모달 내 칸반 삭제](https://github.com/wowba/Calit/assets/87873821/384de0f7-a4ad-44df-b93d-1518399fe3e9)

### 5. 프로젝트 메인 페이지 칸반 모달

- 칸반 내 스테이지 및 투두 CRUD 및 드래그

![칸반모달 기능 보여주기](https://github.com/wowba/Calit/assets/87873821/4c177bf2-c0d8-4695-8f87-25854f86548e)

### 6. 프로젝트 메인 페이지 투두 모달

- 투두 RUD 및 투두 내 업데이트 CRUD

![투두모달 기능 보여주기](https://github.com/wowba/Calit/assets/87873821/4166b7dc-3414-4674-8705-e1aa17636066)

## ERD

![image](https://github.com/wowba/Calit/assets/87873821/2bc5c32a-52da-4e1d-8989-9f1328200029)

## Data Modeling

![image](https://github.com/wowba/Calit/assets/87873821/d4bbb0bb-8922-424e-9db9-96793c500390)

## :clap: Contributors

<table>
    <tr>
        <td align="center"><img alt="avatar" src="https://github.com/wowba.png" width="100"></td>
        <td align="center"><img alt="avatar" src="https://github.com/SOL-MI.png" width="100"></td>
        <td align="center"><img alt="avatar" src="https://github.com/applevalley.png" width="100"></td>
    </tr>
    <tr>
        <td align="center"><a href="https://github.com/wowba">이영욱</a></td>
        <td align="center"><a href="https://github.com/SOL-MI">고솔미</a></td>
        <td align="center"><a href="https://github.com/applevalley">남현준</a></td>
    </tr>
</table>

## 개인별 작업 내역

<details>
<summary>이영욱 작업 내역</summary>

### 이영욱

- 팀 리더
  - 일정 조정 및 전체 개발 진행 프로세스 관리감독
- 개발환경
  - Github / Firebase를 이용한 개발환경 (CICD, DB, 웹 호스팅) 설정
- 디자인
  - 디자인 회의 참여 및 페이지별 디자인 아이디어 제안
  - styled-components 라이브러리를 이용한 Global Style, theme 작성
  - 프로젝트 메인 페이지 캘린더 / 칸반 / 투두 모달 공용 외부 레이아웃
  - 공용 에러페이지 레이아웃
  - 공용 로딩페이지 레이아웃
  - 공용 Input 레이아웃
  - 로그인 페이지 레이아웃
  - 프로젝트 메인 페이지 캘린더 / 칸반 모달 내부 레이아웃
  - 유저 프로필 모달 레이아웃
  - 배경색에 따른 svg / text 색상 변경
- 기능
  - firebase 연동 구글 로그인 / 로그아웃 기능 추가
  - react-router-dom 의 중첩 라우팅을 이용하여 비로그인 / 로그인 / 프로젝트 인증 라우트 제작
  - 프로젝트 인증 라우터 및 프로젝트 메인 페이지 내 firebase onSnapshot을 이용한 실시간 데이터를 Recoil을 이용해 관리 (유저, 프로젝트, 칸반, 투두)
    - 관리되는 각 Recoil State는 프로젝트 내에서 상시 사용 / 데이터 변경시 실시간으로 화면 반영
    - 프로젝트 체크 라우터 내 유저 유효성 검사 로직 작성
  - fullCalendar 라이브러리를 이용한 캘린더 모달 디자인 및 기능 구현
    - fullCalendar를 이용한 칸반 CRUD
    - 캘린더 내 삭제된 칸반 복구 기능 구현 및 삭제 모달 제작
  - hello/pangea-dnd(react-beautiful-dnd)라이브러리를 이용한 칸반 모달 디자인 및 기능 구현
    - 칸반모달 내 투두 및 스테이지 CRUD
    - 스테이지 및 투두 드래그 기능 구현
  - react-datepicker 라이브러리를 이용한 날짜 선택 공용 컴포넌트 제작
  - react-select 라이브러리를 이용한 사용자 선택 공용 컴포넌트 제작
  - 프로젝트 별 유저 프로필 업데이트 기능 구현
  </details>

<details>
<summary>고솔미 작업 내역</summary>

### 고솔미

- 디자인
  - 전체적인 디자인 시안 제작, 디자인 시스템 구축 및 세부 디자인 컨펌
  - 헤더 및 버튼 애니메이션
  - 헤더 팀 멤버 모달 레이아웃
  - 레이아웃 관련 공통 컴포넌트 제작
  - 프로젝트 리스트 페이지 전체 레이아웃
  - 투두 모달 전체 레이아웃
  - react-select 라이브러리 디자인 커스텀
- 기능
  - 프로젝트 생성 및 수정 기능
  - DB 컬렉션 생성 API 제작 (칸반, 투두 컬렉션)
  - Storage 내 이미지 삭제 utils 제작
  - todoState를 recoil로 관리
  - 멤버 초대하기 및 내보내기 기능 구현
    - 권한에 따른 기능 사용 제한
    - 대기열 추가 및 삭제
  - 사이드바 최근 칸반 바로가기 기능
    - recoilPersist를 통한 관리
    - local storage에 최근 접속한 칸반 데이터 저장 및 개수 제한
    - 가장 최근에 접속한 칸반을 상단으로 이동 / 삭제 /
  - 재활용 가능한 공통 컴포넌트 제작
    - CommonTextArea 공통 컴포넌트 / 입력에 따른 height 조절 기능
    - 링크 복사하기 기능
  - 투두 모달 세부 기능
    - 투두 삭제
    - 업데이트 RUD
    - react-md-editor 라이브러리 활용
  - react-select 라이브러리를 활용한 컴포넌트 내 기능 제작
    - 컬러 변경 버튼
    - 옵션 삭제 기능
    </details>

<details>
<summary>남현준 작업 내역</summary>

### 남현준

- 디자인
  - 헤더 레이아웃 작성
- 기능
  - 헤더 구현
    - 헤더 기능 구현
    - ModalCommonLayout 공통 컴포넌트 - 헤더 내 모달 공통 레이아웃
  - 북마크 모달
    - 정규식을 통한 입력 검증
  - 튜토리얼 기능
    - local storage에 튜토리얼 열람 여부 저장
    - recoil을 통한 튜토리얼 다시보기 상태관리
  - sweetalert2 라이브러리를 통한 알림 UI 개선
  </details>

## :file_folder: 폴더 구조

```
📦
├─ public - static 파일
├─ src
│  ├─ api - firebase API 작성
│  ├─ assets - 이미지, 폰트 등
│  ├─ components - 공통 컴포넌트 (nav, sidebar...)
│  ├─ pages - 페이지별 컴포넌트
│  │  └─ MainPage
│  │  └─ ...
│  ├─ recoil - 상태관리 파일 폴더
│  │  ├─ atoms
│  │  └─ selectors
│  ├─ types - TS interface, type 등 타입 관련
│  └─ utils - 공통 함수
└─ ©generated by Project Tree Generator

```

## :hammer: Stack

|            | Stack                                                                                                                                                                                                                                                                                                                                       |
| :--------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|    언어    | <img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">                                                                                                                                                                                                                              |
|   디자인   | <img src="https://img.shields.io/badge/figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white">                                                                                                                                                                                                                                        |
|    서버    | <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black"/>                                                                                                                                                                                                                                 |
| 라이브러리 | <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black"/> <img src="https://img.shields.io/badge/styled components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white"/> <img src="https://img.shields.io/badge/recoil-007AF4?style=for-the-badge&logo=recoil&logoColor=black"/> |
| 개발 환경  | <img src="https://img.shields.io/badge/Prettier-F7B93E?logo=prettier&logoColor=fff&style=for-the-badge"/> <img src="https://img.shields.io/badge/Eslint-4B32C3?logo=eslint&logoColor=fff&style=for-the-badge"/>                                                                                                                             |
|    협업    | <img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">                                                                                                                                                                                                                                      |

## Git Branches

- main: 배포용 브랜치
- #\<issueNumber>: 개별 개발용 브랜치
  - 브랜치 생성 전 issue에 작업내역 생성 후 번호 할당

## :computer: Commit / PR 컨벤션

| 명칭     | 의미                               |
| -------- | ---------------------------------- |
| Feat     | 새로운 기능 추가                   |
| Fix      | 버그 수정                          |
| Docs     | 문서 수정                          |
| Design   | CSS 혹은 폰트, 이미지 파일 등 추가 |
| Refactor | 코드 리팩토링                      |
| Chore    | 빌드 업무 수정, 패키지 매니저 수정 |
