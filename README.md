# NextJS-ExpressJS

- 전통적인 브라우저 - 프론트 - 백 - DB 통신 방법은 한 방향으로 완전히 갔다가 다시 돌아옴. 전체가 한번에 그려진다는 장점이 있지만 그만큼 로딩속도가 느림


- SPA는 먼저 페이지를 띄워주고 로딩하는 동안에 백엔드서버에 직접적으로 요청하여 데이터를 받아온 후 보여줌. 데이터를 받아오는게 느릴 수 있지만 사용자에게 빠르게 인터랙션이 필요할 때 사용하면 좋음. 하지만 모든 페이지를 불러와야해서 오히려 느려질 수 있음. 처음에 로딩페이지가 보여지기 때문에 검색 엔진이 확인하지 못할수도 있음

## 2가지 해결 방안
-> 검색 엔진 해결을 위해 서버사이드 랜더링 
  - pre render: 검색 엔진에게는 html을, 사용자에게는 일반 리액트 화면을
  - 첫 방문만 html, Link나 a태그 눌렀을 때부턴 리액트 방식으로 (NextJS)

-> 방문할 페이지만 보여주게 code splitting

* NextJS를 쓸 필요 없는 서비스 => Admin 페이지


-----------------------------------------------------
- react의 hot loader 기능이 있어서 서버를 껐다키지 않아도 적용됨.
- next는 import React from 'react' 구문이 필요 없음
=> next는 pages폴더는 이름이 고정으로 'pages'여야 하며, pages폴더를 인식하고 이 안에 있는 파일들을 개별적인 페이지로 만들어 줌 (Code Splitting된 페이지로 만들어줌)
- Component들과 1:1로 매칭하여 링크를 만들어줌

- Page가 아닌 재사용을 위한 컴포넌트들은 components 폴더를 따로 생성하여 관리 (폴더명이 components가 아니여도 됨. pages폴더는 이름을 무조건 pages로)

- NextJS의 Link는 React와 다르게 react-router-dom이 아닌 자체적인 Link가 있음.
- Next의 Link는 to가 아닌 href를 적고, Link 태그 안에 a태그를 추가해줌
``` HTML
<Link href="/profile"><a>프로필</a></Link>
```

----------------------------------------------------------
antd는 잘 만들어진 css 프레임워크지만 개성이 없어질 수 있음 (실제로 디자이너가 존재하는 회사에서는 antd는 Admin사이트에서 사용하는 정도)
antd, styled-components, emotion, material-ui


## pages/_app.js
- pages들의 공통 부분
- 모든 컴포넌트에 공통되는 작업을 넣어 처리해줌
- index.js나 profile.js 등의 return 부분 내용이 _app.js의 Component Props로 들어가서 처리됨.
- Layout처럼 따로 감싸주지 않더라도 자동으로 처리

## pages/components/AppLayout.js
- 특정 컴포넌트에 공통인 작업들은 Layout을 만들어서 적용
- 개별 컴포넌트를 감싸서 사용
``` HTML
<AppLayout>
  <div>Hello, Next!</div>
</AppLayout>
```
- 위의 코드처럼 감싸서 AppLayout에서 { Chidren } props로 받은 후 처리

## next/head
- html의 <head></head>를 추가하고 싶을 때
- 그냥 head를 사용하는 것이 아니라 next에서 Head Component를 제공하기때문에 사용하면 됨.
