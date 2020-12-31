# NextJS-ExpressJS

- 전통적인 SSR : 브라우저 - 프론트 - 백 - DB 통신 방법은 한 방향으로 완전히 갔다가 다시 돌아옴. html과 데이터를 합쳐서 전체가 한번에 그려진다는 장점이 있지만 그만큼 로딩속도가 느림


- CSR: SPA는 먼저 데이터 없는 페이지를 띄워주고 로딩하는 동안에 백엔드서버에 직접적으로 요청하여 데이터를 받아온 후 보여줌. 데이터를 받아오는게 느릴 수 있지만 사용자에게 빠르게 인터랙션이 필요할 때 사용하면 좋음. 하지만 모든 페이지를 불러와야해서 오히려 느려질 수 있음. 처음에 로딩페이지가 보여지기 때문에 검색 엔진이 확인하지 못할수도 있음 (하나의 페이지에서 컴포넌트만 바꾸면서 보여줌)

## 2가지 해결 방안
-> 검색 엔진 해결을 위해 서버사이드 랜더링 
  - pre render: 검색엔진을 알아차리고 검색 엔진에게는 데이터를 받아서 데이터와 함께 html을, 사용자에게는 일반 리액트 방식 화면을
  - Server Side Rendering: 첫 방문만 html, 페이지 전환(Link나 a태그 눌렀을 때)부턴 리액트 방식으로 (NextJS)

-> CSR은 모든 페이지를 불러옴으로써 더 느려질 수도 있으므로 방문한 페이지만 보여주게 code splitting하는 방법

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

(pages/index, profile, signup은 모두 AppLayout에 각각 감싸서 적용되어있고 적용된 컴포넌트들이 _app.js의 Component Props로 자동 처리됨.)

## pages/_app.js
- pages들의 공통 부분
- 모든 컴포넌트에 공통되는 작업을 넣어 처리해줌
- index.js나 profile.js 등의 return 부분 내용이 _app.js의 Component Props로 들어가서 처리됨.
- Layout처럼 따로 감싸주지 않더라도 자동으로 처리

## components/AppLayout.js
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


### Custom Hooks을 통한 코드 재사용성 높이기
- Login이나 Signup Form에서의 Input태그들 (ID, Nickname, password, password-check) 은 useState와 useCallback을 쓴다는 공통점이 있고 비슷한 로직인데 반해 모든 Input 태그에 대해서 같은 로직을 반복하려면 코드가 번잡해짐
- Custom Hooks를 통해서 공통된 부분을 따로 빼내서 재사용성을 높임
- hooks 디렉토리를 생성 후 useInput.js 생성
- LoginForm의
``` JS
const [id, setId] = useState('')
const onChangeId = useCallback((e) => {
	setId(e.target.value)
}, [])
```
- 이 부분이 공통적으로 반복되므로
``` JS
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
``` JS
const [id, onChangeId] = useInput('');
```
- useInput Hooks로 사용


## Redux
- next에 redux를 쉽게 붙일 수 있게 해주는 next redux wrapper가 있음.
- npm i next-redux-wrapper@6

- store 디렉토리 생성 후 ConfigureStore.js 생성
- 원래의 redux는 app.js에서 <Provider>로 감싸줘야했지만 next-redux-wrapper에서는 알아서 감싸줌
- _app.js를 export 할 때 app 컴포넌트를 하이오더컴포넌트로 감싸줌 (wrapper.withRedux(App))

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
- (action은 type과 데이터가 존재)
- action을 실행시키기 위해서는 dispatch가 필요. dispatch하면 중앙 저장소의 데이터가 바뀜 (useDispatch 사용)
- redux 저장소에서 데이터를 가져다 사용하고 있는 컴포넌트들은 알아서 바뀐 데이터로 업데이트 됨.
- store의 데이터는 useSelector를 통해서 받아와서 사용이 가능함

#### reducer
- action을 dispatch한다고 해서 알아서 자동으로 데이터가 바뀌는 것이 아님.
- action에서 { type: "CHANGE_NAME", data: ~~ } type이 CHANGE_NAME일 때 CHANGE_NAME이 어떤 작업을 하는 action인지 reducer에 다 작성해줘야 함. (보통 swtich문으로 작업)
``` JS
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

