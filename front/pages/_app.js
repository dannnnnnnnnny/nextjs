import React from 'react';
import 'antd/dist/antd.css';
import PropTypes from 'prop-types';

const NodeBird = ({ Component }) => {
    return (
			<>
                <div>공통 메뉴</div>
				<Component />
			</>
		);
}

NodeBird.propTypes = {
    Component: PropTypes.elementType.isRequired,
} 

export default NodeBird;