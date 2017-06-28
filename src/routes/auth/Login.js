import React, { PropTypes } from 'react';
import { Button, Row, Form, Input, Icon, Checkbox, Layout } from 'antd';
import { connect } from 'dva';
import { GET, POST } from '../../services/http';
import { app } from '../../config';
import styles from './auth.less';

const { Header, Footer, Content } = Layout;
const FormItem = Form.Item;

class Login extends React.Component {

	constructor(props, context) {
		super(props, context);
		this.state = {
			loading: false,
		};
	}

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				this.setState({loading: true});
				const that = this;
				POST('auth/password', values)
				.then(function(response){
					that.setState({loading: false});

					if (!response || response.code != 'SUCCESS') return;

					that.props.dispatch({
						type: 'app/saveProfile',
						payload: {
							user: response.data
						}
					});

					that.context.router.replace('/dashboard');
				});
			}
		});
	};

	render() {

		const { getFieldDecorator } = this.props.form;

		return (
			<Layout className={styles.authWraper}>
				<Header className={styles.header}>
					<div className={styles.logo}></div>
					MIZA智能系统
				</Header>
				<Content className={styles.box}>
					<div className={styles.form}>
						<div className={styles.formHeader}>
							<span className={styles.formLogo}></span>
							<span>MIZA智能系统</span>
						</div>
						<form onSubmit={this.handleSubmit}>
							<FormItem hasFeedback>
								{getFieldDecorator('phone', {
									rules: [{required: true, message: '请填写用户名'}],
								})(
									<Input
										prefix={<Icon type="user"
										style={{ fontSize: 13 }} />} size="large" onPressEnter={this.handleSubmit} placeholder="用户名/手机号码" />)}
							</FormItem>
							<FormItem hasFeedback>
								{getFieldDecorator('password', {
									rules: [{required: true, message: '请填写密码'}],
								})(
									<Input
										prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
										size="large" type="password" onPressEnter={this.handleSubmit} placeholder="密码" />)}
							</FormItem>
							<FormItem>
								{getFieldDecorator('remember', {
									valuePropName: 'checked',
									initialValue: true,
								})(
									<Checkbox>记住密码</Checkbox>
								)}
								<a className={styles.forgot}>忘记密码</a>
								<Button className={styles.submit} type="primary" htmlType="submit" loading={this.state.loading}>登录</Button>
							</FormItem>
						</form>
					</div>
				</Content>
				<Footer className={styles.footer}>{app.footer}</Footer>
			</Layout>
		)
	}
}

Login.propTypes = {
	form: PropTypes.object,
	dispatch: PropTypes.func.isRequired
};

Login.contextTypes = {
	router: PropTypes.object
};

// export default Form.create()(Login);
export default connect()(Form.create()(Login));
