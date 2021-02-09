import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Head from 'next/head';
import Router from 'next/router';
import axios from 'axios';
import { END } from 'redux-saga';
import { Form, Input, Checkbox, Button } from 'antd';
import useInput from '../hooks/useInput';
import { LOAD_MY_INFO_REQUEST, SIGN_UP_REQUEST } from '../reducers/user';
import AppLayout from '../components/AppLayout';
import wrapper from '../store/ConfigureStore';

const Signup = () => {
	const dispatch = useDispatch();
	const { signUpLoading, signUpDone, signUpError, me } = useSelector(state => state.user);


	useEffect(() => {
		if (me?.id) {
			Router.replace('/');	// replace: 뒤로 가기시 이전 페이지로 가지 않음
		}
	}, [me?.id]);

	useEffect(() => {
		if (signUpDone) {
			Router.replace('/');	// 회원가입되면 메인페이지로
		}
	}, [signUpDone]);

	useEffect(() => {
		if (signUpError) {
			alert(signUpError);
		}
	}, [signUpError]);

	const [email, onChangeEmail] = useInput('')
	const [nickname, onChangeNickname] = useInput('');
	const [password, onChangePassword] = useInput('');

	const [passwordCheck, setPasswordCheck] = useState('');
	const [passwordError, setPasswordError] = useState(false);
	const onChangePasswordCheck = useCallback((e) => {
			setPasswordCheck(e.target.value);
			setPasswordError(e.target.value !== password);
	}, [password]);

	const [term, setTerm] = useState('');
	const [termError, setTermError] = useState(false)

	const onChangeTerm = useCallback((e) => {
		setTerm(e.target.checked);
		setTermError(false);
	}, []);

	const errorStyle = useMemo(() => (
		{ color: 'red' }
	), []);

	const submitStyle = useMemo(() => (
		{ marginTop: 10 }
	));

	const onSubmit = useCallback(() => {
			if (password !== passwordCheck) {
				return setPasswordError(true);
			}

			if (!term) {
				return setTermError(true);
			}

			console.log(email, nickname, password);

			dispatch({
				type: SIGN_UP_REQUEST,
				data: { email, nickname, password },
			})

	},[email, password, passwordCheck, term]);

	return (
		<AppLayout>
			<Head>
				<title>회원가입 | NodeBird</title>
			</Head>
			<Form onFinish={onSubmit}>
				<div>
					<label htmlFor="user-email">아이디</label>
					<br />
					<Input 
						name="user-email"
						type="email"
						value={email} 
						required 
						onChange={onChangeEmail} 
					/>
				</div>
				<div>
					<label htmlFor="user-nickname">닉네임</label>
					<br />
					<Input
						name="user-nickname"
						value={nickname}
						required
						onChange={onChangeNickname}
					/>
				</div>
				<div>
					<label htmlFor="user-password">비밀번호</label>
					<br />
					<Input
						name="user-password"
						type="password"
						value={password}
						required
						onChange={onChangePassword}
					/>
				</div>
				<div>
					<label htmlFor="user-password-check">비밀번호 확인</label>
					<br />
					<Input
						name="user-password-check"
						type="password"
						value={passwordCheck}
						required
						onChange={onChangePasswordCheck}
					/>
					{passwordError && <div style={errorStyle}>비밀번호가 일치하지 않습니다.</div>}
				</div>
				<div>
					<Checkbox 
						name="user-term" 
						checked={term} 
						onChange={onChangeTerm}	
					>
						회원가입 동의
					</Checkbox>
					{termError && <div style={errorStyle}>약관에 동의하셔야 합니다.</div>}
				</div>
				<div style={submitStyle}>
					<Button 
						type="primary" 
						htmlType="submit"
						loading={signUpLoading}	
					>
						회원가입
					</Button>
				</div>
			</Form>
		</AppLayout>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
	console.log('getServerSideProps Start');
	console.log(context.req.headers);
	const cookie = context.req ? context.req.headers.cookie : '';	
	axios.defaults.headers.cookie = '';
	if(context.req && cookie) {
		axios.defaults.headers.cookie = cookie;
	}
	context.store.dispatch({ type: LOAD_MY_INFO_REQUEST });
	context.store.dispatch(END);
	console.log('getServerSideProps End');
	await context.store.sagaTask.toPromise();
});

export default Signup;