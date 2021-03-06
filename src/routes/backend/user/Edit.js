import React, {PropTypes} from 'react';
import { connect } from 'dva';
import { Card, Form, Input, Radio, Row, Col, Button, Checkbox, Icon, TreeSelect, InputNumber } from 'antd';
import ResetBackendPasswordModal from '../../../components/ResetBackendPasswordModal/';
import { genErrorFields } from '../../../utils/utils';
const FormItem = Form.Item;

class UserEdit extends React.Component {

	constructor(props, context) {
		super(props, context);

		this.state = {
			editRecord: null,
			loading: true,
			resetPasswordModalVisible: false,
			resetPasswordModalRandom: null,
		};

		this.onSubmit = this.onSubmit.bind(this);
		this.submitCb = this.submitCb.bind(this);
		this.queryCb = this.queryCb.bind(this);
		this.closeForm = this.closeForm.bind(this);
		this.openResetPasswordModal = this.openResetPasswordModal.bind(this);
	}

	componentWillReceiveProps (newPros) {
	}

	componentDidMount () {
		const id = this.props.routeParams.id;
		if (!id) {
			this.setState({
				editRecord: {},
				loading: false
			});
		} else {
			this.props.dispatch({
				type: 'backendUser/info',
				payload: {
					id: id,
					cb: this.queryCb
				}
			});
		}
		this.props.dispatch({type: 'cmsDepartment/query'});
	}

	onSubmit () {
		const { validateFields, getFieldsValue } = this.props.form;
		validateFields((errors) => {
			if (errors) return;

			const editRecord = this.state.editRecord || {};

			this.props.dispatch({
				type: 'backend/editUser',
				payload: {
					id: editRecord.id,
					params: {
						...getFieldsValue()
					},
					cb: this.submitCb
				}
			});
		});
	}

	submitCb (response) {
		if (response.code != 'SUCCESS') {
			genErrorFields(this.props.form, response.errors);
		} else {
			this.context.router.push('/backend/users');
		}
	}

	queryCb (response) {
		console.error(response);
		if (response.code != 'SUCCESS') {
			this.context.router.push('/backend/users');
		} else {
			this.setState({
				editRecord: response.data,
				loading: false
			});
		}
	}

	closeForm () {
		this.context.router.push('/backend/users');
	}

	openResetPasswordModal () {
		this.setState({
			resetPasswordModalRandom: new Date().getTime(),
			resetPasswordModalVisible: true
		});
	}

	render() {
		const editRecord = this.state.editRecord || {};
		const administrator = editRecord.administrator || {};
		const getFieldDecorator= this.props.form.getFieldDecorator;
		const formItemLayout = {
			labelCol: {
				span: 7,
			},
			wrapperCol: {
				span: 17,
			}
		};
		const departmentsTreeSelectProps = {
			treeData: this.props.cmsDepartment.departments || [],
			treeDefaultExpandAll: false,
			showSearch: true,
			placeholder: '请选择部门'
		};

		return (
			<Card bodyStyle={{ padding: '16px 24px 32px 24px' }} className="formBox" loading={this.state.loading}>
				<Row className="page-header" type="flex" align="middle">
					<Col><h3 className="page-title">基本信息</h3></Col>
				</Row>
				<Form>
					<Row className="formSection">
						<Col xs={24} sm={24} lg={10} xl={8}>
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
					<h3 className="formSectionTitle">管理员账号</h3>
					<Row className="formSection">
						<Col xs={24} sm={24} lg={10} xl={8}>
							<FormItem label="账号状态:" {...formItemLayout}>
								{getFieldDecorator('super_status', {
									initialValue: administrator.status || 'nonactivated',
									rules: [{required: true}],
								})(
									<Radio.Group>
										<Radio value="nonactivated">未激活</Radio>
										<Radio value="activated">已激活</Radio>
										<Radio value="freeze">冻结账号</Radio>
									</Radio.Group>
								)}
							</FormItem>
							{
								editRecord.id &&
								<div>
									<FormItem label="管理员账号:" {...formItemLayout}>
										{getFieldDecorator('super_username', {
											initialValue: administrator.username
										})(<Input placeholder="请输入账号编码" disabled={!!editRecord.id} />)}
										<div className="formInputInfo">
											<a className="item" onClick={this.openResetPasswordModal}><Icon type="lock" />重置密码</a>
										</div>
									</FormItem>
								</div>
							}
							{
								!editRecord.id &&
								<div>
									<FormItem label="管理员账号:" hasFeedback {...formItemLayout}>
										{getFieldDecorator('super_username', {
											rules: [
												{
													required: true,
													message: '请输入管理员账号',
												},
											],
										})(<Input placeholder="输入管理员账号" />)}
									</FormItem>
									<FormItem label="初始化密码:" hasFeedback {...formItemLayout}>
										{getFieldDecorator('super_password', {
											// initialValue: editRecord.contact_phone,
											rules: [
												{
													required: !!editRecord.id,
													message: '请输入初始化密码',
												},
											],
										})(<Input placeholder="输入初始化密码" />)}
									</FormItem>
									<FormItem label="激活重置:" {...formItemLayout}>
										{getFieldDecorator('super_password_reset_needed', {
											valuePropName: 'checked',
											initialValue: true,
											// rules: [],
										})(<Checkbox>第一次登录或激活账号时，是否需要用户重置密码</Checkbox>)}
									</FormItem>
								</div>
							}
						</Col>
					</Row>
				</Form>
				<div className="formSectionSubmit">
					<Button type="primary" size="large" onClick={this.onSubmit} loading={this.props.loading}>提交</Button>
					<Button size="large" type="primary" ghost onClick={this.closeForm}>取消返回</Button>
				</div>
				{editRecord.id &&
					<ResetBackendPasswordModal editRecord={administrator} visible={this.state.resetPasswordModalVisible} modalRandom={this.state.resetPasswordModalRandom} />
				}
			</Card>
		);
	};
}

UserEdit.propTypes = {
};

UserEdit.contextTypes = {
	router: PropTypes.object
};

function mapStateToProps({ backendUser, cmsDepartment, loading }) {
	return { backendUser, cmsDepartment, loading: loading.models.backendUser };
}

export default connect(mapStateToProps)(Form.create()(UserEdit));