import React, { useCallback, useState, useMemo } from 'react';
import AppLayout from '../components/AppLayout';
import Head from 'next/head';
import { Form, Input, Checkbox, Button } from 'antd';
import useInput from '../hooks/useInput';

const Signup = () => {
	const [id, onChangeId] = useInput('')
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

			console.log(id, nickname, password);

	},[password, passwordCheck, term]);

	return (
		<AppLayout>
			<Head>
				<title>회원가입 | NodeBird</title>
			</Head>
			<Form onFinish={onSubmit}>
				<div>
					<label htmlFor="user-id">아이디</label>
					<br />
					<Input 
						name="user-id" 
						value={id} 
						required 
						onChange={onChangeId} 
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
					<Button type="primary" htmlType="submit">회원가입</Button>
				</div>
			</Form>
		</AppLayout>
	);
};

export default Signup;