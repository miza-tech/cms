import React from 'react';
import { connect } from 'dva';
import { Table, Icon, Button, Tooltip, Col, Row, Popconfirm, Card } from 'antd';
import DepartmentModal from './DepartmentModal';

class DepartmentList extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			editModalVisible: false,
			editRecord: null,
			modalRandom: 0,
		};
		this.deleteRecord = this.deleteRecord.bind(this);
		this.openEditModal = this.openEditModal.bind(this);
		this.movePosition = this.movePosition.bind(this);
	}

	componentDidMount () {
		let payload = {};
		if (this.props.params.accountId) {
			payload.queryParams = {
				backend_id: this.props.params.accountId
			};
		}
		this.props.dispatch({
			type: 'backendDepartment/query',
			payload: payload
		});
	}

	movePosition (record, position) {
		this.props.dispatch({
			type: 'backendDepartment/edit',
			payload: {
				id: record.id,
				params: {
					move: position,
					display_name: record.display_name
				}
			}
		});
	}

	openEditModal (record) {
		this.setState({
			modalRandom: new Date().getTime(),
			editModalVisible: true,
			editRecord: record
		});
	}

	deleteRecord (record) {
		this.props.dispatch({
			type: 'backendDepartment/delete',
			payload: {
				id: record.id
			}
		});
	}

	render() {
		const columns = [
			{
				title: '显示名',
				dataIndex: 'display_name',
				key: 'display_name',
			}, {
				title: '描述',
				dataIndex: 'description',
				key: 'description',
			}, {
				'title': '操作',
				dataIndex: 'operations',
				width: 130,
				render: (text, record) => {
					return (
						<div>
							<Tooltip title="上移">
								<a onClick={e=>this.movePosition(record, 'up')}> <Icon type="arrow-up" /> </a>
							</Tooltip>
							<span className="ant-divider" />
							<Tooltip title="下移">
								<a onClick={e=>this.movePosition(record, 'down')}> <Icon type="arrow-down" /> </a>
							</Tooltip>
							<span className="ant-divider" />
							<Tooltip title="修改">
								<a onClick={e => this.openEditModal(record)}> <Icon type="edit" /> </a>
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

		const departments = this.props.backendDepartment.departments || [];

		return (
			<div>
				<Row className="page-header" type="flex" align="middle">
					<Col xs={12}><h3 className="page-title">部门管理</h3></Col>
					<Col xs={12} className="align-right"><Button type="primary" onClick={e => this.openEditModal()}>新建部门</Button></Col>
				</Row>
				<Table columns={columns} dataSource={this.props.backendDepartment.departments}
					bordered loading={this.props.loading} pagination={false} />
				<DepartmentModal modalRandom={this.state.modalRandom} backendId={this.props.params.accountId} visible={this.state.editModalVisible} editRecord={this.state.editRecord} />
			</div>
		);
	}
}

DepartmentList.propTypes = {
};

function mapStateToProps({ backendDepartment, loading }) {
	return { backendDepartment, loading: loading.models.backendDepartment };
}

export default connect(mapStateToProps)(DepartmentList);