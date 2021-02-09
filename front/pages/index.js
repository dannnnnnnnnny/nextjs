import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { END } from 'redux-saga';
import axios from 'axios';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import AppLayout from '../components/AppLayout';
import { LOAD_POSTS_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/ConfigureStore';

const Home = () => {
	const { me } = useSelector((state) => state.user);
	const { mainPosts, hasMorePosts, loadPostsLoading, retweetError } = useSelector((state) => state.post);
	const dispatch = useDispatch();

	useEffect(() => {
		if (retweetError) {
			alert(retweetError);
		}
	}, [retweetError]);
	
	// 스크롤을 통한 데이터 불러오기
	useEffect(() => {
		
		function onScroll() {
			if (
				window.scrollY + document.documentElement.clientHeight >
				document.documentElement.scrollHeight - 500
			) {
				if (hasMorePosts && !loadPostsLoading) {
					const lastId = mainPosts[mainPosts.length - 1]?.id;	// 마지막 게시물의 ID
					console.log(lastId);
					dispatch({
						type: LOAD_POSTS_REQUEST,
						lastId,
					});
				}
			}
		}

		window.addEventListener('scroll', onScroll);

		return () => {
			window.removeEventListener('scroll', onScroll);
		};
	}, [hasMorePosts, loadPostsLoading]);
	
	return (
		<AppLayout>
			{me && <PostForm />}
			{mainPosts.map((post) => (
				<PostCard key={post.id} post={post} />
			))}
		</AppLayout>
	);
};


// Home보다 먼저 실행됨. context 안에는 store 존재
// 데이터를 채운 후 화면 랜더링
// SSR은 브라우저에서 백엔드서버로 보내는 것이 아니라 프론트엔드서버에서 백엔드서버로 바로 요청하는 것이기 때문에 
// 백엔드에서 credentials=true를 해주더라도 쿠키가 전달되지 않음.

// 접속한 상황에 따라 값이 바뀔 수 있으면 getServerSideProps 사용한 SSR
// 웬만하면 getStaticProps보다 getServerSideProps를 많이 씀 
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
	context.store.dispatch({ type: LOAD_POSTS_REQUEST });
	context.store.dispatch(END);
	console.log('getServerSideProps End');
	await context.store.sagaTask.toPromise();
});

export default Home;

// 레이아웃 중앙, 게시물 카드 로드 컴포넌트