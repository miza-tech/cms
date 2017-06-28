import React, {PropTypes} from 'react';
import { connect } from 'dva';
import { Button, Form, Input, Tooltip, Icon, Alert, Row, Col, Radio,TreeSelect, Checkbox, Spin, InputNumber } from 'antd';
import {getPermissionsByRole,formatKeysArray,genErrorFields} from '../../../utils/utils';
import ResetPasswordModal from '../../../components/ResetPasswordModal/';
import PermissionList from '../../../components/PermissionList/';
import styles from './User.less';

const FormItem = Form.Item;

class RoleForm extends React.Component {

	constructor(props, context) {
		super(props, context);
		const checkedRoles = this.props.editRecord ? this.props.editRecord.roles : [];

		this.state = {
			error: null,
			checkedPermissions: getPermissionsByRole(this.props.cmsRole.roles || [], checkedRoles),
			checkedRoles: formatKeysArray(checkedRoles),
			resetPasswordModalVisible: false,
			resetPasswordModalRandom: null,
		};

		this.onSubmit = this.onSubmit.bind(this);
		this.submitCb = this.submitCb.bind(this);
		this.onSelectRoleChange = this.onSelectRoleChange.bind(this);
		this.openResetPasswordModal = this.openResetPasswordModal.bind(this);
	}

	componentDidMount () {
		this.props.dispatch({
			type: 'cmsDepartment/query'
		});
		this.props.dispatch({
			type: 'cmsRole/query'
		});
	}

	componentWillReceiveProps (newProps, preProps) {
		if (newProps.cmsRole.roles && !this.props.cmsRole.roles) {
			this.setState({
				checkedPermissions: getPermissionsByRole(newProps.cmsRole.roles, this.state.checkedRoles)
			});
		}
	}

