import React, {PropTypes} from 'react';
import { connect } from 'dva';
import { Button, Form, Input, Tooltip, Icon, Alert, Row, Col } from 'antd';
import { formatPermissions } from '../../../utils/utils';
import PermissionList from '../../../components/PermissionList/';

const FormItem = Form.Item;

class RoleForm extends React.Component {

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

	// componentDidMount () {
	// }

	componentWillReceiveProps (newProps) {
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

			this.props.dispatch({
				type: 'setting/editRole',
				payload: {
					id: editRecord.id,
					params: {
						...getFieldsValue(),
						permissions: this.state.checkedPermissions
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
		const permissions = formatPermissions(this.props.cmsPermission.permissions);

		return (
			<div>
				<Row className="page-header" type="flex" align="middle">
					<Col xs={12}><h3 className="page-title">{ editRecord.id ? '编辑权限' : '新建权限' }</h3></Col>
					<Col xs={12} className="align-right"><Button type="primary" ghost onClick={this.props.closeForm}>取消返回</Button></Col>
				</Row>

				<Form>
					<Row className="formSection">
						<Col xs={24} sm={24} lg={10} xl={8}>
						<FormItem label="角色CODE:" hasFeedback {...formItemLayout}>
							{getFieldDecorator('name', {
								initialValue: editRecord.name,
								rules: [
									{
										required: true,
										message: '请输入角色CODE',
									},
								],
							})(<Input placeholder="输入角色CODE" disabled={!!editRecord.id} />)}
						</FormItem>
						<FormItem label="角色显示名称:" hasFeedback {...formItemLayout}>
							{getFieldDecorator('display_name', {
								initialValue: editRecord.display_name,
								rules: [
									{
										required: true,
										message: '请输入角色显示名称',
									},
								],
							})(<Input placeholder="请输入角色显示名称" />)}
						</FormItem>
						<FormItem label="排序权重:" hasFeedback {...formItemLayout}>
							{getFieldDecorator('weight', {
								initialValue: editRecord.weight,
								rules: [
								],
							})(<Input placeholder="排序权重" />)}
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
				<h3 className="formSectionTitle">角色权限</h3>
				<PermissionList checkedPermissions={this.state.checkedPermissions} onChange={this.onPermissionChanged} editAble={true} />

				<div className="formSectionSubmit">
					<Button type="primary" size="large" onClick={this.onSubmit} loading={this.props.loading}>提交</Button>
					<Button size="large" type="primary" ghost onClick={this.props.closeForm}>取消返回</Button>
				</div>
			</div>
		);
	};
}

function mapStateToProps({ cmsPermission, cmsRole, loading }) {
	return {
		cmsPermission,
		permissionLoading: loading.models.cmsPermission,
		roleLoading: loading.models.cmsRole
	};
}

RoleForm.propTypes = {
	editRecord: PropTypes.object,
	closeForm: PropTypes.func.isRequired,
	dispatch: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(Form.create()(RoleForm));