const express = require('express');
const { Op } = require('sequelize');
const { Post, Hashtag, Image, User, Comment } = require('../models');
const router = express.Router();

// 해시태그 검색
// GET /hashtag/노드
router.get('/:hashtag', async (req, res, next) => {
	try {
		const where = {};	

		if (parseInt(req.query.lastId, 10)) {	
			where.id = { [Op.lt]: parseInt(req.query.lastId, 10) }	
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
          model: Hashtag,
          where: { name: req.params.hashtag } // include 안에서 조건도 가능함
        },
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