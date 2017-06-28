import React, {PropTypes} from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card, Menu } from 'antd';

class System extends React.Component {

	constructor(props, context) {
		super(props, context);
	}

	render() {
		return (
			<Card className="body-box" bodyStyle={{'paddingTop': '8px'}}>
				<Menu mode="horizontal" className="tabMenu">
					<Menu.Item key="menu">
						<Link activeClassName="active" onlyActiveOnIndex={true} to="/cms/system/menus">菜单设置</Link>
					</Menu.Item>
					<Menu.Item key="permission">
						<Link activeClassName="active" to="/cms/system/permissions">权限设置</Link>
					</Menu.Item>
					<Menu.Item key="category">
						<Link activeClassName="active" to="/cms/system/permission/categorys">权限分类设置</Link>
					</Menu.Item>
				</Menu>
				{this.props.children}
			</Card>
		);
	};
}

System.propTypes = {
	location: PropTypes.object,
	children: PropTypes.element.isRequired,
};

// System.contextTypes = {
// 	router: PropTypes.object
// };

// export default System;
export default connect()(System);