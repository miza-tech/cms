import React, { PropTypes } from 'react';
import { Layout, Icon, Menu, Badge } from 'antd';
import { Link } from 'dva/router';

const {Header} = Layout

function MyHeader ({ siderFold, location, switchSider, user, logout}) {
	const handleClickMenu = (e) => {
		switch(e.key) {
			case 'logout':
				logout();
				break;
		}
	}
	return (
		<Header>
			<div className="button"
				onClick={switchSider}
				>
				<Icon
					className="trigger"
					type={siderFold ? 'menu-unfold' : 'menu-fold'}
				/>
			</div>
			<Menu mode="horizontal" onClick={handleClickMenu}>
				<Menu.SubMenu
					title={<span ><Icon type="user" />{ user.realname || user.phone }</span>}
					>
					<Menu.Item key="profile">
						<Link to='/profile'>
							<Icon type="exclamation-circle-o" />
							个人资料
						</Link>
					</Menu.Item>
					<Menu.Item key="logout" onClick={logout}>
						<Icon type="logout" />
						退出登陆
					</Menu.Item>
				</Menu.SubMenu>
			</Menu>
		</Header>
	)
}

MyHeader.propTypes = {
	siderFold: PropTypes.bool,
	location: PropTypes.object,
	switchSider: PropTypes.func,
	user: PropTypes.object,
	logout: PropTypes.func
};

export default MyHeader;