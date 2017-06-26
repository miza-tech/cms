import { GET, POST, PATCH, DELETE } from '../services/http';
import {formatListData, formatpPagination} from '../utils/utils';
import { message } from 'antd';
let mDispatch;

export default {

	namespace: 'administrator',

	state: {
		users: null,
		users_pagination: false,
		departments: null
	},

	subscriptions: {
		setup({ dispatch, history }) {
			mDispatch = dispatch;
		},
	},

	effects: {
		*queryUsers({ payload={} }, { call, put }) {
			const queryParams = payload.queryParams || '';
			const response = yield call(GET, `cms/users?${queryParams}`);
			if (response.code !== 'SUCCESS') return;

			yield put({
				type: 'save',
				payload: {
					users: formatListData(response.data.data),
					users_pagination: formatpPagination(response.data)
				}
			});
		},
		*editUser({ payload }, { call, put }) {
			let response;
			if (payload.id) {
				response = yield call(PATCH, `cms/users/${payload.id}`, payload.params);
			} else {
				response = yield call(POST, 'cms/users', payload.params);
			}

			if (payload.cb) {
				payload.cb(response);
			}
			if (response.code !== 'SUCCESS') return;
			message.success('操作成功');
			// mDispatch({
			// 	type: 'queryUsers'
			// });
		},
		*deleteUser({ payload }, { call, put }) {
			const response = yield call(DELETE, `cms/users/${payload.id}`);
			if (response.code !== 'SUCCESS') return;

			message.success('删除成功');

			mDispatch({
				type: 'queryUsers'
			});
		},
		*resetPassword({ payload }, { call, put }) {
			const response = yield call(POST, `cms/users/${payload.id}/passwordReset`, payload.params);

			if (payload.cb) {
				payload.cb(response);
			}
			if (response.code !== 'SUCCESS') return;
			message.success('密码重置成功');
		},
		*queryDepartments({ payload }, { call, put }) {
			const response = yield call(GET, 'cms/departments');
			if (response.code !== 'SUCCESS') return;

			yield put({
				type: 'save',
				payload: {
					departments: formatListData(response.data)
				}
			});
		},
		*editDepartment({ payload }, { call, put }) {
			let response;
			if (payload.id) {
				response = yield call(PATCH, 'cms/departments/' + payload.id, payload.params);
			} else {
				response = yield call(POST, 'cms/departments', payload.params);
			}

			if (payload.cb) {
				payload.cb(response);
			}
			if (response.code !== 'SUCCESS') return;
			message.success('操作成功');
			mDispatch({
				type: 'queryDepartments'
			});
		},
		*deleteDepartment({ payload }, { call, put }) {
			const response = yield call(DELETE, 'cms/departments/' + payload.id);
			if (response.code !== 'SUCCESS') return;

			message.success('删除成功');

			mDispatch({
				type: 'queryDepartments'
			});
		},
	},

	reducers: {
		save(state, action) {
			return { ...state, ...action.payload };
		}
	},

};
