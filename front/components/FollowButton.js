import React, { useCallback } from 'react'
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { FOLLOW_REQUEST, UNFOLLOW_REQUEST } from '../reducers/user';

const FollowButton = ({ post }) => {
	const dispatch = useDispatch();
	const { me, followLoading, unfollowLoading } = useSelector(state => state.user);
	
	// 내가 팔로우 한 사람들 중에 해당 게시물 작성자가 있는지 (팔로우하고 있는지)
	const isFollowing = me?.Followings.find((v) => v.id === post.User.id);
	
	const onClickButton = useCallback(() => {
		if (isFollowing) {
			dispatch({
				type: UNFOLLOW_REQUEST,
				data: post.User.id,
			})
		} else {
			dispatch({
				type: FOLLOW_REQUEST,
				data: post.User.id,
			});
		}
	}, [isFollowing]);

	if (post.User.id === me.id) {
		return null;
	}
	
	return (
		<Button loading={followLoading || unfollowLoading} onClick={onClickButton}>
			{ isFollowing ? '언팔로우' : '팔로우' }
		</Button>
	);
}

FollowButton.propTypes = {
	post: PropTypes.shape({
		id: PropTypes.number,
		content: PropTypes.string,
		User: PropTypes.object,
		createdAt: PropTypes.string,
		Comments: PropTypes.arrayOf(PropTypes.object),
		Images: PropTypes.arrayOf(PropTypes.object),
	}).isRequired,
};

export default FollowButton;
