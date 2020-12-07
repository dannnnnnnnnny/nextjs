# NextJS-ExpressJS

- 전통적인 SSR : 브라우저 - 프론트 - 백 - DB 통신 방법은 한 방향으로 완전히 갔다가 다시 돌아옴. html과 데이터를 합쳐서 전체가 한번에 그려진다는 장점이 있지만 그만큼 로딩속도가 느림

- CSR: SPA는 먼저 데이터 없는 페이지를 띄워주고 로딩하는 동안에 백엔드서버에 직접적으로 요청하여 데이터를 받아온 후 보여줌. 데이터를 받아오는게 느릴 수 있지만 사용자에게 빠르게 인터랙션이 필요할 때 사용하면 좋음. 하지만 모든 페이지를 불러와야해서 오히려 느려질 수 있음. 처음에 로딩페이지가 보여지기 때문에 검색 엔진이 확인하지 못할수도 있음 (하나의 페이지에서 컴포넌트만 바꾸면서 보여줌)

## 2가지 해결 방안

-> 검색 엔진 해결을 위해 서버사이드 랜더링

- pre render: 검색엔진을 알아차리고 검색 엔진에게는 데이터를 받아서 데이터와 함께 html을, 사용자에게는 일반 리액트 방식 화면을
- Server Side Rendering: 첫 방문만 html, 페이지 전환(Link나 a태그 눌렀을 때)부턴 리액트 방식으로 (NextJS)

-> CSR은 모든 페이지를 불러옴으로써 더 느려질 수도 있으므로 방문한 페이지만 보여주게 code splitting하는 방법

- NextJS를 쓸 필요 없는 서비스 => Admin 페이지

---

- react의 hot loader 기능이 있어서 서버를 껐다키지 않아도 적용됨.
- next는 import React from 'react' 구문이 필요 없음
  => next는 pages폴더는 이름이 고정으로 'pages'여야 하며, pages폴더를 인식하고 이 안에 있는 파일들을 개별적인 페이지로 만들어 줌 (Code Splitting된 페이지로 만들어줌)
- Component들과 1:1로 매칭하여 링크를 만들어줌

- Page가 아닌 재사용을 위한 컴포넌트들은 components 폴더를 따로 생성하여 관리 (폴더명이 components가 아니여도 됨. pages폴더는 이름을 무조건 pages로)

- NextJS의 Link는 React와 다르게 react-router-dom이 아닌 자체적인 Link가 있음.
- Next의 Link는 to가 아닌 href를 적고, Link 태그 안에 a태그를 추가해줌

```HTML
<Link href="/profile"><a>프로필</a></Link>
```

---

antd는 잘 만들어진 css 프레임워크지만 개성이 없어질 수 있음 (실제로 디자이너가 존재하는 회사에서는 antd는 Admin사이트에서 사용하는 정도)
antd, styled-components, emotion, material-ui

## pages/\_app.js

- pages들의 공통 부분
- 모든 컴포넌트에 공통되는 작업을 넣어 처리해줌
- index.js나 profile.js 등의 return 부분 내용이 \_app.js의 Component Props로 들어가서 처리됨.
- Layout처럼 따로 감싸주지 않더라도 자동으로 처리

## pages/components/AppLayout.js

- 특정 컴포넌트에 공통인 작업들은 Layout을 만들어서 적용
- 개별 컴포넌트를 감싸서 사용

```HTML
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

```HTML
<div style={{ marginTop: 10 }}>
</div>
```

- 이런식으로 직접적인 style 객체값을 넣어주게 되면 (inline styling(인라인 스타일링)) style 객체 때문에 reRendering 되어버림 (최적화 X)
- 이유 : {} === {} 객체의 값은 false이기 때문에 다른 값으로 취급되므로 React는 virtual DOM으로 매번 검사를 하며 달라진 부분을 찾음. 그렇기 때문에 달라졌다고 확인되어 reRendering되는 문제가 발생함.

#### 해결법 1) styled-components

```JS
const ButtonWrapper = styled.div`
	margin-top: 10px;
`;

<ButtonWrapper>
<div></div>
</ButtonWrapper>
```

- 이런식으로 styled-components를 통해서 이미 styled된 div를 생성하여 reRendering되지 않게 처리할 수도 있음.

#### 해결법 2) useMemo()

```JS
const style = useMemo(() => ({ marginTop: 10 }), []);

<div style={style}>
</div>
```

- useMemo()를 통해 값을 캐싱하여 reRendering 최적화함

### Hooks 함수형 컴포넌트의 reRendering

- 함수형 컴포넌트에서 리렌더링될 시에는 처음부터 끝까지 다시 실행되는 것은 맞음
- useCallback은 이전 컴포넌트와 비교 후 처리해서 바뀐게 없으면 그대로 처리
- jsx부분에서 바뀐 부분이 있다면 '바뀐 부분만' 다시 그림

### Custom Hooks을 통한 코드 재사용성 높이기

- Login이나 Signup Form에서의 Input태그들 (ID, Nickname, password, password-check) 은 useState와 useCallback을 쓴다는 공통점이 있고 비슷한 로직인데 반해 모든 Input 태그에 대해서 같은 로직을 반복하려면 코드가 번잡해짐
- Custom Hooks를 통해서 공통된 부분을 따로 빼내서 재사용성을 높임
- hooks 디렉토리를 생성 후 useInput.js 생성
- LoginForm의

```JS
const [id, setId] = useState('')
const onChangeId = useCallback((e) => {
	setId(e.target.value)
}, [])
```

- 이 부분이 공통적으로 반복되므로

```JS
import { useState, useCallback } from 'react';

