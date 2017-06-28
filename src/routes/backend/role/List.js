import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { Table, Icon, Button, Tooltip, Col, Row, Popconfirm } from 'antd';

class RoleList extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {};
		this.deleteRecord = this.deleteRecord.bind(this);
	}

	componentDidMount () {
		let payload = {};
		if (this.props.params.accountId) {
			payload.queryParams = {
				backend_id: this.props.params.accountId
			};
		}
		this.props.dispatch({
			type: 'backendRole/query',
			payload: payload
		});
	}

	deleteRecord (record) {
		this.props.dispatch({
			type: 'backendRole/delete',
			payload: {
				id: record.id
			}
		});
	}

	render() {

		const columns = [
			{
				title: '权重',
				dataIndex: 'weight',
				key: 'weight',
			}, {
				title: 'Code',
				dataIndex: 'name',
				key: 'name',
			}, {
				title: '显示名称',
				dataIndex: 'display_name',
				key: 'display_name',
			}, {
				title: '描述',
				dataIndex: 'description',
				key: 'description',
			}, {
				'title': '操作',
				dataIndex: 'operations',
				width: 80,
				render: (text, record) => {
					return (
						<div>
							<Tooltip title="修改">
								<a > <Icon type="edit" /> </a>
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
					<Col xs={12}><h3 className="page-title">角色设置</h3></Col>
					<Col xs={12} className="align-right"><Button type="primary">新建角色</Button></Col>
				</Row>
				<Table columns={columns} dataSource={this.props.backendRole.roles}
					bordered loading={this.props.loading} pagination={false} />
			</div>
		);
	}
}

RoleList.propTypes = {
	dispatch: PropTypes.func.isRequired,
};

function mapStateToProps({ backendRole, loading }) {
	return { backendRole, loading: loading.models.backendRole };
}

export default connect(mapStateToProps)(RoleList);