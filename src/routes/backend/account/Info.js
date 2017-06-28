import React, {PropTypes} from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card, Menu } from 'antd';

class Info extends React.Component {

	constructor(props, context) {
		super(props, context);
	}

	render() {
		const baseUri = `/backend/account/${this.props.params.accountId}`;
		return (
			<Card className="body-box" bodyStyle={{'paddingTop': '8px'}}>
				<Menu mode="horizontal" className="tabMenu">
					<Menu.Item key="menu">
						<Link activeClassName="active" onlyActiveOnIndex={true} to={`${baseUri}/edit`}>分公司信息</Link>
					</Menu.Item>
					<Menu.Item key="permission">
						<Link activeClassName="active" to={`${baseUri}/departments`}>部门管理</Link>
					</Menu.Item>
					<Menu.Item key="category">
						<Link activeClassName="active"  to={`${baseUri}/roles`}>角色管理</Link>
					</Menu.Item>
				</Menu>
				{this.props.children}
			</Card>
		);
	};
}

Info.propTypes = {
	location: PropTypes.object,
	children: PropTypes.element.isRequired,
};

// System.contextTypes = {
// 	router: PropTypes.object
// };

// export default System;
export default connect()(Info);