export default (initialValue = null) => {
	const [value, setValue] = useState(initialValue);
	const handler = useCallback((e) => {
		setValue(e.target.value);
	}, []);

	return [value, handler];
}
```

- 공통된 부분을 따로 빼낸 후

```JS
const [id, onChangeId] = useInput('');
```

- useInput Hooks로 사용

## Redux

- next에 redux를 쉽게 붙일 수 있게 해주는 next redux wrapper가 있음.
- npm i next-redux-wrapper@6

- store 디렉토리 생성 후 ConfigureStore.js 생성
- 원래의 redux는 app.js에서 <Provider>로 감싸줘야했지만 next-redux-wrapper에서는 알아서 감싸줌
- export 할 때 app 컴포넌트를 하이오더컴포넌트로 감싸줌 (wrapper.withRedux(App))

### Redux의 사용 이유

- login, signup, NicknameEditForm 같은 경우 로그인한 유저의 정보, 로그인 여부를 각각 가져야 함.
- 여러 컴포넌트들에 흩어져있는 공통적으로 쓰이는 데이터를 모으고 싶으면 부모 컴포넌트를 두면 됨. -> 부모컴포넌트에서 각각 자식 컴포넌트로 데이터를 보내서 사용할수도 있음.
- 하지만 매번 부모컴포넌트를 만들어서 각각의 자식 컴포넌트로 데이터를 보내주는 과정은 매우 귀찮고 힘듦.
- 중앙에서 데이터를 저장하고 각 컴포넌트에게 뿌려주는 중앙 데이터 저장소 역할을 하는 것이 Redux

- (React의 ContextAPI도 중앙 데이터 저장소 역할을 함.)

- redux는 원리가 간단하기 때문에 에러가 나더라도 쉽게 추적해서 fix 가능. 하지만 코드량이 많아짐
- MobX는 코드량은 적지만 에러 추적이 어려움.

- ContextAPI가 redux와 MobX와의 다른 점은 비동기 부분을 직접 처리해줘야한다는 점.
- 비동기는 요청, 성공, 실패 3가지를 가짐 (서버가 데이터를 주지 못했을 때까지)
- 또한 컴포넌트에서 직접적으로 useEffect를 통해 데이터를 요청해야함.
  => 같은 코드의 중복 발생가능성도 있음. 데이터 요청은 별도의 모듈이나 라이브러리를 통해 하고 컴포넌트는 화면 출력에만 집중하는 것이 좋음.

### Redux 원리

- redux의 저장소의 데이터를 바꾸기 위해서는 action을 생성해줘야 함.
- 데이터를 변경하고 싶을 때는 무조건적으로 action이 필요함.
- (action은 type과 데이터가 존재)
- action을 실행시키기 위해서는 dispatch가 필요. dispatch하면 중앙 저장소의 데이터가 바뀜
- redux 저장소에서 데이터를 가져다 사용하고 있는 컴포넌트들은 알아서 바뀐 데이터로 업데이트 됨.

#### reducer

- action을 dispatch한다고 해서 알아서 자동으로 데이터가 바뀌는 것이 아님.
- action에서 { type: "CHANGE_NAME", data: ~~ } type이 CHANGE_NAME일 때 CHANGE_NAME이 어떤 작업을 하는 action인지 reducer에 다 작성해줘야 함. (보통 swtich문으로 작업)

```JS
switch(action.type) {
	case 'CHANGE_NAME':
		return {
			...state,
			name: action.data,
		}
}
```

- 위 reducer의 return문은 불변성을 위함.
- JS에서는 {} === {}는 false (새로 만든 객체는 false)
- const a = {};
- const b = a;
- a === b 는 true
  => 위의 성질을 이용 (참조 관계에 있으면 true)
- return문에서 {}는 항상 새로운 객체를 만드는 것.

- ...state를 통해서 값은 그대로 유지하고, 바꿀 값만 바꾼 뒤 {}로 새로운 객체를 생성해서 업데이트한다.
  => 객체를 새로 만들어야 변경 내역들이 추적이 가능해짐. (이전, 이후 기록)
- 그대로 복사해서 바꿔버리면 참조 관계이기 때문에 이전 기록도 같이 덮어씌워져, 변경 내역을 확인할 수 없음.
- data를 일일이 작성하지 않고 ...state로 작성하는 이유는 코드량도 있지만 메모리를 위해서 (변경되지 않은 Data들은 그대로 참조됨. 일일이 작성한다면 모든 data가 새롭게 만들어져 메모리를 낭비함.)

- Store의 데이터를 바꾸고 싶을 때마다 action, dispatch, reducer를 만들어줘야 하기때문에 코드량이 매우 많아진다는 단점이 있음.
- 하지만 redux 사용시, action 하나하나 Redux에 기록이 돼서 에러 추적이 편해짐.

- Chrome 확장프로그램인 redux dev tools를 사용하면 시간을 되돌려서도 redux를 테스트해볼 수 있음.

- redux에서의 store는 state와 reducer를 포함하는 것을 뜻함.

#### reducer는 이전 상태(prevState)와 액션을 통해서 다음 상태를 만들어내는 것

- CHANGE_NICKNAME같은 액션의 경우에는 action 생성해내는 함수를 생성하여 동적으로 사용하는 것이 좋음

```JS
const changeNickname = (data) => {
	return {
		type : 'CHANGE_NICKNAME',
		data
	};
};
```

- reducers/index.js의 initialState값은 각 컴포넌트에서 react-redux의 useSelector로 값을 가져올 수 있음.
