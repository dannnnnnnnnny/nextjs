module.exports = (sequelize, DataTypes) => {
	const Post = sequelize.define(
		'Post',
		{
			content: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
		},
		{
			charset: 'utf8mb4',	// 이모티콘도 저장되게 mb4 추가
			collate: 'utf8mb4_general_ci', // 한글+이모티콘 저장
		},
	);
	Post.associate = (db) => {
		db.Post.belongsTo(db.User); // post.addUser, post.getUser, post.setUser
		db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' }); // post.addHashtags
		db.Post.hasMany(db.Comment); // post.addComments, post.getComments
		db.Post.hasMany(db.Image); // post.addImages, post.getImages
		db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' }); // post.addLikers, post.removeLikers
		db.Post.belongsTo(db.Post, { as: 'Retweet' }); // post.addRetweet
	};
	// get~~ 는 상대적으로 많이 쓰이진 않음

	return Post;
};
