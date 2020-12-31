const express = require('express');
const router = express.Router();
const { Post, Image, Comment, User } = require('../models');
const { isLoggedIn } = require('./middlewares');

router.post('/', isLoggedIn, async (req, res, next) => {
	try {
		const post = await Post.create({
			content: req.body.content,
			UserId: req.user.id,	// deserializeUser 후에는 req.user에 데이터가 존재
		});

		// 완성된 정보를 front로 보내줌
		const fullPost = await Post.findOne({
			where: { id: post.id },
			include: [
				{
					model: Image,
				},
				{
					model: Comment,
					include: [
						{
							model: User,	// 댓글 작성자
							attributes: ['id', 'nickname'],
						},
					],
				},
				{
					model: User,	// 게시글 작성자
					attributes: ['id', 'nickname'],
				}, {
				model: User, // 좋아요 누른 사람
				as: 'Likers',	// /models/post.js에서 설정해준 것처럼 헷갈리지않게
				attributes: ['id'],
				}
			],
		});

		return res.status(201).send(fullPost);

	} catch (error) {
		console.error(error);
		next(error);
	}
});

router.post('/:postId/comment', isLoggedIn, async (req, res, next) => {	// POST /post/1/comment
	try {
		const post = await Post.findOne({	// 올바른 주소인지
			where: { id: req.params.postId }
		})

		if (!post) {
			return res.status(403).send('존재하지 않는 게시글입니다.');
		}
		
		const comment = await Comment.create({
			content: req.body.content,
			PostId: parseInt(req.params.postId, 10),
			UserId: req.user.id,
		});

		const fullComment = await Comment.findOne({
			where: { id: comment.id },
			include: [{
				model: User,
				attributes: ['id', 'nickname'],
			}]
		})

		return res.status(201).send(fullComment);
	} catch (error) {
		console.error(error);
		next(error);
	}
});

// PATCH /post/1/like
router.patch('/:postId/like', isLoggedIn, async (req, res, next) => {
	try {
		const post = await Post.findOne({ where: { id: req.params.postId } });
		if (!post) {
			return res.status(403).send('게시글 미존재');
		}
		await post.addLikers(req.user.id);
		res.json({ PostId: post.id, UserId: req.user.id })
	} catch (error) {
		console.error(error);
		next(error);
	}
	
});

// DELETE /post/1/like
router.delete('/:postId/like', isLoggedIn, async (req, res, next) => {
	try {
		const post = await Post.findOne({ where: { id: req.params.postId } });
		if (!post) {
			return res.status(403).send('게시글 미존재');
		}
		await post.removeLikers(req.user.id);
		res.json({ PostId: post.id, UserId: req.user.id });
	} catch (error) {
		console.error(error);
		next(error);
	}
});

router.delete('/:postId', isLoggedIn, async (req, res, next) => {
	try {
		await Post.destroy({
			where: { 
				id: req.params.postId, 
				UserId: req.user.id,
			},
		});
		
		res.json({ PostId: parseInt(req.params.postId, 10) })
	} catch (error) {
		console.error(error);
		next(error);
	}

});

module.exports = router;
