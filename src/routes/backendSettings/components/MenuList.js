import React, {PropTypes} from 'react';
import { connect } from 'dva';
import { Table, Icon, Button, Tooltip, Col, Row, Popconfirm } from 'antd';

class MenuList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
		this.movePosition = this.movePosition.bind(this);
		this.deleteRecord = this.deleteRecord.bind(this);
		this.openEditForm = this.openEditForm.bind(this);
	}

	componentDidMount () {
		this.props.dispatch({
			type: 'setting/queryMenus'
		});
	}

	movePosition (record, position) {
		this.props.dispatch({
			type: 'setting/editMenu',
			payload: {
				id: record.id,
				params: {
					move: position,
					display_name: record.display_name
				}
			}
		});
	}

	deleteRecord (record) {
		this.props.dispatch({
			type: 'setting/deleteMenu',
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
				title: '菜单名称',
				dataIndex: 'display_name',
				key: 'display_name',
				width: 240,
			}, {
				title: '图标',
				dataIndex: 'icon',
				key: 'icon',
				width: 80,
				render: (text, record) => {
					return (<div>{record.icon && <Icon type={record.icon} />}</div>)
				}
			}, {
				title: '链接',
				dataIndex: 'url',
				key: 'url'
			}, {
				title: '路由',
				dataIndex: 'route',
				key: 'route'
			}, {
				title: '描述',
				dataIndex: 'description',
				key: 'description'
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
					<Col xs={12}><h3 className="page-title">菜单设置</h3></Col>
					<Col xs={12} className="align-right"><Button type="primary" onClick={e => this.openEditForm()}>新建菜单</Button></Col>
				</Row>
				<Table columns={columns} dataSource={this.props.setting.menus}
					bordered loading={this.props.loading} pagination={false} />
			</div>
		);
	};
}

MenuList.propTypes = {
	openEditForm: PropTypes.func.isRequired,
	dispatch: PropTypes.func.isRequired,
};

function mapStateToProps({ setting, loading }) {
	return { setting, loading: loading.models.setting };
}

export default connect(mapStateToProps)(MenuList);