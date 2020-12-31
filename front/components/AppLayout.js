import PropTypes from 'prop-types';
import Link from 'next/link';
import React, { useMemo } from 'react';
import { Menu, Input, Row, Col } from 'antd';
import { useSelector } from 'react-redux';
import { createGlobalStyle } from 'styled-components'
import UserProfile from './UserProfile';
import LoginForm from './LoginForm';

// import styled from 'styled-components';

// const SearchInput = styled(Input.Search)`
// 	vertical-align: middle;
// `;

const Global = createGlobalStyle`
	.ant-row {
		margin-right: 0 !important;
		margin-left: 0 !important;
	}

	.ant-col:first-child {
		padding-left: 0 !important;
	}

	.ant-col:last-child {
		padding-right: 0 !important;
	}
`;

const AppLayout = ({ children }) => {
	const { me } = useSelector(state => state.user);
	
	const style = useMemo(() => (
		{ verticalAlign: 'middle' }
	), []);
	
	return (
		<div>
			<Global />
			<Menu mode="horizontal">
				<Menu.Item>
					<Link href="/">
						<a>노드버드</a>
					</Link>
				</Menu.Item>
				<Menu.Item>
					<Link href="/profile">
						<a>프로필</a>
					</Link>
				</Menu.Item>
				<Menu.Item>
					<Input.Search enterButton style={style} />
				</Menu.Item>
				<Menu.Item>
					<Link href="/signup">
						<a>회원가입</a>
					</Link>
				</Menu.Item>
			</Menu>

			<Row gutter={8}>
				<Col xs={24} md={6}>
					{me ? (
						<UserProfile />
					) : (
						<LoginForm />
					)}
				</Col>
				<Col xs={24} md={12}>
					{children}
				</Col>
				<Col xs={24} md={6}>
					<a
						href="https://github.com/ehdgnl5249"
						target="_blank"
						rel="noreferrer noopener"
					>
						Made by dh
					</a>
				</Col>
			</Row>
			
		</div>
	);
};

AppLayout.propTypes= {
    children: PropTypes.node.isRequired,    
    // children: react의 node 타입
    // (화면에 그릴 수 있는 모든 것이 node타입)
}

export default AppLayout;