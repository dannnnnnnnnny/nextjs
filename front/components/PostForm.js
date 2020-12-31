import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { addPost } from '../reducers/post';
import useInput from '../hooks/useInput';

const PostForm = () => {
	const { imagePaths, addPostDone } = useSelector((state) => state.post);
	const dispatch = useDispatch();

	const formStyle = useMemo(() => ({ margin: '10px 0 20px' }), []);

	const [text, onChangeText, setText] = useInput('');
	
	useEffect(() => {
		if (addPostDone) {
			setText('');
		}
	}, [addPostDone]);

	const imageInput = useRef();
	const onClickImageUpload = useCallback(() => {
		imageInput.current.click();
	}, [imageInput.current]);

	const onSubmit = useCallback(() => {
		dispatch(addPost(text))
	}, [text]);

	return (
		<Form style={formStyle} encType="multipart/form-data" onFinish={onSubmit}>
			<Input.TextArea 
				value={text} 
				onChange={onChangeText}
				maxLength={140}
				placeholder="무슨 일이 있으셨나요?"
			/>
			<div>
				<input type="file" multiple hidden ref={imageInput} />
				<Button onClick={onClickImageUpload}>이미지 업로드</Button>
				<Button type="primary" style={{ float: 'right' }} htmlType="submit">작성</Button>
			</div>
			<div>
				{imagePaths.map((v) => (
					<div key={v} style={{ display: 'inline-block' }}>
						<img src={v} style={{ width: '200px' }} alt={v} />
						<div>
							<Button>제거</Button>
						</div>
					</div>
				))}
			</div>
		</Form>
	);
};

export default PostForm;