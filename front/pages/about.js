import React from 'react';
import { useSelector } from 'react-redux';
import Head from 'next/head';
import { END } from 'redux-saga';
import { Avatar, Card } from 'antd';
import AppLayout from '../components/AppLayout';
import wrapper from '../store/ConfigureStore';
import { LOAD_USER_REQUEST } from '../reducers/user';

const About = () => {
  const { userInfo } = useSelector((state) => state.user);

  return (
	<AppLayout>
		<Head>
			<title>NodeBird</title>
		</Head>
		{ userInfo ? (
			<Card
				actions={[
					<div key="twit">짹짹<br />{userInfo.Posts}</div>,
					<div key="followings">팔로잉<br />{userInfo.Followings}</div>,
					<div key="followers">팔로워<br />{userInfo.Followers}</div>
          ]}
			>
				<Card.Meta
					avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
					title={userInfo.nickname}
					description='유저'
				/>
			</Card>
      ) 
      : (null)}
	</AppLayout>
  );
}

// getStaticProps는 언제 접속해도 값이 바뀔 일이 없을 때의 SSR
// 정적인 HTML을 만들어줌 (동적 X)
export const getStaticProps = wrapper.getStaticProps(async(context) => {
  context.store.dispatch({
    type: LOAD_USER_REQUEST,
    data: 2,
  });

  context.store.dispatch(END);  // SSR에서 REQUEST가 SUCCESS까지 되게 기다리려면 해줘야 함
  await context.store.sagaTask.toPromise();
});

export default About;