	submitCb (response) {
		if (response.code != 'SUCCESS') {
			genErrorFields(this.props.form, response.errors);
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
				type: 'administrator/editUser',
				payload: {
					id: editRecord.id,
					params: {
						...getFieldsValue(),
						roles: this.state.checkedRoles
					},
					cb: this.submitCb
				}
			});
		});
	}

	openResetPasswordModal () {
		this.setState({
			resetPasswordModalRandom: new Date().getTime(),
			resetPasswordModalVisible: true
		});
	}

	onSelectRoleChange (checkedRoles) {
		this.setState({
			checkedRoles: checkedRoles,
			checkedPermissions: getPermissionsByRole(this.props.setting.roles, checkedRoles)
		});
	}

	render() {

		const {getFieldDecorator} = this.props.form;
		const editRecord = this.props.editRecord || {};
		const formItemLayout = {
			labelCol: {
				xs: 6,
				sm: 4,
				md: 3,
				lg: 2,
				xl: 2
			},
			wrapperCol: {
				xs: 16,
				sm: 10,
				md: 9,
				lg: 8,
				xl: 8
			}
		};
		const departmentsTreeSelectProps = {
			treeData: this.props.cmsDepartment.departments || [],
			treeDefaultExpandAll: false,
			showSearch: true,
			placeholder: '请选择部门'
		};
		const checkedPermissions = this.state.checkedPermissions;
		const checkedRoles = this.state.checkedRoles;

		return (
			<div>
				<Row className="page-header" type="flex" align="middle">
					<Col xs={12}><h3 className="page-title">{ editRecord.id ? '编辑用户' : '添加新用户' }</h3></Col>
					<Col xs={12} className="align-right"><Button type="primary" ghost onClick={this.props.closeForm}>取消返回</Button></Col>
				</Row>

				<Form>
					<Row className="formSection">
						<Col xs={24}>
							<FormItem label="账号状态:" {...formItemLayout}>
								{getFieldDecorator('status', {
									initialValue: editRecord.status || 'nonactivated',
									rules: [],
								})(
									<Radio.Group>
										<Radio value="nonactivated">未激活</Radio>
										<Radio value="activated">已激活</Radio>
										<Radio value="freeze">冻结账号</Radio>
									</Radio.Group>
								)}
							</FormItem>
							<FormItem label="手机号码:" hasFeedback {...formItemLayout}>
								{getFieldDecorator('phone', {
									initialValue: editRecord.phone,
									rules: [
										{
											required: true,
											message: '输入手机号码',
										},
									],
								})(<Input placeholder="输入手机号码" />)}
								{
									editRecord.id &&
									<div className="formInputInfo">
										<a className="item" onClick={this.openResetPasswordModal}><Icon type="lock" />重置密码</a>
									</div>
								}
							</FormItem>
							<FormItem label="姓名:" hasFeedback {...formItemLayout}>
								{getFieldDecorator('realname', {
									initialValue: editRecord.realname,
									rules: [
										{
											required: true,
											message: '输入姓名',
										},
									],
								})(<Input placeholder="输入姓名" />)}
							</FormItem>
							<FormItem label="身份证号:" hasFeedback {...formItemLayout}>
								{getFieldDecorator('idCard', {
									initialValue: editRecord.idCard,
									rules: [],
								})(<Input placeholder="输入身份证号码" />)}
							</FormItem>
							<FormItem label="部门" hasFeedback {...formItemLayout}>
								{getFieldDecorator('department_id', {
									initialValue: !editRecord.department_id ? undefined : editRecord.department_id + "",
									rules: [
										{
											required: true,
											message: '请选择部门'
										}
									],
								})(<TreeSelect {...departmentsTreeSelectProps} />)}
							</FormItem>
							<FormItem label="年龄:" hasFeedback {...formItemLayout}>
								{getFieldDecorator('age', {
									valuePropName: 'autocomplete="off"',
									initialValue: editRecord.age,
									rules: [],
								})(<InputNumber placeholder="输入年龄" />)}
							</FormItem>
							<FormItem label="性别:" {...formItemLayout}>
								{getFieldDecorator('gender', {
									initialValue: editRecord.gender,
									rules: [],
								})(
									<Radio.Group>
										<Radio value="male">男生</Radio>
										<Radio value="female">女生</Radio>
									</Radio.Group>
								)}
							</FormItem>
						</Col>
					</Row>

					{
						!editRecord.id &&
						<div>
							<h3 className="formSectionTitle">初始化密码设置</h3>
							<Row className="formSection">
								<Col xs={24}>
									<FormItem label="初始化密码:" hasFeedback {...formItemLayout}>
										{getFieldDecorator('password', {
											initialValue: null,
											rules: [
												{
													required: true,
													message: '请输入初始化密码'
												}
											],
										})(<Input placeholder="输入初始化登录密码" type="password" />)}
									</FormItem>
									<FormItem label="激活重置:" {...formItemLayout}>
										{getFieldDecorator('password_reset_needed', {
											initialValue: true,
											// rules: [],
										})(<Checkbox>第一次登录或激活账号时，是否需要用户重置密码</Checkbox>)}
									</FormItem>
								</Col>
							</Row>
						</div>
					}
				</Form>
				<h3 className="formSectionTitle">
					用户权限设置
					<Tooltip title="权限与角色关联，选择该账号的角色可完成权限设置">
						<Icon type="question-circle-o" />
					</Tooltip>
				</h3>
				<Row className="formSection">
					<Col className={styles.roles}>
						{ this.props.roleLoading && <Spin /> }
						{ (!this.props.roleLoading && this.props.cmsRole.roles) &&
							<Checkbox.Group options={this.props.cmsRole.roles} defaultValue={checkedRoles} onChange={this.onSelectRoleChange} />
						}
					</Col>
				</Row>
				<h3 className="formSectionTitle">
					权限明细
					<Tooltip title="权限与角色关联，选择该账号的角色可完成权限设置">
						<Icon type="question-circle-o" />
					</Tooltip>
				</h3>
				<PermissionList checkedPermissions={this.state.checkedPermissions} showAll editAble />

				<div className="formSectionSubmit">
					<Button type="primary" size="large" onClick={this.onSubmit} loading={this.props.loading}>提交</Button>
					<Button size="large" type="primary" ghost onClick={this.props.closeForm}>取消返回</Button>
				</div>
				{editRecord.id &&
					<ResetPasswordModal editRecord={this.props.editRecord} visible={this.state.resetPasswordModalVisible} modalRandom={this.state.resetPasswordModalRandom} />
				}
			</div>
		);
	};
}

function mapStateToProps({ cmsRole, cmsUser, cmsDepartment, loading }) {
	return { cmsRole, cmsUser, cmsDepartment, loading: loading.models.cmsUser, roleLoading: loading.models.cmsRole };
}

RoleForm.propTypes = {
	editRecord: PropTypes.object,
	closeForm: PropTypes.func.isRequired,
	dispatch: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(Form.create()(RoleForm));