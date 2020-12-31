module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define(
		'User',
		{
			// 자동으로 mysql에 'users' 테이블로 저장
			email: {
				type: DataTypes.STRING(30),
				allowNull: false, // 필수
				unique: true, // 고유값
			},
			nickname: {
				type: DataTypes.STRING(30),
				allowNull: false, // 필수
			},
			password: {
				type: DataTypes.STRING(100),
				allowNull: false, // 필수
			},
		},
		{
			charset: 'utf8',
			collate: 'utf8_general_ci', // 한글 저장
		},
	);
	User.associate = (db) => {
		db.User.hasMany(db.Post)	// User는 여러 개의 Post를 가질 수 있음.
		db.User.hasMany(db.Comment);
		db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' }); // 좋아요
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
	};

	return User;
};