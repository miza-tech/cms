import React, {PropTypes} from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Form, Card, Row, Col, Input, Select, Button, Badge, Table, Tooltip, Icon, Popconfirm } from 'antd';
import { constant } from '../../config';
import { genSearchParams } from '../../utils/utils';

class AccountList extends React.Component {

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
			type: 'backend/queryBackendAccounts',
		});
	}

	openEditForm (record) {

	}

	deleteRecord (record) {
		this.props.dispatch({
			type: 'backend/deleteBackendAccount',
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
		queryParams = genSearchParams(queryParams);
		this.props.dispatch({
			type: 'backend/queryBackendAccounts',
			payload: {
				queryParams: queryParams
			}
		});
	}

	render() {
		const getFieldDecorator = this.props.form.getFieldDecorator;
		const columns = [
			{
				title: '编码',
				dataIndex: 'name',
				key: 'name',
			}, {
				title: '状态',
				dataIndex: 'status',
				key: 'status',
				render: (text, record) => {
					const status = constant.BACKEND_STATUS[record.status] || {
						status: 'default',
						'text': '--'
					};
					return (<Badge {...status} />);
				}
			}, {
				title: '名称',
				dataIndex: 'display_name',
				key: 'display_name',
			}, {
				title: '管理员',
				dataIndex: 'super_user_id',
				key: 'super_user_id',
				render: (text, record) => {
					if (record.administrator) {
						return (<a>{ record.administrator.realname || record.administrator.username }</a>);
					}
				}
			}, {
				title: '联系人',
				'dataIndex': 'contact_name',
				key: 'contact_name',
			}, {
				title: '联系电话',
				'dataIndex': 'contact_phone',
				key: 'contact_phone',
			}, {
				'title': '操作',
				dataIndex: 'operations',
				width: 80,
				render: (text, record) => {
					return (
						<div>
							<Tooltip title="修改">
								<Link to={`/backend/account/${record.id}/edit`}><Icon type="edit" /></Link>
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

		const paginationConf = this.props.backend.accounts_pagination;
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
									initialValue: 'display_name'
								})(
									<Select style={{width:'80px'}}>
										<Select.Option value="display_name">名称</Select.Option>
										<Select.Option value="name">编码</Select.Option>
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
						<Button type="primary"><Link to="/backend/account/new">创建新公司</Link></Button>
					</Col>
				</Row>
				<Table columns={columns} dataSource={ this.props.backend.accounts } bordered loading={this.props.loading} pagination={pagination} />
			</Card>
		);
	};
}

AccountList.propTypes = {
	dispatch: PropTypes.func.isRequired,
	form: PropTypes.object.isRequired,
};

AccountList.contextTypes = {
	router: PropTypes.object
};

function mapStateToProps({ backend, loading }) {
	return { backend, loading:loading.models.backend };
}

export default connect(mapStateToProps)(Form.create()(AccountList));