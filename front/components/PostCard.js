import React, { useCallback, useState } from 'react';
import { Card, Popover, Button, Avatar, List, Comment } from 'antd';
import { EllipsisOutlined, HeartOutlined, MessageOutlined, RetweetOutlined, HeartTwoTone } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import PostImages from './PostImages';
import CommentForm from './CommentForm';
import PostCardContent from './PostCardContent';
import { REMOVE_POST_REQUEST, LIKE_POST_REQUEST, UNLIKE_POST_REQUEST, RETWEET_REQUEST } from '../reducers/post';
import FollowButton from './FollowButton';

const PostCard = ({ post }) => {
	const dispatch = useDispatch();
	const { me } = useSelector((state) => state.user);
	const id = me?.id; // optional 연산자 (있으면 id, 없으면 undefined)
	const liked = post.Likers?.find((v) => v.id === id);	// 게시글 좋아요 누른 사람 중 자신이 있는지
	const { removePostLoading } = useSelector((state) => state.post);
	const [commentFormOpened, setCommentFormOpened] = useState(false);

	const onLike = useCallback(() => {
		if (!id) {
			return alert('로그인이 필요합니다.');
		}
		return dispatch({
			type: LIKE_POST_REQUEST,
			data: post.id,
		})
	}, []);

	const onUnlike = useCallback(() => {
		if (!id) {
			return alert('로그인이 필요합니다.');
		}

		return dispatch({
			type: UNLIKE_POST_REQUEST,
			data: post.id,
		});
	}, []);

	const onToggleComment = useCallback(() => {
		setCommentFormOpened((prev) => !prev);
	}, []);

	const onRemovePost = useCallback(() => {
		if (!id) {
			return alert('로그인이 필요합니다.');
		}

		return dispatch({
			type: REMOVE_POST_REQUEST,
			data: post.id,
		});
	}, []);

	const onRetweet = useCallback(() => {
		if (!id) {
			return alert('로그인이 필요합니다.');
		}
		
		return dispatch({
			type: RETWEET_REQUEST,
			data: post.id,
		});
	}, [id]);

	return (
		<div style={{ marginBottom: 20 }}>
			<Card
				cover={post.Images[0] && <PostImages images={post.Images} />}
				actions={[
					<RetweetOutlined key="retweet" onClick={onRetweet} />,	// 리트윗
					liked ? (
						<HeartTwoTone
							twoToneColor="#eb2f96"
							key="heart"
							onClick={onUnlike}
						/>
					) : (
						<HeartOutlined key="heart" onClick={onLike} />
					),
					<MessageOutlined key="comment" onClick={onToggleComment} />,
					<Popover
						key="more"
						content={
							<Button.Group>
								{id && post.User.id === id ? (
									<>
										<Button>수정</Button>
										<Button
											type="danger"
											loading={removePostLoading}
											onClick={onRemovePost}
										>
											삭제
										</Button>
									</>
								) : (
									<Button>신고</Button>
								)}
							</Button.Group>
						}
					>
						<EllipsisOutlined />
					</Popover>,
				]}
				title={post.RetweetId ? `${post.User.nickname}님이 리트윗했습니다.` : null}
				extra={id && <FollowButton post={post} />}
			>
				{/* 리트윗 게시물 이라면 */}
				{post.RetweetId && post.Retweet 
					? (
						<Card
							cover={post.Retweet.Images[0] && <PostImages images={post.Retweet.Images} />}
						>
							<Card.Meta
								avatar={<Avatar>{post.Retweet.User.nickname[0]}</Avatar>}
								title={post.Retweet.User.nickname}
								description={<PostCardContent postData={post.Retweet.content} />}
							/>
						</Card>
					)
					: (
						<Card.Meta
							avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
							title={post.User.nickname}
							description={<PostCardContent postData={post.content} />}
						/>	
					)}
			</Card>
			{commentFormOpened && (
				<div>
					{/* post 넘기는 이유: 어떤 게시글에 댓글을 쓰는지 알아야 함. (게시글의 id가 필요) */}
					<CommentForm post={post} />

					<List
						header={`${post.Comments.length}개의 댓글`}
						itemLayout="horizontal"
						dataSource={post.Comments}
						renderItem={(item) => (
							<li>
								<Comment
									author={item.User.nickname}
									avatar={<Avatar>{item.User.nickname[0]}</Avatar>}
									content={item.content}
								/>
							</li>
						)}
					/>
				</div>
			)}
		</div>
	);
};;

PostCard.propTypes = {
	post: PropTypes.shape({
		id: PropTypes.number,
		content: PropTypes.string,
		User: PropTypes.object,
		createdAt: PropTypes.string,
		Likers: PropTypes.arrayOf(PropTypes.object),
		Comments: PropTypes.arrayOf(PropTypes.object),
		Images: PropTypes.arrayOf(PropTypes.object),
		RetweetId: PropTypes.number,
		Retweet: PropTypes.objectOf(PropTypes.any),
	}).isRequired,
};

export default PostCard;