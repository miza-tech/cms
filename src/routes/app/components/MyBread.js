import React, { PropTypes } from 'react';
import { Breadcrumb, Icon } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { menu } from '../../../config';

const MyBread = ({routes, setting}) => {
	const currRoute = routes[routes.length - 1].path || '/dashboard';
	let breakMenu = [];

	const makeBread = (path, menu) => {
		let result = false;
		for (var i = 0, l = menu.length; i < l; i++) {
			let item = menu[i];
			if (item.route == path || item.url == path || (item.children && makeBread(path, item.children))) {
				let currItem = {
					'id': item.id,
					'display_name': item.display_name,
					'url': item.url,
					'icon': item.icon
				};
				breakMenu.unshift(currItem);
				result = true;
			}
		}
		return result;
	};

	makeBread(currRoute, setting.menus || []);
	const currMenu = breakMenu[breakMenu.length - 1] || {};

	const breads = breakMenu.map((item, key) => {
		return (
			<Breadcrumb.Item key={key} href={item.url}>
				{item.icon && <Icon type={item.icon} />}
				<span>{item.display_name}</span>
			</Breadcrumb.Item>
		)
	})

	return (
		<div className="page-bread">
			<span className="page-title">{ currMenu.display_name }</span>
			<Breadcrumb>
				<Breadcrumb.Item key="root">
					<Link to="/" >
						<Icon type="home" />
						首页
					</Link>
				</Breadcrumb.Item>
				{breads}
			</Breadcrumb>
		</div>
	);
};

MyBread.propTypes = {
	routes: PropTypes.array,
	setting: PropTypes.object
}

function mapStateToProps({ setting }) {
	return { setting };
}

export default connect(mapStateToProps)(MyBread);