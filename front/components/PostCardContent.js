import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

const PostCardContent = ({ postData }) => ( // '첫 번째 게시글 #해시태그 #express'
	<div>
		{postData.split(/(#[^\s#]+)/g).map((v, i) => {
			if (v.match(/(#[^\s#]+)/g)) {
				// slice(1)은 앞의 #을 뗀 것임
				return <Link href={`/hashtag/${v.slice(1)}`} key={i}><a>{v}</a></Link>
			}
			return v;
		})}
	</div>
)

PostCardContent.propTypes = {
	postData : PropTypes.string.isRequired,
}

export default PostCardContent;