import React, { useMemo } from 'react';
import { List, Button, Card } from 'antd';
import { StopOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const FollowList = ({ header, data }) => {
	const gridStyle = useMemo(() => ({ gutter: 4, xs: 2, md: 3}), []);
	const ListStyle = useMemo(() => ({ marginBottom: 20 }), []);
	const loadMoreStyle = useMemo(() => (
		{ textAlign: 'center', margin: '10px 0' }
	), []);
	const ListItemStyle = useMemo(() => ({ margin: 20 }), []);

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
						actions={[<StopOutlined key="stop" />]}
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