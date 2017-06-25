import React, {PropTypes} from 'react';
import { connect } from 'dva';
import { Table, Checkbox } from 'antd';
import { formatPermissions } from '../../../utils/utils';
import styles from './PermissionSection.less';

class PermissionSection extends React.Component {

	constructor(props, context) {
		super(props, context);

		this.state = {
			checkedPermissions: this.props.checkedPermissions || []
		};

		this.onPermissionChanged = this.onPermissionChanged.bind(this);
	}

	componentDidMount () {
		this.props.dispatch({
			type: 'setting/queryPermissions'
		});
	}

	onPermissionChanged (checked, permission) {
		let checkedPermissions = this.state.checkedPermissions;
		const index = checkedPermissions.indexOf(permission.id);

		if (checked && index == -1) {
			checkedPermissions.push(permission.id);
		}
		if (!checked && index > -1) {
			checkedPermissions.splice(index, 1);
		}

		this.setState({
			checkedPermissions: checkedPermissions
		});
		if (this.props.onChange) {
			this.props.onChange(checkedPermissions);
		}
	}

	render() {

		const permissions = formatPermissions(this.props.setting.permissions);
		const checkedPermissions = this.props.checkedPermissions || [];
		const columns = [
			{
				title: '分类',
				key: 'category_name',
				dataIndex: 'category_name',
				width: 120,
				className: 'category'
			}, {
				title: '权限',
				className: 'permissions',
				render: (text, record) => {
					return (<div>
						{
							record.permissions.map((permission) => {
								if (this.props.editAble) {
									return (
										<Checkbox key={permission.key} onChange={e => this.onPermissionChanged(e.target.checked, permission)} checked={checkedPermissions.indexOf(permission.id) > -1}>
											{permission.display_name}
										</Checkbox>
									);
								} else if (checkedPermissions.indexOf(permission.id) > -1){
									return (
										<Checkbox key={permission.key} onChange={e => this.onPermissionChanged(e.target.checked, permission)} checked={true} disabled={true}>
											{permission.display_name}
										</Checkbox>
									);
								}

							})
						}
					</div>);
				}
			}
		];

		return (
			<Table showHeader={false} className="PermissionSection" columns={columns} dataSource={permissions} bordered loading={this.props.loading} pagination={false} />
		);
	};
}

function mapStateToProps({ setting, loading }) {
	return { setting, loading: loading.models.setting };
}

PermissionSection.propTypes = {
	onChange: PropTypes.func,
	checkedPermissions: PropTypes.array,
	dispatch: PropTypes.func.isRequired,
	editAble: PropTypes.bool
};

export default connect(mapStateToProps)(PermissionSection);