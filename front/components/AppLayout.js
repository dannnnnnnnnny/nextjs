import PropTypes from 'prop-types';
import Link from 'next/link';
import React from 'react';

const AppLayout = ({ children }) => {
    return (
			<div>
				<div>
					<Link href="/">
						<a>노드버드</a>
					</Link>
					<Link href="/profile">
						<a>프로필</a>
					</Link>
					<Link href="/signup">
						<a>회원가입</a>
					</Link>
				</div>
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