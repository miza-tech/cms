import React, {PropTypes} from 'react';
import { connect } from 'dva';
import { Tabs, Card } from 'antd';
import {UserBox, RoleBox, DepartmentList} from './components';


const TabPane = Tabs.TabPane;

class Administrator extends React.Component {

	constructor(props, context) {
		super(props, context);

		const section = this.props.routeParams.section;
		const sectionValid = ['role', 'department', 'user'].indexOf(section) > -1;

		this.state = {
			section: sectionValid ? section : 'user'
		};

		this.changeCategory = this.changeCategory.bind(this);
	}

	componentDidMount () {
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
				<Tabs defaultActiveKey={this.state.section} animated={false} onChange={this.changeCategory}>
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