const express = require('express');
const { Op } = require('sequelize');
const { Post, Image, Comment, User } = require('../models');

const router = express.Router();

// 게시물 조회 API
// GET /posts
router.get('/', async (req, res, next) => {	// GET /posts
	try {
		const where = {};	// 초기와 초기가 아닐 때 불러오는 조건이 다름

		if (parseInt(req.query.lastId, 10)) {	// 초기 로딩이 아닐 때 (초기로딩에는 undefined 이므로 0이 넘어옴)
			where.id = { [Op.lt]: parseInt(req.query.lastId, 10) }	// id가 lastId보다 작은 게시물
		}

		const posts = await Post.findAll({
			where,
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
				}, {
					model: Post,
					as: 'Retweet',
					include: [{
						model: User,
						attributes: ['id', 'nickname'],
					}, {
						model: Image,
					}]
				}
			],
		});

		res.status(200).json(posts);
	} catch (error) {
		console.error(error);
		next(error);
	}
});

module.exports = router;