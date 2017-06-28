import React from 'react';
import { connect } from 'dva';
import { Table, Icon, Button, Tooltip, Col, Row, Popconfirm } from 'antd';
import RoleList from './DataList';
import EditForm from './EditForm';

class RoleBox extends React.Component {
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
			<div>{ this.state.editModel ? <EditForm editRecord={this.state.editRecord} closeForm={this.closeForm} /> : <RoleList openEditForm={this.openEditForm} /> }</div>
		);
	}
}

RoleBox.propTypes = {
};

export default RoleBox;