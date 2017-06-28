import React from 'react';
import { connect } from 'dva';

function Index() {
	return (
		<div>dashboard</div>
	);
}

Index.propTypes = {
};

export default connect()(Index);