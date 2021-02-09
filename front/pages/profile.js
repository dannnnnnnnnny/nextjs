import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Head from 'next/head';
import Router from 'next/router';
import axios from 'axios';
import { END } from 'redux-saga';
import FollowList from '../components/FollowList';
import NicknameEditForm from '../components/NicknameEditForm';
import AppLayout from '../components/AppLayout';
import { LOAD_MY_INFO_REQUEST, LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWINGS_REQUEST } from '../reducers/user';
import wrapper from '../store/ConfigureStore';

const Profile = () => {
	const { me } = useSelector(state => state.user);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch({
			type: LOAD_FOLLOWERS_REQUEST,
		});
		dispatch({
			type: LOAD_FOLLOWINGS_REQUEST,
		});
	}, []);

	useEffect(() => {
		if (!(me && me.id)) {
			Router.push('/')
		}
	}, [me && me.id]);
	
	if (!me) {
		return null;
	}

	return (
		<>
			<Head>
				<title>내 프로필 | NodeBird</title>
			</Head>
			<AppLayout>
				<NicknameEditForm />
				<FollowList header="팔로잉" data={me.Followings} />
				<FollowList header="팔로워" data={me.Followers} />
			</AppLayout>
		</>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
	console.log('getServerSideProps Start');
	console.log(context.req.headers);
	// context.req : 서버쪽에서 실행하면 context.req가 만들어지게 되며 그 안에 쿠키가 존재함
	const cookie = context.req ? context.req.headers.cookie : '';	
	axios.defaults.headers.cookie = '';	// 서버쪽에서 실행되는 것이기 때문에 쿠키가 공유되는 문제가 발생할 수 있음. 그렇기 때문에 쿠키를 지웠다가 넣어줌
	if(context.req && cookie) {
		axios.defaults.headers.cookie = cookie;
	}
	context.store.dispatch({ type: LOAD_MY_INFO_REQUEST });
	context.store.dispatch(END);
	console.log('getServerSideProps End');
	await context.store.sagaTask.toPromise();
});

export default Profile;