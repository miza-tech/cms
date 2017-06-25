import React, {PropTypes} from 'react';
import { connect } from 'dva';
import { Table, Checkbox } from 'antd';
import { formatPermissions, filterSelectedArray } from '../../utils/utils';
import styles from './styles.less';

class PermissionList extends React.Component {

	constructor(props, context) {
		super(props, context);
	}

	componentDidMount () {
		this.props.dispatch({
			type: 'setting/queryPermissions'
		});
	}

	render() {

		const checkedPermissions = this.props.checkedPermissions || [];
		const myPermissions = filterSelectedArray(this.props.setting.permissions, checkedPermissions);
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
									<Checkbox key={permission.key} checked={true} disabled={true}>
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

function mapStateToProps({ setting, loading }) {
	return { setting, loading: loading.models.setting };
}

PermissionList.propTypes = {
	checkedPermissions: PropTypes.array,
	dispatch: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(PermissionList);