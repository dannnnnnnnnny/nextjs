import React from 'react';
import PropTypes from 'prop-types';
// import withReduxSaga from 'next-redux-saga';
import Head from 'next/head';
import wrapper from '../store/ConfigureStore';

import 'antd/dist/antd.css';

const NodeBird = ({ Component }) => {
	return (
		<>
			<Head>
				<meta charSet="utf-8" />
				<link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
				<title>NodeBird</title>
			</Head>
			<Component />
		</>
	);
};

NodeBird.propTypes = {
    Component: PropTypes.elementType.isRequired,
} 

export default wrapper.withRedux(NodeBird);