### redux dev tools
- redux dev tools를 브라우저상에서 확인하며 사용하기 위해 npm i redux-devtools-extension
- ConfigureStore.js에서 enhancer 미들웨어 생성하여 배포, 개발 모드를 두어 부착

- user, post, comment 등 많아지면 액션과 switch문도 길어지기 때문에 reducer를 쪼갬
- 각각 reducer의 initialState를 후에 합쳐야하기 때문에 export 지정 (combineReducers를 통해 reducers/index에서 합침)

- reducer를 쉽게 합치지못하는 이유는 reducer는 객체가 아닌 함수이기 때문

- 원래는 combineReducers({ user, post }) 이렇게만 넣어주면 되지만
- Redux SSR을 위한 HYDRATE를 넣어줘야해서 index라는 HYDRATE를 위한 Reducer를 추가함.

## Styled Components - ServerSide Rendering
- SSR시에 프론트서버에서는 html과 데이터를 한번에 가져오는데 그 때 Styled Components에 SSR 설정을 해주지 않았기 때문에, styled Components가 적용이 안됨.

-------------------------------------------------------------------
### ref
- 실제 DOM에 접근하기 위해 사용

``` JS
const imageInput = useRef();
const onClickImageUpload = useCallback(() => {
	imageInput.current.click();
}, [imageInput.current]);

<input type="file" multiple hidden ref={imageInput}/>
<Button onClick={onClickImageUpload}>이미지 업로드</Button>
```

- useRef()를 통해서 hidden 상태인 input 태그에 접근해서 '이미지 업로드' 버튼 클릭시 input태그가 클릭되어 이미지 선택 창이 뜨게 함.


### onClick을 통한 toggle 구현
``` JS
const [liked, setLiked] = useState(false);

const onToggleLike = useCallback(() => {
	setLiked((prev) => !prev);
}, []);
```
- prev는 이전 데이터를 가지고 있음. 이전 데이터를 통해 다음 데이터를 만듦.

### img 태그의 role
- img 태그에는 원래 onClick메소드를 넣지 않지만, 넣었을 때 role: "presentation" 을 주면 스크린리더가 '클릭할 순 있지만 굳이 클릭할 필요는 없다'로 인식해줌. 


### react-slick 같은 이미 클래스명이 정해져있는 모듈에 대해서 style 적용법
``` JS
import styled, { createGlobalStyle } from 'styled-components';

const Global = createGlobalStyle`
	.slick-slide {
		display: inline-block;
	}
`;

<Global />
```

---------------------------------------------------------------------
## Redux-thunk
- redux의 미들웨어 (redux middleware: redux의 기능을 향상시켜주는 역할)
- redux가 비동기 액션을 dispatch 할 수 있도록 도와줌
- dispatch를 나중에 한번에 묶어서 여러개를 할 수 있게 하는 역할
- npm i redux-thunk

### thunk를 사용하는 이유
- Action을 보낸다고 바로 처리작업(ex. 로그인)이 진행되는 것이 아님.
- 백엔드 서버에 요청을 보내고 응답을 받아와야 가능하는 작업임

### thunk를 사용할 때는
``` JS
export const loginRequestAction = (data) => {
	return {
		type: 'LOG_IN_REQUEST',
		data,
	}
}

export const logoutRequestAction = () => {
	return {
		type: 'LOG_OUT_REQUEST',
	}
}

export const loginSuccessAction = (data) => {
	return {
		type: 'LOG_IN_SUCCESS',
		data,
	};
};

export const logoutSuccessAction = () => {
	return {
		type: 'LOG_OUT_SUCCESS',
	};
};

export const loginFailureAction = (data) => {
	return {
		type: 'LOG_IN_FAILURE',
		data,
	};
};

export const logoutFailureAction = () => {
	return {
		type: 'LOG_OUT_FAILURE',
	};
};
```
- 비동기 작업임으로 요청, 성공, 실패 3가지 경우가 존재해야 함.

