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

## 반응형 Grid
### antd/Row, Col
- xs: 모바일
- sm: 태블릿
- md: 작은 데스크탑

* n / 24 라고 생각하면 됨.

- Row의 gutter 옵션은 컬럼들이 사이에 간격을 주는 것



## useMemo, useCallback
- useCallback : 함수를 캐싱
- useMemo: 값을 캐싱

- 함수형 컴포넌트는 그냥 '함수'이며, 단지 jsx를 반환하는 함수이다.
- 컴포넌트가 렌더링되는 것은 누군가 그 함수를 호출하여서 실행되는 것인데, 함수가 실행될 때마다 내부 선언되어있는 표현식(변수, 함수)도 매번 다시 선언되어 사용된다.
- 컴포넌트는 자신의 state가 변경되거나, 부모에게서 받는 props가 변경되었을 때마다 리렌더링 된다.
- 상위 컴포넌트로부터 a,b라는 props를 전달받는다 할 때, 인자가 하나라도 변경될 때마다 리렌더링됨. props.a만 변경되어도 props.b도 다시 함수를 호출해서 재계산하게 되는 불편함이 생김
- useMemo, useCallback을 사용해서 첫 렌더링, 마운트될 때만 메모리에 할당되고 그 뒤는 두 번째 인자의 정보에 따라 사용됨.

## style 객체 사용 주의사항
``` HTML
<div style={{ marginTop: 10 }}>
</div>
```
- 이런식으로 직접적인 style 객체값을 넣어주게 되면 (inline styling(인라인 스타일링)) style 객체 때문에 reRendering 되어버림 (최적화 X)
- 이유 : {} === {} 객체의 값은 false이기 때문에 다른 값으로 취급되므로 React는 virtual DOM으로 매번 검사를 하며 달라진 부분을 찾음. 그렇기 때문에 달라졌다고 확인되어 reRendering되는 문제가 발생함.

#### 해결법 1) styled-components
``` JS
const ButtonWrapper = styled.div`
	margin-top: 10px;
`;

<ButtonWrapper>
<div></div>
</ButtonWrapper>
```
- 이런식으로 styled-components를 통해서 이미 styled된 div를 생성하여 reRendering되지 않게 처리할 수도 있음.

#### 해결법 2) useMemo()
``` JS
const style = useMemo(() => ({ marginTop: 10 }), []);

<div style={style}>
</div>
```
- useMemo()를 통해 값을 캐싱하여 reRendering 최적화함

### Hooks 함수형 컴포넌트의 reRendering
- 함수형 컴포넌트에서 리렌더링될 시에는 처음부터 끝까지 다시 실행되는 것은 맞음
- useCallback은 이전 컴포넌트와 비교 후 처리해서 바뀐게 없으면 그대로 처리
- jsx부분에서 바뀐 부분이 있다면 '바뀐 부분만' 다시 그림
