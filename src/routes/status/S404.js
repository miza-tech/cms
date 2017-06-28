import React from 'react';
import { connect } from 'dva';

function S404() {
	return (
		<div>404</div>
	);
}

S404.propTypes = {
};

export default connect()(S404);