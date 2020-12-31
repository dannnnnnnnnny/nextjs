import React, { useMemo } from 'react';
import { List, Button, Card } from 'antd';
import { StopOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { UNFOLLOW_REQUEST, REMOVE_FOLLOWER_REQUEST } from '../reducers/user';

const FollowList = ({ header, data }) => {
	const gridStyle = useMemo(() => ({ gutter: 4, xs: 2, md: 3}), []);
	const ListStyle = useMemo(() => ({ marginBottom: 20 }), []);
	const loadMoreStyle = useMemo(() => (
		{ textAlign: 'center', margin: '10px 0' }
	), []);
	const ListItemStyle = useMemo(() => ({ margin: 20 }), []);

	const dispatch = useDispatch();

	const onCancel = (id) => () => {
		if (header === '팔로잉') {
			dispatch({
				type: UNFOLLOW_REQUEST,	// 언팔로우
				data: id,
			});
		} else {
			dispatch({
				type: REMOVE_FOLLOWER_REQUEST,	// 팔로워 차단
				data: id,
			});
		}
		
	};

	return (
		<List 
			style={ListStyle}
			grid={gridStyle}
			size="small"
			header={<div>{header}</div>}
			loadMore={<div style={loadMoreStyle}><Button>더 보기</Button></div>}
			bordered
			dataSource={data}
			renderItem={item => (
				<List.Item style={ListItemStyle}>
					<Card
						actions={[<StopOutlined key="stop" onClick={onCancel(item.id)} />]}
					>
						{item.nickname}
						<Card.Meta description={item.nickname} />
					</Card>
				</List.Item>
			)}
		/>
	);
};

FollowList.propTypes = {
	header: PropTypes.string.isRequired,
	data: PropTypes.array.isRequired,
}

export default FollowList;