import React from 'react';
import { connect } from 'dva';
import { Table, Icon, Button, Tooltip, Col, Row, Popconfirm } from 'antd';
import PermissionModal from './components/PermissionModal';

class List extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			editModalVisible: false,
			editRecord: null,
			modalRandom: 0,
		};
		this.deleteRecord = this.deleteRecord.bind(this);
		this.openEditModal = this.openEditModal.bind(this);
	}

	componentDidMount () {
		this.props.dispatch({
			type: 'backendPermission/query'
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
			type: 'setting/deletePermission',
			payload: {
				id: record.id
			}
		});
	}

	render() {
		const columns = [
			{
				title: '类别',
				dataIndex: 'category_name',
				key: 'category_name',
			}, {
				title: '权重',
				dataIndex: 'weight',
				key: 'weight',
			}, {
				title: '显示名',
				dataIndex: 'display_name',
				key: 'display_name',
			}, {
				title: 'Name',
				dataIndex: 'name',
				key: 'name',
			}, {
				title: 'Action',
				dataIndex: 'action',
				key: 'action',
			}, {
				title: 'Middleware',
				dataIndex: 'middleware',
				key: 'middleware',
			}, {
				title: 'description',
				dataIndex: 'description',
				key: 'description',
			}, {
				'title': '操作',
				dataIndex: 'operations',
				width: 80,
				className: 'align-center',
				render: (text, record) => {
					return (
						<div>
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

		const permissions = this.props.backendPermission.permissions || [];

		return (
			<div>
				<Row className="page-header" type="flex" align="middle">
					<Col xs={12}><h3 className="page-title">权限设置</h3></Col>
					<Col xs={12} className="align-right"><Button type="primary" onClick={e => this.openEditModal()}>新建权限</Button></Col>
				</Row>
				<Table columns={columns} dataSource={permissions}
					bordered loading={this.props.loading} pagination={false} />
				<PermissionModal modalRandom={this.state.modalRandom} visible={this.state.editModalVisible} editRecord={this.state.editRecord} />
			</div>
		);
	}
}

List.propTypes = {
};

function mapStateToProps({ backendPermission, loading }) {
	return { backendPermission, loading: loading.models.backendPermission };
}

export default connect(mapStateToProps)(List);