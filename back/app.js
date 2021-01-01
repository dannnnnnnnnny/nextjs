const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const morgan = require('morgan');
const db = require('./models');
const passportConfig = require('./passport');
const postsRouter = require('./routes/posts');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');

dotenv.config();

// 서버 실행시 DB 시퀄라이즈 연결 시도
db.sequelize.sync()
	.then(() => {
		console.log('db 연결 성공');
	})
	.catch(console.error());

passportConfig();

app.use(morgan('dev'));	// 어떤 요청이 왔는지 확인가능
app.use(cors({
	origin: 'http://localhost:3000',
	credentials: true,
}));	// cors 허용

// req.body를 사용하기 위한 설정 (다른 router들보다 먼저 선언되어야 함.)
app.use('/', express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.json());	// front에서 axios json형식으로 데이터를 보냈을 때 req.body안에 넣어줌
app.use(express.urlencoded({ extended: true }));	// 일반 form submit시 urlencoded 방식 처리해서 req.body에 넣어줌
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
	saveUninitialized: false,
	resave: false,
	secret: process.env.COOKIE_SECRET,
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
	res.send('hello express');
});

app.use('/post', postRouter);
app.use('/posts', postsRouter);
app.use('/user', userRouter);

app.listen(3065, () => {
	console.log('서버 실행');
});