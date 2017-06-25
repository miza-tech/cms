import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { Table, Icon, Button, Tooltip, Col, Row, Popconfirm, Badge } from 'antd';

class UserList extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {};
		this.deleteRecord = this.deleteRecord.bind(this);
		this.openEditForm = this.openEditForm.bind(this);
	}

	componentDidMount () {
		this.props.dispatch({
			type: 'administrator/queryUsers'
		});
	}

	deleteRecord (record) {
		this.props.dispatch({
			type: 'administrator/deleteUser',
			payload: {
				id: record.id
			}
		});
	}

	openEditForm (record) {
		this.props.openEditForm(record);
	}

	render() {

		const columns = [
			{
				title: 'ID',
				dataIndex: 'id',
				key: 'id',
			}, {
				title: '手机号',
				dataIndex: 'phone',
				key: 'phone',
			}, {
				title: '姓名',
				dataIndex: 'realname',
				key: 'realname',
			}, {
				title: '部门',
				dataIndex: 'department_id',
				key: 'department_id',
			}, {
				title: '激活',
				dataIndex: 'activated',
				key: 'activated',
				render: (text, record) => {
					if (record.activated == 0) {
						return (<Badge status="warning" text="未激活" />);
					} else {
						return (<Badge status="success" text="已激活" />);
					}
				}
			}, {
				'title': '操作',
				dataIndex: 'operations',
				width: 80,
				render: (text, record) => {
					return (
						<div>
							<Tooltip title="修改">
								<a onClick={e => this.openEditForm(record)}> <Icon type="edit" /> </a>
							</Tooltip>
							<span className="ant-divider" />
							<Tooltip title="删除">
								<Popconfirm title="确认要删除该菜单吗？" onConfirm={e => this.deleteRecord(record)} okText="确认" cancelText="取消">
									<a> <Icon type="delete" /> </a>
								</Popconfirm>
							</Tooltip>
						</div>
					)
				}
			}
		];

		return (
			<div>
				<Row className="page-header" type="flex" align="middle">
					<Col xs={12}><h3 className="page-title">员工管理</h3></Col>
					<Col xs={12} className="align-right"><Button type="primary" onClick={e => this.openEditForm()}>添加新员工</Button></Col>
				</Row>
				<Table columns={columns} dataSource={this.props.administrator.users}
					bordered loading={this.props.loading} pagination={false} />
			</div>
		);
	}
}

UserList.propTypes = {
	openEditForm: PropTypes.func.isRequired,
	dispatch: PropTypes.func.isRequired,
};

function mapStateToProps({ administrator, loading }) {
	return { administrator, loading: loading.models.administrator };
}

export default connect(mapStateToProps)(UserList);