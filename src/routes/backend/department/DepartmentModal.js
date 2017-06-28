import React from 'react';
import { connect } from 'dva';
import { Button, Modal, Form, Input, InputNumber, Select,Tooltip, Icon, Alert, Row, Col, TreeSelect } from 'antd';

const FormItem = Form.Item;

class DepartmentModal extends React.Component {

	constructor(props, context) {
		super(props, context);

		this.state = {
			visible: this.props.visible,
			modalRandom: null,
			error: null
		};

		this.onSubmit = this.onSubmit.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.submitCb = this.submitCb.bind(this);
	}

	componentDidMount () {
	}

	componentWillReceiveProps(newProps) {
		if (newProps.modalRandom != this.state.modalRandom) {
			this.props.form.resetFields();

			this.setState({
				modalRandom: newProps.modalRandom,
				visible: newProps.visible,
				editRecord: newProps.editRecord,
				error: null
			});
		}
	}

	submitCb (response) {
		if (response.code != 'SUCCESS') {
			this.setState({
				error: response
			});
		} else {
			this.setState({
				visible: false
			});
		}
	}

	onSubmit () {

		const { validateFields, getFieldsValue } = this.props.form;
		validateFields((errors) => {
			if (errors) return;

			const editRecord = this.state.editRecord || {};

			this.props.dispatch({
				type: 'backendDepartment/edit',
				payload: {
					id: editRecord.id,
					params: {
						...getFieldsValue(),
						backend_id: this.props.backendId
					},
					cb: this.submitCb
				}
			});
		});
	}

	onCancel () {
		this.setState({
			visible: false
		});
	}

	render() {
		const formItemLayout = {
			labelCol: {
				span: 6,
			},
			wrapperCol: {
				span: 16,
			}
		};

		const {getFieldDecorator} = this.props.form;
		const editRecord = this.state.editRecord || {};

		const modalProps = {
			title: this.props.editRecord ? '编辑权限' : '新建权限',
			onOk: this.onSubmit,
			onCancel: this.onCancel,
			visible: this.state.visible,
			maskClosable: false,
			confirmLoading: this.props.loading
		};
		const treeSelectProps = {
			treeData: this.props.backendDepartment.departments || [],
			treeDefaultExpandAll: false,
			showSearch: true,
			placeholder: '不选择则是根部门'
		};

		return (
			<Modal {...modalProps}>
				<Form>
					<FormItem label="部门名称:" hasFeedback {...formItemLayout}>
						{getFieldDecorator('display_name', {
							initialValue: editRecord.display_name,
							rules: [
								{
									required: true,
									message: '请输入部门名称',
								},
							],
						})(<Input placeholder="请输入部门名称" />)}
					</FormItem>
					<FormItem label="上级部门" hasFeedback {...formItemLayout}>
						{getFieldDecorator('parent_id', {
							// initialValue: editRecord.parent_id,
							initialValue: !editRecord.parent_id ? undefined : editRecord.parent_id + "",
							rules: [],
						})(<TreeSelect {...treeSelectProps} />)}
					</FormItem>
					<FormItem label="描述:" hasFeedback {...formItemLayout}>
						{getFieldDecorator('description', {
							initialValue: editRecord.description,
							rules: [],
						})(<Input placeholder="" type="textarea" autosize={{ minRows: 2, maxRows: 3 }} />)}
					</FormItem>
				</Form>
			</Modal>
		);
	};
}

function mapStateToProps({ backendDepartment, loading }) {
	return { backendDepartment, loading: loading.models.backendDepartment };
}

export default connect(mapStateToProps)(Form.create()(DepartmentModal));