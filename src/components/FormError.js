import React, { PropTypes } from 'react';
import { Alert } from 'antd';

const FormError = ({error}) => {

	let errorList = [];
	const errors = error.errors || {};
	for (var i in errors) {
		const item = errors[i];
		if (item && item.length > 0) {
			errorList.push({
				key: i,
				msg: item
			});
		}
	}

	const errorMsg = (
			<div>
				<h4>{error.msg || '出错了'}</h4>
				{
					errorList.map((item) => {
						return (<p key={item.key}>{item.msg}</p>);
					})
				}
			</div>
		);

	return (
		<Alert message={errorMsg} type="error" closable />
	);
};

FormError.propTypes = {
	error: PropTypes.object
}

export default FormError;