import React, { useMemo } from "react";
import { Form, Input } from 'antd';

const NicknameEditForm = () => {
	const formStyle = useMemo(() => ({ 
		marginBottom: '20px', 
		border: '1px solid #d9d9d9', 
		padding: '20px'}
	), [])

	return (
		<Form style={formStyle}>
			<Input.Search addonBefore="닉네임" enterButton="수정" />
		</Form>
	);
};

export default NicknameEditForm;
