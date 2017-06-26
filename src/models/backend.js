import { GET, POST, PATCH, DELETE } from '../services/http';
import {formatListData, formatpPagination} from '../utils/utils';
import { message } from 'antd';
let mDispatch;

export default {

	namespace: 'backend',

	state: {
		accounts: null,
		accounts_pagination: false
	},

	subscriptions: {
		setup({ dispatch, history }) {
			mDispatch = dispatch;
		},
	},

	effects: {
		*queryBackendAccountInfo({ payload }, { call, put }) {
			const response = yield call(GET, `backend/accounts/${payload.id}`);
			if (payload.cb) {
				payload.cb(response);
			}
		},
		*queryBackendAccounts({ payload }, { call, put }) {
			payload = payload || {};
			const queryParams = payload.queryParams || '';
			const response = yield call(GET, `backend/accounts?${queryParams}`);
			if (response.code !== 'SUCCESS') return;

			yield put({
				type: 'save',
				payload: {
					accounts: formatListData(response.data.data),
					accounts_pagination: formatpPagination(response.data)
				}
			});
		},
		*editBackendAccount({ payload }, { call, put }) {
			let response;
			if (payload.id) {
				response = yield call(PATCH, `backend/accounts/${payload.id}`, payload.params);
			} else {
				response = yield call(POST, 'backend/accounts', payload.params);
			}

			if (payload.cb) {
				payload.cb(response);
			}
			if (response.code !== 'SUCCESS') return;
			message.success('操作成功');
		},
		*deleteBackendAccount({ payload }, { call, put }) {
			const response = yield call(DELETE, `backend/accounts/${payload.id}`);
			if (response.code !== 'SUCCESS') return;

			message.success('删除成功');

			mDispatch({
				type: 'queryBackendAccounts'
			});
		},
		// *resetPassword({ payload }, { call, put }) {
		// 	const response = yield call(POST, `backend/users/${payload.id}/passwordReset`, payload.params);

		// 	if (payload.cb) {
		// 		payload.cb(response);
		// 	}
		// 	if (response.code !== 'SUCCESS') return;
		// 	message.success('密码重置成功');
		// },
	},

	reducers: {
		save(state, action) {
			return { ...state, ...action.payload };
		},
	},

};
