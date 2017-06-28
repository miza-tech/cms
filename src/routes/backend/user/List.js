import React, {PropTypes} from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Form, Card, Row, Col, Input, Select, Button, Badge, Table, Tooltip, Icon, Popconfirm } from 'antd';
import { constant } from '../../../config';
import { genSearchParams } from '../../../utils/utils';

class UserList extends React.Component {

	constructor(props, context) {
		super(props, context);
		this.state = {
			shortSearch: true,
		};
		this.onSearch = this.onSearch.bind(this);
		this.openEditForm = this.openEditForm.bind(this);
		this.deleteRecord = this.deleteRecord.bind(this);
	}

	componentWillReceiveProps (newPros) {
	}

	componentDidMount () {
		this.props.dispatch({
			type: 'backendUser/query',
		});
	}

	openEditForm (record) {

	}

	deleteRecord (record) {
		this.props.dispatch({
			type: 'backendUser/delete',
			payload: {
				id: record.id
			}
		});
	}

	onSearch () {
		let queryParams = this.props.form.getFieldsValue();

		if (this.state.shortSearch) {
			let tmp = {};
			tmp[queryParams.field] = queryParams.keyword;
			queryParams = tmp;
		}
		console.error(queryParams);

		this.props.dispatch({
			type: 'backendUser/query',
			payload: {
				queryParams: queryParams
			}
		});
	}

	render() {
		const getFieldDecorator = this.props.form.getFieldDecorator;
		const columns = [
			{
				title: '登录名',
				dataIndex: 'username',
				key: 'username',
			}, {
				title: '状态',
				dataIndex: 'status',
				key: 'status',
				render: (text, record) => {
					const status = constant.USER_STATUS[record.status] || {
						status: 'default',
						'text': '--'
					};
					return (<Badge {...status} />);
				}
			}, {
				title: '手机',
				dataIndex: 'phone',
				key: 'phone',
			}, {
				title: '姓名',
				dataIndex: 'realname',
				key: 'realname',
			}, {
				title: '分公司',
				dataIndex: 'backend_id',
				key: 'backend_id',
				render: (text, record) => {
					if (record.backend) {
						return (<a>{ record.backend.display_name }</a>);
					}
				}
			}, {
				title: '部门',
				dataIndex: 'department_id',
				key: 'department_id',
				render: (text, record) => {
					if (record.department) {
						return (<a>{ record.department.display_name }</a>);
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
								<Link to={`/backend/user/${record.id}/edit`}><Icon type="edit" /></Link>
							</Tooltip>
							<span className="ant-divider" />
							<Tooltip title="删除">
								<Popconfirm title="确认要删除该账号吗？" onConfirm={e => this.deleteRecord(record)} okText="确认" cancelText="取消">
									<a> <Icon type="delete" /> </a>
								</Popconfirm>
							</Tooltip>
						</div>
					)
				}
			}
		];

		const paginationConf = this.props.backendUser.users_pagination;
		let pagination;
		if (paginationConf) {
			pagination = {
				...paginationConf
			};
		} else {
			pagination = false;
		}

		return (
			<Card bodyStyle={{ padding: '24px 24px 32px 24px' }}>
				<Row className="page-header" type="flex" align="middle">
					<Col xs={16}>
						<Form>
							<Input.Group compact>
								{getFieldDecorator('field', {
									initialValue: 'phone'
								})(
									<Select style={{width:'80px'}}>
										<Select.Option value="phone">手机号</Select.Option>
										<Select.Option value="realname">姓名</Select.Option>
										<Select.Option value="username">登录名</Select.Option>
									</Select>
								)}
								{getFieldDecorator('keyword', {
								})(
									<Input style={{ width: '240px' }} placeholder="输入关键字" />
								)}
								<Button type="primary" onClick={this.onSearch}>搜索</Button>
							</Input.Group>
						</Form>
					</Col>
					<Col xs={8} className="align-right">
						<Button type="primary"><Link to="/backend/user/new">添加新用户</Link></Button>
					</Col>
				</Row>
				<Table columns={columns} dataSource={ this.props.backendUser.users || [] } bordered loading={this.props.loading} pagination={pagination} />
			</Card>
		);
	};
}

UserList.propTypes = {
	dispatch: PropTypes.func.isRequired,
	form: PropTypes.object.isRequired,
};

UserList.contextTypes = {
	router: PropTypes.object
};

function mapStateToProps({ backendUser, loading }) {
	return { backendUser, loading:loading.models.backendUser };
}

export default connect(mapStateToProps)(Form.create()(UserList));