import React, {PropTypes} from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Checkbox } from 'antd';
import { genErrorFields } from '../../utils/utils';
const FormItem = Form.Item;

class ResetPasswordModal extends React.Component {

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

	componentWillReceiveProps(newProps) {
		if (newProps.modalRandom != this.state.modalRandom) {
			this.props.form.resetFields();
			this.props.form.setFields({
				password_r: {
					errors: null
				}
			});

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
			genErrorFields(this.props.form, response.errors);
		} else {
			this.setState({
				visible: false
			});
		}
	}

	onSubmit () {

		const { validateFieldsAndScroll, getFieldsValue, setFields } = this.props.form;
		validateFieldsAndScroll((errors) => {
			if (errors) return;

			const postData = getFieldsValue();
			const editRecord = this.state.editRecord || {};

			// check password
			if (postData.password != postData.password_r) {
				setFields({
					password_r: {
						errors: [new Error('密码不一致')]
					}
				});
				return;
			}

			this.props.dispatch({
				type: 'administrator/resetPassword',
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

		const modalProps = {
			title: '重置密码',
			onOk: this.onSubmit,
			onCancel: this.onCancel,
			visible: this.state.visible,
			maskClosable: false,
			confirmLoading: this.props.loading
		};

		return (
			<Modal {...modalProps}>
				<Form>
					<FormItem label="新密码:" hasFeedback {...formItemLayout}>
						{getFieldDecorator('password', {
							rules: [
								{
									required: true,
									message: '请输入新密码',
								},
							],
						})(<Input placeholder="请输入新密码" type="password" />)}
					</FormItem>

					<FormItem label="再输入密码:" hasFeedback {...formItemLayout}>
						{getFieldDecorator('password_r', {
							rules: [
								{
									required: true,
									message: '请再次输入新密码',
								},
							],
						})(<Input placeholder="请再次输入新密码" type="password" />)}
					</FormItem>
					<FormItem label="激活重置:" {...formItemLayout}>
						{getFieldDecorator('password_reset_needed', {
							initialValue: true,
							valuePropName: 'checked',
							// rules: [],
						})(<Checkbox>第一次登录或激活账号时，是否需要用户重置密码</Checkbox>)}
					</FormItem>
				</Form>
			</Modal>
		);
	};
}

ResetPasswordModal.propTypes = {
	editRecord: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
};

function mapStateToProps({ administrator, loading }) {
	return { administrator, loading: loading.models.administrator };
}

export default connect(mapStateToProps)(Form.create()(ResetPasswordModal));