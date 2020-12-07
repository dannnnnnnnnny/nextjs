import React from 'react';
import AppLayout from '../components/AppLayout';
import Head from 'next/head';
import FollowList from '../components/FollowList';
import NicknameEditForm from '../components/NicknameEditForm';

const Profile = () => {
	const followerList = [
		{ nickname: 'test01' },
		{ nickname: 'test02' },
		{ nickname: 'test03' }
	];

	const followingList = [
		{ nickname: 'test04' },
		{ nickname: 'test05' },
		{ nickname: 'test06' },
	];

    return (
			<>
				<Head>
					<title>내 프로필 | NodeBird</title>
				</Head>
				<AppLayout>
					<NicknameEditForm />
					<FollowList header="팔로잉 목록" data={followingList} />
					<FollowList header="팔로워 목록" data={followerList} />
				</AppLayout>
			</>
		);
};

export default Profile;