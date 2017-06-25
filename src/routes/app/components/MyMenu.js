import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { Menu, Icon } from 'antd';
import { Link } from 'dva/router';
import { getMyMenuTree } from '../../../utils/utils';

const renderMenus = (menuArray, rootMenu = false) => {
	return menuArray.map(item => {
		if (item.children && item.children.length > 0) {
			if (item.visible) {
				return (
					<Menu.SubMenu
						key={item.key}
						title={<span>
							{item.icon && <Icon type={item.icon} />}
							<span className={rootMenu ? 'nav-name' : ''}>{item.display_name}</span>
						</span>}
					>
						{renderMenus(item.children)}
					</Menu.SubMenu>
				)
			}
		} else if (item.visible) {
			return (
				<Menu.Item key={item.key}>
					<Link to={item.url}>
						{item.icon && <Icon type={item.icon} />}
						<span className={rootMenu ? 'nav-name' : ''}>{item.display_name}</span>
					</Link>
				</Menu.Item>
			)
		}
	})
}

class MyMenu extends React.Component {

	constructor(props, context) {
		super(props, context);
		this.state = {};
		this.onSelect = this.onSelect.bind(this);
	}
	componentDidMount () {
		this.props.dispatch({
			type: 'setting/queryMenus'
		});
	}

	onSelect () {
		console.error(arguments);
	}

	render() {
		const menus = getMyMenuTree(this.props.setting.menus || [], this.props.app.user.menus);
		return (
			<Menu
				theme='dark'
				mode={this.props.app.siderFold ? 'vertical' : 'inline'}
				onSelect={this.onSelect}
				>
				{renderMenus(menus, true)}
			</Menu>
		);
	}
}

MyMenu.propTypes = {
	dispatch: PropTypes.func.isRequired,
};

function mapStateToProps({ setting, app, loading }) {
	return { setting, app, loading: loading.models.setting };
}

export default connect(mapStateToProps)(MyMenu);