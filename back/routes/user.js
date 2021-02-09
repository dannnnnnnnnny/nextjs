const express = require('express');
const bcrypt = require('bcrypt');
const { User, Post } = require('../models');	// 구조 분해 할당으로 가져옴
const router = express.Router();
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

// 로그인한 자신의 데이터 조회 API (without Password)
// GET /user
router.get('/', async (req, res, next) => {
	// console.log(req.headers); // SSR로 쿠키가 잘 보내지는지 확인
	try {
		if (req.user) {
			const fullUserWithoutPassword = await User.findOne({
				where: { id: req.user.id },
				attributes: {
					exclude: ['password'], 
				},
				include: [
					{
						model: Post,
					},
					{
						model: User,
						as: 'Followings',
					},
					{
						model: User,
						as: 'Followers',
					},
				],
			});

			res.status(200).json(fullUserWithoutPassword);
		} else {
			res.status(200).json(null);
		}
	} catch (error) {
		console.error(error);
		next(error);
	}
});

router.get('/:userId', async (req, res, next) => {
	try {

		const fullUserWithoutPassword = await User.findOne({
			where: { id: req.params.userId },
			attributes: {
				exclude: ['password'], 
			},
			include: [
				{
					model: Post,
				},
				{
					model: User,
					as: 'Followings',
				},
				{
					model: User,
					as: 'Followers',
				},
			],
		});
		if (fullUserWithoutPassword) {
			// 개인정보 침해 예방해서 서버에서 먼저 length만 꺼내서 보냄
			const data = fullUserWithoutPassword.toJSON();
			data.Posts = data.Posts.length;
			data.Followers = data.Followers.length;
			data.Followings = data.Followings.length;
			res.status(200).json(data);
		} else {
			res.status(404).json('존재하지 않는 사용자입니다.');
		}
	} catch (error) {
		console.error(error);
		next(error);
	}
});

// 로그인 API (PassportJS 모듈 사용)
// POST /user/login
// /passport/local의 done이 콜백함수로 전달됨
router.post('/login', isNotLoggedIn, (req, res, next) => {
	passport.authenticate('local', (err, user, info) => {	// 미들웨어 확장
		if (err) {	// 서버 에러
			console.error(err);
			return next(err);
		}
		if (info) {	// 클라 에러 (401: 허가되지 않은)
			return res.status(401).send(info.reason);
		}

		return req.login(user, async (loginErr) => {
			if (loginErr) {
				console.error(loginErr);
				return next(loginErr);
			}

			// include에는 모델 정의시 associate로 관계를 설정해준 모델 함께 가져옴
			// 시퀄라이즈를 통해 받는 값은 JS 객체 형태임
			const fullUserWithoutPassword = await User.findOne({
				where: { id: user.id },
				// attributes: ['id', 'nickname', 'email']	// 받고싶은 데이터만
				attributes: {
					exclude: ['password']	// 제외 항목
				},
				include: [{
					model: Post,
				}, {
					model: User,
					as: 'Followings',
				}, {
					model: User,
					as: 'Followers',
				}]
			});

			// saga에서는 action.data로
			// reducer에서는 me 객체로
			return res.status(200).json(fullUserWithoutPassword);

		});
	})(req, res, next);
});	

// 로그아웃 API
// POST /user/logout
router.post('/logout', isLoggedIn, (req, res) => {
	req.logout();
	req.session.destroy();
	res.status(200).send("ok");
});

// 회원가입 API
// POST /user
router.post('/', isNotLoggedIn, async (req, res, next) => {	// POST /user
	try {
		const exUser = await User.findOne({
			where: {
				email: req.body.email,
			}
		});

		if (exUser) {
			return res.status(403).send('이미 사용중인 아이디 입니다.');
		}

		const hashedPassword = await bcrypt.hash(req.body.password, 12);
		await User.create({
			email: req.body.email,
			nickname: req.body.nickname,
			password: hashedPassword,
		}); // 순서를 맞춰주기 위한 await, 안써주면 비동기처리가 돼서 res.send가 먼저 실행될 수도 있음
		
		res.status(201).send('ok');

	} catch (error) {
		console.error(error);
		next(error);	// status 500 (서버 오류)
	}
});

// 닉네임 변경 API
// PATCH /user/nickname
router.patch('/nickname', isLoggedIn, async (req, res, next) => {
	try {
		await User.update({
			nickname: req.body.nickname,
		}, {
			where: { id: req.user.id },
		});
		res.status(200).json({ nickname: req.body.nickname });
	} catch (error) {
		console.error(error);
		next(error);
	}
})

// 팔로우 API
// PATCH /user/1/follow
router.patch('/:userId/follow', isLoggedIn, async (req, res, next) => {
	try {
		const user = await User.findOne({ 
			where: { id: req.params.userId },
		});
		if (!user) {
			res.status(403).send('존재하지 않는 유저를 팔로우 할 수 없습니다.');
		}

		await user.addFollowers(req.user.id);
		res.status(200).json({ UserId: user.id });
	} catch (error) {
		console.error(error);
		next(error);
	}
});

// 언팔로우 API
// DELETE /user/1/follow
router.delete('/:userId/follow', isLoggedIn, async (req, res, next) => {
	// DELETE /user/1/follow
	try {
		const user = await User.findOne({ where: { id: req.params.userId } });
		if (!user) {
			res.status(403).send('존재하지 않는 유저를 언팔로우 할 수 없습니다.');
		}
		await user.removeFollowers(req.user.id);
		res.status(200).json({ UserId: user.id });
	} catch (error) {
		console.error(error);
		next(error);
	}
});

// 팔로워 목록 조회 API
// GET /user/followers
router.get('/followers', isLoggedIn, async (req, res, next) => {
	try {
		const user = await User.findOne({ 
			where: { id: req.user.id },
		});
		if (!user) {
			res.status(403).send('존재하지 않는 유저입니다.');
		}

		const followers = await user.getFollowers();
		res.status(200).json(followers);

	} catch (error) {
		console.error(error);
		next(error);
	}
});

// 팔로잉한 목록 조회 API
// GET /user/followings
router.get('/followings', isLoggedIn, async (req, res, next) => {
	try {
		const user = await User.findOne({ 
			where: { id: req.user.id },
		});
		if (!user) {
			res.status(403).send('존재하지 않는 유저입니다.');
		}

		const followings = await user.getFollowings();
		res.status(200).json(followings);
	} catch (error) {
		console.error(error);
		next(error);
	}
});

// 팔로워 차단 API
// DELETE /user/follower/2
router.delete('/follower/:userId', isLoggedIn, async (req, res, next) => {
	// DELETE /user/1/follow
	try {
		const user = await User.findOne({ where: { id: req.params.userId } });
		if (!user) {
			res.status(403).send('존재하지 않는 유저는 차단할 수 없습니다.');
		}
		await user.removeFollowings(req.user.id);
		res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
	} catch (error) {
		console.error(error);
		next(error);
	}
});

module.exports = router;
