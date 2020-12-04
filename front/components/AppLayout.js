import PropTypes from 'prop-types';
import Link from 'next/link';
import React from 'react';
import { Menu } from 'antd';

const AppLayout = ({ children }) => {
    return (
			<div>
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
						<Link href="/signup">
							<a>회원가입</a>
						</Link>
					</Menu.Item>
				</Menu>
				{children}
			</div>
		);
};

AppLayout.propTypes= {
    children: PropTypes.node.isRequired,    
    // children: react의 node 타입
    // (화면에 그릴 수 있는 모든 것이 node타입)
}

export default AppLayout;