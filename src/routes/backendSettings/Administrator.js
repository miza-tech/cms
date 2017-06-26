import React, {PropTypes} from 'react';
import { connect } from 'dva';
import { Tabs, Card } from 'antd';
import {UserBox, RoleBox, DepartmentList} from './components';


const TabPane = Tabs.TabPane;

class Administrator extends React.Component {

	constructor(props, context) {
		super(props, context);

		this.state = {
			section: this.props.routeParams.section || 'user'
		};

		this.changeCategory = this.changeCategory.bind(this);
	}

	componentDidMount () {
		// console.error(this.props);
	}

	componentWillReceiveProps (newPros) {
		const section = newPros.routeParams.section;
		const sectionValid = ['user', 'department', 'role'].indexOf(section) > -1;
		this.setState({
			section: sectionValid ? section : 'user'
		});
	}

	changeCategory (section) {
		this.context.router.push('/setting/administrator/' + section);
		this.setState({
			section: section
		});
	}

	render() {
		return (
			<Card bodyStyle={{ padding: '16px 24px 32px 24px' }}>
				<Tabs defaultActiveKey="user" activeKey={this.state.section} animated={false} onChange={this.changeCategory}>
				    <TabPane tab="员工管理" key="user"><UserBox /></TabPane>
				    <TabPane tab="部门管理" key="department"><DepartmentList /></TabPane>
				    <TabPane tab="角色设置" key="role"><RoleBox /></TabPane>
				  </Tabs>
			</Card>
		);
	};
}

Administrator.propTypes = {
	location: PropTypes.object
};

Administrator.contextTypes = {
	router: PropTypes.object
};

function mapStateToProps({ app }) {
	return { app };
}

export default Administrator;