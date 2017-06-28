import { GET, POST, PATCH, DELETE } from '../../services/http';
import { message } from 'antd';
import {formatListData,formatpPagination,genSearchParams} from '../../utils/utils';
let mDispatch;

export default {

	namespace: 'backendAccount',

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
		*info({ payload }, {call, put }) {
			const response = yield call(GET, `backend/accounts/${payload.id}`);
			if (payload.cb) payload.cb(response);
		},
		*query({ payload = {} }, { call, put }) {
			const queryParams = genSearchParams(payload.queryParams || {});
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
		*edit ({ payload }, {call, put}) {
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
		*resetPassword({ payload }, { call, put }) {
			const response = yield call(POST, `backend/users/${payload.id}/passwordReset`, payload.params);

			if (payload.cb) payload.cb(response);
			if (response.code !== 'SUCCESS') return;
			message.success('密码重置成功');
		},
		*delete({ payload }, { call, put }) {
			const response = yield call(DELETE, `backend/accounts/${payload.id}`);
			if (response.code !== 'SUCCESS') return;

			message.success('删除成功');

			mDispatch({
				type: 'query'
			});
		}
	},

	reducers: {
		save(state, action) {
			return { ...state, ...action.payload };
		},
	}
};