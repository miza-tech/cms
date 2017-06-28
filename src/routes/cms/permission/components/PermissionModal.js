import React from 'react';
import { connect } from 'dva';
import { Button, Modal, Form, Input, InputNumber, Select,Tooltip, Icon, Alert, Row, Col } from 'antd';
const FormItem = Form.Item;

class PermissionModal extends React.Component {

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
		this.props.dispatch({
			type: 'cmsPermission/queryCategories'
		});
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
				type: 'cmsPermission/edit',
				payload: {
					id: editRecord.id,
					params: getFieldsValue(),
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
		const categories = this.props.cmsPermission.categories || [];

		const modalProps = {
			title: this.props.editRecord ? '编辑权限' : '新建权限',
			onOk: this.onSubmit,
			onCancel: this.onCancel,
			visible: this.state.visible,
			maskClosable: false,
			confirmLoading: this.props.loading
		};

		return (
			<Modal {...modalProps}>
				<Form>
					<FormItem label="权限类型" hasFeedback {...formItemLayout}>
						{getFieldDecorator('category_id', {
							initialValue: !editRecord.category_id ? undefined : editRecord.category_id + "",
							rules: [
								{
									required: true,
									message: '请选择类别'
								}
							],
						})(
							<Select placeholder="选择类别">
								{
									categories.map((item)=>{
										return (<Select.Option key={item.key} value={item.value} title={item.display_name}>{item.display_name}</Select.Option>);
									})
								}
							</Select>
						)}
					</FormItem>
					<FormItem label="Name:" hasFeedback {...formItemLayout}>
						{getFieldDecorator('name', {
							initialValue: editRecord.name,
							rules: [
								{
									required: true,
									message: '请输入Name',
								},
							],
						})(<Input placeholder="输入Name" />)}
					</FormItem>
					<FormItem label="Route:" hasFeedback {...formItemLayout}>
						{getFieldDecorator('route', {
							initialValue: editRecord.route,
							rules: [
								{
									required: true,
									message: '请输入Route',
								},
							],
						})(<Input placeholder="输入Route" />)}
					</FormItem>
					<FormItem label="显示名称:" hasFeedback {...formItemLayout}>
						{getFieldDecorator('display_name', {
							initialValue: editRecord.display_name,
							rules: [
								{
									required: true,
									message: '请输入显示名称',
								}
							],
						})(<Input placeholder="请输入显示名称" />)}
					</FormItem>
					<FormItem label="Action" hasFeedback {...formItemLayout}>
						{getFieldDecorator('action', {
							initialValue: editRecord.action,
							rules: [
								{
									required: true,
									message: '请输入Action',
								}
							],
						})(<Input placeholder="输入类型名称" />)}
					</FormItem>
					<FormItem label="Middleware" hasFeedback {...formItemLayout}>
						{getFieldDecorator('middleware', {
							initialValue: editRecord.middleware,
							rules: [
							],
						})(<Input placeholder="输入Middleware" />)}
					</FormItem>
					<FormItem label="排序权重:" hasFeedback {...formItemLayout}>
						{getFieldDecorator('weight', {
							initialValue: editRecord.weight,
							rules: [
							],
						})(<Input placeholder="权重越大，排序越靠前" />)}
					</FormItem>
					<FormItem label="描述" hasFeedback {...formItemLayout}>
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

function mapStateToProps({ cmsPermission, loading }) {
	return { cmsPermission, loading: loading.models.cmsPermission };
}

export default connect(mapStateToProps)(Form.create()(PermissionModal));