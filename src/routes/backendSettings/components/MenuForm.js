import React, {PropTypes} from 'react';
import { connect } from 'dva';
import { Button, Form, Input, Tooltip, Icon, Alert, Row, Col, TreeSelect } from 'antd';
import FormError from '../../../components/FormError';
import { formatPermissions } from '../../../utils/utils';
import { PermissionSection } from './';
const FormItem = Form.Item;

class MenuForm extends React.Component {

	constructor(props, context) {
		super(props, context);

		this.state = {
			error: null,
			checkedPermissions: this.props.editRecord ? this.props.editRecord.permissions : []
		};

		this.onPermissionChanged = this.onPermissionChanged.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.submitCb = this.submitCb.bind(this);
	}

	onPermissionChanged (checkedPermissions) {
		this.setState({
			checkedPermissions: checkedPermissions
		});
	}

	submitCb (response) {
		if (response.code != 'SUCCESS') {
			this.setState({
				error: response
			});
		} else {
			this.props.closeForm();
		}
	}

	onSubmit () {

		const { validateFields, getFieldsValue } = this.props.form;
		validateFields((errors) => {
			if (errors) return;

			const editRecord = this.props.editRecord || {};
			let formData = getFieldsValue();

			formData.parent_id = formData.parent_id || null;
			this.props.dispatch({
				type: 'setting/editMenu',
				payload: {
					id: editRecord.id,
					params: {
						...formData,
						permissions: this.state.checkedPermissions,
					},
					cb: this.submitCb
				}
			});
		});
	}

	render() {

		const {getFieldDecorator} = this.props.form;
		const editRecord = this.props.editRecord || {};
		const formItemLayout = {
			labelCol: {
				span: 7,
			},
			wrapperCol: {
				span: 17,
			}
		};
		const treeSelectProps = {
			treeData: this.props.setting.menus || [],
			treeDefaultExpandAll: false,
			showSearch: true,
			placeholder: '不选择则是根菜单'
		};
		const permissions = formatPermissions(this.props.setting.permissions);

		return (
			<div>
				<Row className="page-header" type="flex" align="middle">
					<Col xs={12}><h3 className="page-title">{ editRecord.id ? '编辑菜单' : '新建菜单' }</h3></Col>
					<Col xs={12} className="align-right"><Button type="primary" ghost onClick={this.props.closeForm}>取消返回</Button></Col>
				</Row>

				<Form>
					<Row className="formSection">
						<Col xs={24} sm={24} lg={10} xl={8}>
							<FormItem label="菜单名称:" hasFeedback {...formItemLayout}>
								{getFieldDecorator('display_name', {
									initialValue: editRecord.display_name,
									rules: [
										{
											required: true,
											message: '请填类型名称',
										},
									],
								})(<Input placeholder="输入类型名称" />)}
							</FormItem>
							<FormItem label="父级菜单" hasFeedback {...formItemLayout}>
								{getFieldDecorator('parent_id', {
									// initialValue: editRecord.parent_id,
									initialValue: !editRecord.parent_id ? undefined : editRecord.parent_id + "",
									rules: [],
								})(<TreeSelect {...treeSelectProps} />)}
							</FormItem>
							<FormItem label="菜单链接" hasFeedback {...formItemLayout}>
								{getFieldDecorator('url', {
									initialValue: editRecord.url,
									rules: [],
								})(<Input placeholder="输入菜单对应的链接" />)}
							</FormItem>
							<FormItem label="菜单路由" hasFeedback {...formItemLayout}>
								{getFieldDecorator('route', {
									initialValue: editRecord.route,
									rules: [],
								})(<Input placeholder="菜单路由名称" />)}
							</FormItem>
							<FormItem label="菜单图标" hasFeedback {...formItemLayout}>
								{getFieldDecorator('icon', {
									initialValue: editRecord.icon,
									rules: [],
								})(<Input placeholder="输入类型名称" />)}
							</FormItem>
							<FormItem label="描述" hasFeedback {...formItemLayout}>
								{getFieldDecorator('description', {
									initialValue: editRecord.description,
									rules: [],
								})(<Input placeholder="" type="textarea" autosize={{ minRows: 2, maxRows: 3 }} />)}
							</FormItem>
						</Col>
					</Row>
				</Form>
				<h3 className="formSectionTitle">菜单权限</h3>
				<PermissionSection checkedPermissions={this.state.checkedPermissions} onChange={this.onPermissionChanged} editAble={true} />

				<div className="formSectionSubmit">
					<Button type="primary" size="large" onClick={this.onSubmit} loading={this.props.loading}>提交</Button>
					<Button size="large" type="primary" ghost onClick={this.props.closeForm}>取消返回</Button>
				</div>
			</div>
		);
	};
}

function mapStateToProps({ setting, loading }) {
	return { setting, loading: loading.models.setting };
}

MenuForm.propTypes = {
	editRecord: PropTypes.object,
	closeForm: PropTypes.func.isRequired,
	dispatch: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(Form.create()(MenuForm));