``` JS
export const loginAction = (data) => {
	return (dispatch, getState) => {
		const state = getState();

		axios.post('/api/login')
			.then((res) => {
				dispatch(loginSuccessAction(res.data));
			})
			.catch((err) => {
				dispatch(loginFailrueAction(err));
			})
	}
}
```
- 비동기 Action Creator가 생성되어야 함.

* Redux-thunk는 소스코드가 짧지만 기능이 dispatch를 여러개를 한번에 할 수 있는 것 뿐. 
* Redux-saga는 
	- Delay 기능(몇 초 뒤에 액션이 실행되게, thunk라면 setTimeOut을 직접 구현해야 함.), 
	-	takelatest 기능(연속으로 요청이 들어오면 가장 마지막 요청만 받고 그 전 요청은 무시), 
	-	throttle 기능 (1초에 n번 이상 요청이 들어오면 차단하는 등의 기능)

## Next Redux Saga
- npm i next-redux-saga

- saga를 사용할 때는 _app.js의 export 부분에서
``` JS
export default wrapper.withRedux(withReduxSaga(NodeBird));
```
- widthReduxSaga로 한번 더 감싸줌

- /front/sagas/index.js 생성
### generator (function*)
``` JS
const gen = function* () {}
gen().next() // .next()로 실행함
```

``` JS
const gen = function* () {
    console.log(1);
    yield;
    console.log(2);
    yield;
    console.log(3);
    yield 4;
}

const generator = gen()
generator.next() // 1 출력 후 멈춤 (done: false, value:undefined)
generator.next() // 2  "         (done: false, value:undefined)
generator.next() // 3  "         (done: false, value:undefined)
generator.next() // undefined () (done: true, value:4)
```
- generator는 yield를 만나면 멈춤 (중단점 존재)

``` JS
let i = 0;
const gen = function* () {
	while (true) {
		yield i++;
	}
}

const g = gen();
g.next() // value: ~~~, done: false
```
- generator에서는 무한루프를 사용해도 yield가 있기 때문에 멈춤
- 이 특성을 바탕으로 event처리처럼 어느 특정상황에서 .next()를 실행하게 할 수도 있음.

### saga Effects
- all, fork, call, put

* all : all([]) 배열을 받고 배열안의 것들을 모두 실행시킴
* fork : 비동기적 제네레이터 함수를 실행시킴
* call : 동기적 제네레이터 함수 실행시킴 (fork와 다름)
* take : take(액션, 제네레이터 함수) 액션이 실행될 때까지 기다리고, 실행되면 제네레이터 함수를 실행시킴.
* put: dispatch 

``` JS
function logInAPI(data) {
	return axios.post('/api/login', data)
}

function* logIn(action) {
	try{
		const result = yield call(logInAPI, action.data)
		// call은 동기적으로 동작하며, call함수자체에 두 번째 인자부터 logInAPI에 넘겨줄 데이터를 추가해줌

		yield put({
			type: 'LOG_IN_SUCCESS',
			data: result.data
		});
	} catch(err) {
		yield put({
			type: 'LOG_IN_FAILURE',
			data: err.response.data
		});
	}
}

function* watchLogin() {
	yield take('LOG_IN_REQUEST', logIn)
	// LOG_IN_REQUEST의 액션자체가 logIn함수의 매개변수로 전달됨.
	// logIn함수에서 action.type, action.data로 사용 가능
}

export default function* rootSaga() {
	yield all([
		fork(watchLogin),
		fork(watchLogout),
		fork(watchAddPost),
	])
}
```
- 이런 형태로 비동기 Action Creator가 직접 실행되는 것이 아니라 Event Listener같은 역할을 수행
- 요청이 많다 생각될 때는
``` JS
function* watchLogin() {
	yield take('LOG_IN_REQUEST', logIn)
}
```
- REQUEST 자체를 수행하는 것도 마찬가지라 액션을 줄여서 LOG_IN이 아니라 LOG_IN_REQUEST부터 시작하는 것이 좋을 수도 있음

