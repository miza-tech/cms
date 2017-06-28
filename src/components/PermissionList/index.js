import React, {PropTypes} from 'react';
import { connect } from 'dva';
import { Table, Checkbox } from 'antd';
import { formatPermissions, filterSelectedArray } from '../../utils/utils';
import styles from './styles.less';

class PermissionList extends React.Component {

	constructor(props, context) {
		super(props, context);
		this.state = {
			checkedPermissions: this.props.checkedPermissions || []
		};
		this.onPermissionChanged = this.onPermissionChanged.bind(this);
	}

	componentDidMount () {
		this.props.dispatch({
			type: 'cmsPermission/query'
		});
	}
	componentWillReceiveProps (newProps) {
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
		const checkedPermissions = this.state.checkedPermissions || [];
		const showAll = this.props.showAll;
		const editAble = !!this.props.editAble;

		let myPermissions;
		if (showAll || editAble) {
			myPermissions = this.props.cmsPermission.permissions;
		} else {
			myPermissions = filterSelectedArray(this.props.cmsPermission.permissions, checkedPermissions);
		}
		const permissions = formatPermissions(myPermissions);

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
								return (
									<Checkbox
										key={permission.key}
										onChange={e => this.onPermissionChanged(e.target.checked, permission)}
										checked={checkedPermissions.indexOf(permission.id) > -1}
										disabled={!editAble}>
										{permission.display_name}
									</Checkbox>
								);
							})
						}
					</div>);
				}
			}
		];

		return (
			<Table className="PermissionList" columns={columns} dataSource={permissions} bordered loading={this.props.loading} pagination={false} />
		);
	};
}

function mapStateToProps({ cmsPermission, loading }) {
	return { cmsPermission, loading: loading.models.cmsPermission };
}

PermissionList.propTypes = {
	checkedPermissions: PropTypes.array,
	showAll: PropTypes.bool,
	editAble: PropTypes.bool,
	dispatch: PropTypes.func.isRequired,
	onChange: PropTypes.func,
};

export default connect(mapStateToProps)(PermissionList);