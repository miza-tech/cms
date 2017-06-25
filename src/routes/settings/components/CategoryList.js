import React from 'react';
import { connect } from 'dva';
import { Table, Icon, Button, Tooltip, Col, Row, Popconfirm } from 'antd';
import { CategoryModal } from './';

class CategoryList extends React.Component {
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
			type: 'setting/queryCategories'
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
			type: 'setting/deleteCategory',
			payload: {
				id: record.id
			}
		});
	}

	render() {
		const columns = [{
				title: '显示名',
				dataIndex: 'display_name',
				key: 'display_name',
			}, {
				'title': '操作',
				dataIndex: 'operations',
				width: 80,
				render: (text, record) => {
					return (
						<div>
							<Tooltip title="修改">
								<a onClick={e => this.openEditModal(record)}> <Icon type="edit" /> </a>
							</Tooltip>
							<span className="ant-divider" />
							<Tooltip title="删除">
								<Popconfirm title="确认要删除该分类吗？" onConfirm={e => this.deleteRecord(record)} okText="确认" cancelText="取消">
									<a> <Icon type="delete" /> </a>
								</Popconfirm>
							</Tooltip>
						</div>
					)
				}
			}
		];

		const categories = this.props.setting.categories || [];

		return (
			<div>
				<Row className="page-header" type="flex" align="middle">
					<Col xs={12}><h3 className="page-title">权限分类设置</h3></Col>
					<Col xs={12} className="align-right"><Button type="primary" onClick={e => this.openEditModal()}>新建分类</Button></Col>
				</Row>
				<Table columns={columns} dataSource={categories}
					bordered loading={this.props.loading} pagination={false} />
				<CategoryModal modalRandom={this.state.modalRandom} visible={this.state.editModalVisible} editRecord={this.state.editRecord} />
			</div>
		);
	}
}

CategoryList.propTypes = {
};

function mapStateToProps({ setting, loading }) {
	return { setting, loading: loading.models.setting };
}

export default connect(mapStateToProps)(CategoryList);