const express = require('express');
const { Post, Image, Comment, User } = require('../models');

const router = express.Router();

// 게시물 조회 API
// GET /posts
router.get('/', async (req, res, next) => {	// GET /posts
	try {
		const posts = await Post.findAll({
			limit: 10, // 10개만
			order: [
				['createdAt', 'DESC'],
				[Comment, 'createdAt', 'DESC'],
			],
			include: [
				{
					model: User,
					attributes: ['id', 'nickname'],
				},
				{
					model: Image,
				},
				{
					model: Comment,
					include: [
						{
							model: User,
							attributes: ['id', 'nickname'],
						},
					],
				},
				{
					model: User, // 좋아요 누른 사람
					as: 'Likers', // /models/post.js에서 설정해준 것처럼 헷갈리지않게
					attributes: ['id'],
				},
			],
		});

		res.status(200).json(posts);
	} catch (error) {
		console.error(error);
		next(error);
	}
});

module.exports = router;