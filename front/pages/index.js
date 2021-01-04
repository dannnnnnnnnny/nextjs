import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import AppLayout from '../components/AppLayout';
import { LOAD_POSTS_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';

const Home = () => {
	const { me } = useSelector((state) => state.user);
	const { mainPosts, hasMorePosts, loadPostsLoading, retweetError } = useSelector((state) => state.post);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch({ type: LOAD_MY_INFO_REQUEST });
		dispatch({ type: LOAD_POSTS_REQUEST });
	}, []);

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

export default Home;

// 레이아웃 중앙, 게시물 카드 로드 컴포넌트