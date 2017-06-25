import React from 'react';
import { connect } from 'dva';
import { Table, Icon, Button, Tooltip, Col, Row, Popconfirm } from 'antd';
import { UserList, UserForm } from './';

class UserBox extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			editModel: false,
			editRecord: null
		};
		this.openEditForm = this.openEditForm.bind(this);
		this.closeForm = this.closeForm.bind(this);
	}

	openEditForm (record) {
		this.setState({
			editModel: true,
			editRecord: record
		});
	}

	closeForm () {
		this.setState({
			editModel: false
		});
	}

	render() {
		return (
			<UserList openEditForm={this.openEditForm} />
		);
	}
}

UserBox.propTypes = {
};

export default UserBox;