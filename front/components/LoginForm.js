import React, { useState, useCallback, useMemo } from 'react';
import { Form, Input, Button } from 'antd';
import Link from 'next/link';
import styled from 'styled-components';

// const ButtonWrapper = styled.div`
// 	margin-top: 10px;
// `;

const FormWrapper = styled(Form)`
	padding: 10px;
`;

const LoginForm = ({ setIsLoggedIn }) => {
	const [id, setId] = useState('');
	const [password, setPassword] = useState('');
	const buttonStyle = useMemo(() => ({ marginTop: 10 }), []);
	
	const onChangeId = useCallback((e) => {
		setId(e.target.value);
	}, []);

	const onChangePasword = useCallback((e) => {
		setPassword(e.target.value);
	}, []);

	const onSubmitForm = useCallback(() => {
		console.log(id, password);
		setIsLoggedIn(true);	// AppLayout(상위 컴포넌트)에서 props로 보낸 함수
	}, [id, password]);

	return (
		<FormWrapper onFinish={onSubmitForm}>
			<div>
				<label htmlFor="user-id">아이디</label>
				<br />
				<Input 
					name="user-id" 
					value={id} 
					onChange={onChangeId} 
					required 
				/>
			</div>
			<div>
				<label htmlFor="user-password">비밀번호</label>
				<br />
				<Input
					name="user-password"
					type="password"
					value={password}
					onChange={onChangePasword}
					required
				/>
			</div>
			<div style={buttonStyle}>
				<Button 
					type="primary" 
					htmlType="submit" 
					loading={false}
				>
					로그인
				</Button>
				<Link href="/signup">
					<a>
						<Button>회원가입</Button>
					</a>
				</Link>
			</div>
		</FormWrapper>
	);
};

export default LoginForm;
