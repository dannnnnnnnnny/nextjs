const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { Post, Image, Comment, User, Hashtag } = require('../models');
const { isLoggedIn } = require('./middlewares');

try {
	fs.accessSync('uploads');
} catch (error) {
	console.log('uploads 폴더가 없으므로 생성합니다.');
	fs.mkdirSync('uploads');
}


const upload = multer({
	storage: multer.diskStorage({
		destination(req, file, done) {
			done(null, 'uploads');
		},
		filename(req, file, done) {	// abc.png
			const ext = path.extname(file.originalname);	// 확장자 추출(.png)
			const basename = path.basename(file.originalname) // (abc)
			done(null, basename + '_' + new Date().getTime() + ext);	// abc123152165.png
		},
	}),
	limits: { fileSize: 20 * 1024 * 1024 },	// 용량 20MB 제한
});

// 이미지 업로드 API
// POST /post/images
// 이미지 업로드 후 실행됨
/* 
	upload.array('image') => 
	PostForm.js의 <input type="file" name="image" multiple hidden ref={imageInput} />  (name="image"인 부분을 받음)
	이미지를 하나만 받을 때는 .array()가 아닌 .single()
	이미지가 필요없을 때는 .none()
*/
router.post('/images', isLoggedIn, upload.array('image'), async (req, res, next) => {
	console.log(req.files);
	res.json(req.files.map((v) => v.filename));
});

// 게시물 작성 API
// POST /post
router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {
	try {
		const hashtags = req.body.content.match(/#[^\s#]+/g);	// 해시태그 추출

		const post = await Post.create({
			content: req.body.content,
			UserId: req.user.id,	// deserializeUser 후에는 req.user에 데이터가 존재
		});
		
		if (hashtags) {
			const result = await Promise.all(hashtags.map((tag) => Hashtag.findOrCreate({ 
				where: { name: tag.slice(1).toLowerCase() },
			})));	// 없을때만 저장 있으면 가져옴, 앞에 # 빼고 소문자로만 저장

			// findOrCreate의 결과가 [[#노드, true], [#익스프레스, true]] 이런 식이기 때문에 index 0만 가져옴
			await post.addHashtags(result.map((v) => v[0]));
		}

		if (req.body.image) {
			if (Array.isArray(req.body.image)) { // 이미지를 여러 개 올리면 image: [제로초.png, 부기초.png]
				
        const images = await Promise.all(req.body.image.map((image) => Image.create({ src: image })));
				await post.addImages(images);
				
			} else { // 이미지를 하나만 올리면 image: 제로초.png
				
        const image = await Image.create({ src: req.body.image });
				await post.addImages(image);
				
      }
    }

		const fullPost = await Post.findOne({	// 완성된 정보를 front로 보내줌
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

// 댓글 작성 API
// POST /1/comment (1번 게시물에 댓글 작성)
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

// 게시물 좋아요 API
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

// 게시물 좋아요 취소 API
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

// 게시물 삭제 API
// DELETE /post/1
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

router.post('/:postId/retweet', isLoggedIn, async (req, res, next) => {
	try {
		const post = await Post.findOne({
			where: { id: req.params.postId },
			include: [{
				model: Post,
				as: 'Retweet',
			}],
		});

		if (!post) {
			return res.status(403).send('존재하지 않는 게시물입니다.');
		}

		// 자기 게시물을 리트윗하거나, 자신의 게시물을 리트윗한 게시물을 자기가 다시 리트윗하는 행위 방지
		if (req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)) {
			return res.status(403).send('자신의 게시물은 리트윗할 수 없습니다.');
		}

		// 해당 게시물이 리트윗한 게시물이라면 해당 게시물이 아니라 해당 게시물이 리트윗한 게시물을 가져오고, 리트윗 게시물이 아니라면 해당 게시물 ID로
		const retweetTargetId = post.RetweetId || post.id;

		const exPost = await Post.findOne({
			where: {
				UserId: req.user.id,
				RetweetId: retweetTargetId,
			},
		});

		if (exPost) {
			return res.status(403).send('이미 리트윗 했습니다.');
		}

		const retweet = await Post.create({
			UserId: req.user.id,
			RetweetId: retweetTargetId,
			content: 'retweet',
		});

		const retweetWithPrevPost = await Post.findOne({
			where: {
				id: retweet.id,
			},
			include: [{
				model: Post,
				as: 'Retweet',
				include: [{
					model: User,
					attributes: ['id', 'nickname'],
				}, {
					model: Image,
				}]
			}, {
				model: User,
				attributes: ['id', 'nickname'],
			}, {
				model: Image
			}, {
				model: Comment,
				include: [{
					model: User,
					attributes: ['id', 'nickname'],
				}]
			}, {
				model: User,
				as: 'Likers',
				attributes: ['id'],
			}],
		})

		res.status(200).send(retweetWithPrevPost);

	} catch (error) {
		console.error(error);
		next(error);
	}
});

module.exports = router;
