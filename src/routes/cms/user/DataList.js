import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { Table, Icon, Button, Tooltip, Col, Row, Popconfirm, Badge, Input, TreeSelect, Select, Form, Card } from 'antd';
import { constant } from '../../../config';
import { genSearchParams } from '../../../utils/utils';

class UserList extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			// queryParams: null
		};
		this.deleteRecord = this.deleteRecord.bind(this);
		this.openEditForm = this.openEditForm.bind(this);
		this.onSearch = this.onSearch.bind(this);
	}

	componentDidMount () {
		this.props.dispatch({
			type: 'cmsUser/query',
			// payload: this.state.queryParams
		});
		this.props.dispatch({
			type: 'cmsDepartment/query'
		});
	}

	deleteRecord (record) {
		this.props.dispatch({
			type: 'cmsUser/delete',
			payload: {
				id: record.id
			}
		});
	}

	openEditForm (record) {
		this.props.openEditForm(record);
	}

	onSearch () {
		const queryParams = genSearchParams(this.props.form.getFieldsValue());
		this.props.dispatch({
			type: 'cmsUser/query',
			payload: {
				queryParams: queryParams
			}
		});

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
				render: (text, record) => {
					return record.department ? record.department.display_name : '--';
				}
			}, {
				title: '账号状态',
				dataIndex: 'activated',
				key: 'activated',
				render: (text, record) => {
					const status = constant.USER_STATUS[record.status] || {
						status: 'default',
						'text': '--'
					};
					return (<Badge {...status} />);
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

		const paginationConf = this.props.cmsUser.users_pagination;
		let pagination;
		if (paginationConf) {
			pagination = {
				...this.props.cmsUser.users_pagination
			};
		} else {
			pagination = false;
		}
		const treeSelectProps = {
			treeData: this.props.cmsDepartment.departments || [],
			treeDefaultExpandAll: false,
			showSearch: true,
			placeholder: '所有部门'
		};
		const getFieldDecorator = this.props.form.getFieldDecorator;

		return (
			<Card>
				<Row className="page-header" type="flex" align="middle">
					<Col xs={16} >
						<Form>
							<Input.Group compact>
								{getFieldDecorator('department_id', {
								})(
									<TreeSelect {...treeSelectProps} style={{ width: '120px' }} showSearch={false} />
								)}

								{getFieldDecorator('status', {
								})(
									<Select style={{width:'80px'}} placeholder="所有状态">
										<Select.Option value="nonactivated">未激活</Select.Option>
										<Select.Option value="activated">已激活</Select.Option>
										<Select.Option value="freeze">冻结</Select.Option>
									</Select>
								)}
								{getFieldDecorator('phone', {
								})(
									<Input style={{ width: '140px' }} placeholder="手机号码" />
								)}
								{getFieldDecorator('realname', {
								})(
									<Input style={{ width: '140px' }} placeholder="姓名" />
								)}
								<Button type="primary" icon="search" onClick={this.onSearch}></Button>
							</Input.Group>
						</Form>
					</Col>
					<Col xs={8} className="align-right"><Button type="primary" onClick={e => this.openEditForm()}>添加新员工</Button></Col>
				</Row>
				<Table columns={columns} dataSource={this.props.cmsUser.users}
					bordered loading={this.props.loading} pagination={pagination} />
			</Card>
		);
	}
}

UserList.propTypes = {
	openEditForm: PropTypes.func.isRequired,
	dispatch: PropTypes.func.isRequired,
};

UserList.contextTypes = {
	router: PropTypes.object
};

function mapStateToProps({ cmsUser, cmsDepartment, loading }) {
	return { cmsUser, cmsDepartment, loading: loading.models.cmsUser };
}

export default connect(mapStateToProps)(Form.create()(UserList));