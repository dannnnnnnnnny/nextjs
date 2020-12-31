### npm i sequelize, sequelize-cil, mysql2
#### npx sequelize init (시퀄라이즈 세팅 (seeders, migrations 등의 폴더가 자동 생성됨))
- 시퀄라이즈는 JS 코드를 mysql 코드로 바꿔서 처리해주는 역할
- 시퀄라이즈에서는 DB 테이블을 Model이라고 함

#### Model의 기본
``` JS
module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define('User', {	// 자동으로 mysql에 'users' 테이블로 저장
		email: {},
		nickname: {},
		password: {},
	}, {
		charset: 'utf8',
		collate: 'utf8_general_ci', // 한글 저장
	});

	User.associate = (db) = {}; // 관계 설정 부분
	return User;
};
```

- .associate 에 모델간 관계를 설정해줌

- user와 userInfo 같은 1:1 관계가 있다하면 hasOne, belongsTo
- belongsTo가 들어가는 Model에는 UserId, 외래키 컬럼이 생김
- 1:N 관계 => hasMany, belongsTo
- N:M 관계 => belongsToMany, belongsToMany

- N:M 관계의 경우에는 어느 한쪽에 외래키가 생기는게 아니라 둘 사이에 테이블이 하나 생김 (ex) Post, Hashtag => trough: PostHashtag)
- 생성되는 테이블의 이름은 through 옵션으로 설정해줄 수 있음
``` JS
// 좋아요 관계
db.User.belongsToMany(db.Post, { through: 'Like' });
db.Post.belongsToMany(db.User, { through: 'Like' });
```

``` JS
db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' });
db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' });
```
- 두 테이블끼리의 관계가 여러개 일 때 헷갈릴 수 있기때문에 as 옵션으로 별칭을 줄 수 있음.
- as 옵션을 주면 예를들어 post.getLikers, user.getLiked처럼 게시물 좋아요 누른 사람, 좋아요 누른 게시물을 가져올 수 있게 됨
---
### 같은 테이블간의 관계도 있을 수 있음.
```js
db.User.belongsToMany(db.User, { 
	through: 'Follow', 
	as: 'Followers', 
	foreignKey: 'FollowingId', 
});
db.User.belongsToMany(db.User, {
	through: 'Follow',
	as: 'Followings',
	foreignKey: 'FollowerId',
});
```
같은 테이블간의 관계에서는 foreignKey가 존재
- 왜냐하면 User와 Post간의 N:M 좋아요 관계에서는 하나의 테이블이 사이에 생성되어 UserId, PostId로 처리되는데, 같은 테이블 안에서는 UserId, UserId로 생성되어 구별이 되지 않음.
- foreignKey로 이름을 바꿔줌

### 리트윗 관계
``` JS
db.Post.belongsTo(db.Post, { as: 'Retweet' });
```
- 리트윗 (Post테이블에 RetweetId 생성됨)


#### Post 테이블
- id 1을 2,3이 retweet 했다고 하면 

|id        |content            |Retweet  |
| ------------- |:-------------:| -----:|
| 1      | aa | null |
| 2      | bb |   1  |
| 3 	   | cc |   1  |

``` JS
// app.js
const db = require('./models');

db.sequelize.sync()
	.then(() => {
		console.log('db 연결 성공');
	})
	.catch(console.error());
```
- DB 연결 실행 코드

### npx sequelize db:create
- 위 명령어를 통해서 DB 생성을 진행 후 서버 실행하면 됨
- 그냥 진행시 Unknown Database 오류가 발생함
- Access Denied for user 에러는 비밀번호가 틀렸을 시 발생



## Cookie & Session
```js
// app.js
app.use(cookieParser());
app.use(session());
app.use(passport.initialize());
app.use(passport.session());
```
- 로그인시 클라이언트와 서버는 같은 정보를 들고 있어야 함. (다른 서버이기 때문에 데이터가 저절로 공유되는 것이 아님)
- 백엔드에 있는 사용자의 정보를 브라우저에 보내주는 것이 아닌 특정 랜덤한 토큰을 보내줌 ( => 쿠키, 세션)
- 브라우저는 앞으로 백엔드 서버에 요청할 때 해당 쿠키를 같이 보내주면 서버는 쿠키, 세션을 읽어서 사용자를 파악
- 백엔드에는 실제 데이터를 갖고 있고, 브라우저에는 특정 랜덤 토큰(쿠키)를 가지고 있음. => 보안 위협 최소화

- 서버에서 실제 데이터를 전부 가지고 있으면 메모리 문제가 발생할 수 있기 때문에 쿠키에 매칭되는 ID값만 가지고 있음.
- id값을 통해서 DB에 접근하여 해당 유저 정보를 다 가져옴

```js
router.post('/login', )
```
- 로그인시 req.login이 실행되면 /passport/index 의 serializeUser가 실행되고 id 값만 챙김
- deSerializeUser에서는 id 값을 통해 DB에 접근하여 해당 유저의 정보를 가져옴

- Sequelize에서 나오는 데이터는 JSON이라기 보다 JS 객체로 받음