- 사실 call(loginAPI, action.data)가 아닌 loginAPI(action.data)를 해도 실행되며 yield를 쓰지않아도 동작은 될 수 있음. 하지만 프로그램을 작성할 때는 동작하는 것 뿐만 아니라 테스트도 할 수 있어야하는데, generator는 테스트하기가 쉬움.(한줄 한줄 실행해보면서 확인할 수 있음)

### take
- take는 1회용 이기때문에
``` JS
function* watchLogin() {
	yield take('LOG_IN_REQUEST', logIn)
}

function* watchLogout() {
	yield take('LOG_OUT_REQUEST', logOut);
}
```
- 한번 로그인하고 한번 로그아웃하면 끝, 사라져버림
- 그렇기때문에 while(true)를 통해서 yield를 감싸서 무한하게 사용할 수 있게 할 수 있음.

``` JS
function* watchLogin() {
	while (true) {
		yield take('LOG_IN_REQUEST', logIn)
	}
}

// 또는 

function* watchLogin() {
	yield takeEvery('LOG_IN_REQUEST', logIn)
}
```
- while true는 동기적인 동작
- takeEvery는 비동기로 동작 (많이 쓰임)

- takeLatest는 클릭실수로 클릭을 2번 했을 때, 마지막 요청만 인식 (Backend로 요청은 2번하지만 응답만 하나만 받는 형태라 Backend에서 요청이 한번에 2번이 왔는지 체크해줘야하는 단점이 있음) 
=> 이럴 때 throttle을 사용 (하지만 거의 takeLatest를 사용하고 서버에서 검사하는 방식을 사용하긴 함.)
``` JS
function* watchAddPost() {
	yield throttle('ADD_POST_REQUEST', addPost, 2000);
}
```
- 2초 동안에는 한번만 실행됨.

- takeLeading 첫번째 요청만 인식

----------------------------------------------------------------------
#### redux-saga 로그인 흐름
1. LoginForm 에서 로그인을 요청
2. dispatch를 통해 loginRequestAction을 호출함
3. sagas/user.js의 watchLogIn에서 loginRequestAction 이벤트를 확인 후 처리함과 동시에 reducers/user.js의 switch case 'LOG_IN_REQUEST'문도 실행됨

--------------------------------------------------------
## shortid
- npm i shortid
- 배열을 통해서 값을 뿌려줄 때, key값이 필요한데 그때 키 값을 랜덤으로 생성해줌.

``` JS
import shortId from 'shortid';
...
{
	id: shortId.generate()
}
```

## 불변성 지키며 dummyComment 추가하기
``` JS
const dummyComment = (data) => ({
	id: shortId.generate(),
	content: data,
	User: {
		id: 1,
		nickname: 'dh',
	},
});

case ADD_COMMENT_SUCCESS: {
			const postIndex = state.mainPosts.findIndex((v) => v.id === action.data.postId);
			const post = { ...state.mainPosts[postIndex] };
			post.Comments = [dummyComment(action.data.content), ...post.Comments];
			const mainPosts = [...state.mainPosts];
			mainPosts[postIndex] = post;
			
			return {
				...state,
				mainPosts,
				addCommentLoading: false,
				addCommentDone: true,
			};
		}
```
1. state.mainPosts에서 댓글을 작성한 게시물의 id와 같은 게시물의 인덱스를 가져옴
2. 가져온 인덱스를 통해 해당 게시물 복사해서 가져옴
3. 복사한 게시물에 dummyComment와 기존 댓글을 합침
4. mainPosts를 복사해서 가져와서, 해당 게시물 인덱스의 게시물을 복사한 게시물로 변경함.
- (바뀌지 않는 것들은 그대로 불변하게 유지)


## immer
``` JS
import produce from 'immer';

onst reducer = (state = initialState, action) => {
	return produce(state, (draft) => {

	});
```
- draft가 state의 역할을 하고, draft는 막 수정해도 상관없음
- 알아서 produce를 통해 다음상태로 만들어줌.

