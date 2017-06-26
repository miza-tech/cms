import React, {PropTypes} from 'react';
import { connect } from 'dva';
import { Button, Modal, Form, Input, TreeSelect,Tooltip, Icon, Alert, Row, Col } from 'antd';
import FormError from '../../../components/FormError';
const FormItem = Form.Item;

class CategoryModal extends React.Component {

	constructor(props, context) {
		super(props, context);

		this.state = {
			visible: this.props.visible,
			modalRandom: null,
			editRecord: null,
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
				type: 'setting/editCategory',
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
			title: editRecord.id ? '编辑菜单' : '新建菜单',
			onOk: this.onSubmit,
			onCancel: this.onCancel,
			visible: this.state.visible,
			maskClosable: false,
			confirmLoading: this.props.loading
		};

		return (
			<Modal {...modalProps}>
				{
					this.state.error &&
					<Row className="modalFormMsg"><Col xs={20} offset={2}><FormError error={this.state.error} /></Col></Row>
				}
				<Form>
					<FormItem label="类型名称:" hasFeedback {...formItemLayout}>
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
				</Form>
			</Modal>
		);
	};
}

function mapStateToProps({ setting, loading }) {
	return { setting, loading: loading.models.setting };
}

CategoryModal.propTypes = {
	modalRandom: PropTypes.number,
	visible: PropTypes.bool,
	editItem: PropTypes.object,
};

export default connect(mapStateToProps)(Form.create()(CategoryModal));