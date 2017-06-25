import React from 'react';
import { connect } from 'dva';
import { Card, Avatar, Row, Col, Checkbox, Icon, Tooltip, Button } from 'antd';
import PermissionList from '../../components/PermissionList/';
import {getGender} from '../../utils/utils';

import styles from './profile.less';

class Info extends React.Component {

	constructor(props, context) {
		super(props, context);
		this.state = {
			// permissionLoading: true
		};
	}

	componentDidMount () {
		this.props.dispatch({
			type: 'setting/queryRoles'
		});
	}

	render() {
		const user = this.props.app.user;
		const roles = this.props.setting.roles || [];

		return (
			<div>
				<Card className={styles.card}>
					<div className={styles.infoBox}>
						<div className={styles.infoSider}>
							<Avatar size="large" icon="user" className={styles.avatar} />
						</div>
						<div className={styles.infoContent}>
							<h3 className={styles.title}>{ user.realname || user.phone }</h3>
							<Row type="flex" justify="start" className={styles.infoMeta}>
								<Col xs={24} sm={8} md={6}>手机号码: {user.phone}</Col>
								<Col xs={24} sm={8} md={6}>部门: {user.department_name}</Col>
								<Col xs={24} sm={8} md={6}>性别: {getGender(user.gender)}</Col>
								<Col xs={24} sm={8} md={6}>年龄: {user.age}</Col>
								<Col xs={24} sm={8} md={6}>身份证: {user.idCard}</Col>
							</Row>
							<div className={styles.userOperation}>
								<a><Icon type="edit" />更改资料</a>
								<a><Icon type="unlock" />更改密码</a>
							</div>
						</div>
					</div>
				</Card>
				<Card className={styles.card} title="用户权限" loading={false}>
					<h3 className={styles.sectionTitle}>
						用户角色
						<Tooltip title="您的角色" placement="right"><Icon type="question-circle-o" /></Tooltip>
					</h3>
					<div className={styles.userRoles}>
						{
							roles.map((item) => {
								return (
									<Checkbox key={item.key} checked={true} disabled={true}>
										{item.display_name}
									</Checkbox>
								)
							})
						}
					</div>
					<h3 className={styles.sectionTitle}>
						操作权限
						<Tooltip title="账号系统权限明细，如需变更权限，请联系系统管理员" placement="right"><Icon type="question-circle-o" /></Tooltip>
					</h3>
					<PermissionList checkedPermissions={user.permissions} />
				</Card>
			</div>
		);
	};
}

Info.propTypes = {
};

function mapStateToProps({ app, setting }) {
	return { app, setting };
}

export default connect(mapStateToProps)(Info);