``` JS
const reducer = (state = initialState, action) => {
	switch (action.type) {
		case ADD_POST_REQUEST:
			return {
				...state,
				addPostLoading: true,
				addPostDone: false,
				addPostError: null,
			};

		case ADD_POST_SUCCESS:
			return {
				...state,
				mainPosts: [dummyPost(action.data), ...state.mainPosts],
				addPostLoading: false,
				addPostDone: true,
			};

		case ADD_POST_FAILURE:
			return {
				...state,
				addPostLoading: false,
				addPostError: action.error,
			};

		case REMOVE_POST_REQUEST:
			return {
				...state,
				removePostLoading: true,
				removePostDone: false,
				removePostError: null,
			};

		case REMOVE_POST_SUCCESS:
			return {
				...state,
				mainPosts: state.mainPosts.filter((v) => v.id !== action.data),
				removePostLoading: false,
				removePostDone: true,
			};

		case REMOVE_POST_FAILURE:
			return {
				...state,
				removePostLoading: false,
				removePostError: action.error,
			};

		case ADD_COMMENT_REQUEST:
			return {
				...state,
				addCommentLoading: true,
				addCommentDone: false,
				addCommentError: null,
			};

		case ADD_COMMENT_SUCCESS: {
			const postIndex = state.mainPosts.findIndex(
				(v) => v.id === action.data.postId,
			);
			const post = { ...state.mainPosts[postIndex] };
			post.Comments = [dummyComment(action.data.content), ...post.Comments];
			const mainPosts = [...state.mainPosts];
			mainPosts[postIndex] = post;

			return {
				...state,
				mainPosts,
				addCommentLoading: false,
				addCommentDone: true,
			};
		}

		case ADD_COMMENT_FAILURE:
			return {
				...state,
				addCommentLoading: false,
				addCommentError: action.error,
			};

		default:
			return state;
	}
};

```
- state 불변성 reducer 원형 코드

``` JS
const reducer = (state = initialState, action) => {
	return produce(state, (draft) => {
		switch (action.type) {
			case ADD_POST_REQUEST:
				draft.addPostLoading = true;
				draft.addPostDone = false;
				draft.addPostError = null;
				break;

			case ADD_POST_SUCCESS:
				draft.addPostLoading = false;
				draft.addPostDone = true;
				draft.mainPosts.unshift(dummyPost(action.data));
				break;

			case ADD_POST_FAILURE:
				draft.addPostLoading = false;
				draft.addPostError = action.error;
				break;

			case REMOVE_POST_REQUEST:
				draft.removePostLoading = true;
				draft.removePostDone = false;
				draft.removePostError = null;
				break;

			case REMOVE_POST_SUCCESS:
				draft.removePostLoading = false;
				draft.removePostDone = true;
				draft.mainPosts = draft.mainPosts.filter((v) => v.id !== action.data)
				break;

			case REMOVE_POST_FAILURE:
				draft.removePostLoading = false;
				draft.removePostError = action.error;
				break;
				
			case ADD_COMMENT_REQUEST:
				draft.addCommentLoading = true;
				draft.addCommentDone = false;
				draft.addCommentError = null;
				break;
			
			case ADD_COMMENT_SUCCESS: {
				const post = draft.mainPosts.find((v) => v.id === action.data.postId);
				post.Comments.unshift(dummyComment(action.data.content));
				draft.addCommentLoading = false;
				draft.addCommentDone = true;
				break;
			}

			case ADD_COMMENT_FAILURE:
				draft.addCommentLoading = false;
				draft.addCommentError = action.error;
				break;

			default:
				break;
		}

	});
}
```
- immer를 사용한 코드

- case ADD_COMMENT_SUCCESS의 코드량이 확연히 줄어듦 (불변성을 생각하지않고 짜도 되기에) + ADD_POST_TO_ME, REMOVE_POST_OF_ME

- draft를 불변성 상관없이 바꿔주면 immer가 알아서 다음 state를 불변성있게 만들어줌