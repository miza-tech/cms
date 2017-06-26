import React, {PropTypes} from 'react';
import { connect } from 'dva';
import { Tabs, Card } from 'antd';
import {MenuBox, RoleBox, PermissionList, CategoryList} from './components';

import { browserHistory } from 'dva/router';


const TabPane = Tabs.TabPane;

class System extends React.Component {

	constructor(props, context) {
		super(props, context);

		this.state = {
			section: this.props.routeParams.section || 'menu'
		};

		this.changeCategory = this.changeCategory.bind(this);
	}

	componentWillReceiveProps (newPros) {
		const section = newPros.routeParams.section;
		const sectionValid = ['menu', 'permission', 'category'].indexOf(section) > -1;
		this.setState({
			section: sectionValid ? section : 'menu'
		});
	}

	componentDidMount () {
	}

	changeCategory (section) {
		this.context.router.push('/backend/setting/system/' + section);
		this.setState({
			section: section
		});
	}

	render() {
		return (
			<Card bodyStyle={{ padding: '16px 24px 32px 24px' }}>
				<Tabs defaultActiveKey='menu' activeKey={this.state.section} animated={false} onChange={this.changeCategory}>
				    <TabPane tab="菜单设置" key="menu"><MenuBox /></TabPane>
				    <TabPane tab="权限设置" key="permission"><PermissionList /></TabPane>
				    <TabPane tab="权限分类设置" key="category"><CategoryList /></TabPane>
				  </Tabs>
			</Card>
		);
	};
}

System.propTypes = {
	location: PropTypes.object
};

System.contextTypes = {
	router: PropTypes.object
};

function mapStateToProps({ app }) {
	return { app };
}

// export default System;
export default connect()(System);
// export default connect(({ users, loading }) => ({ users, loading: loading.models.users }))(Users)