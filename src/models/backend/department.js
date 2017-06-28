import { GET, POST, PATCH, DELETE } from '../../services/http';
import { message } from 'antd';
import {formatListData,genSearchParams} from '../../utils/utils';
let mDispatch;

export default {

	namespace: 'backendDepartment',

	state: {
		departments: null,
		queryParams: null
	},

	subscriptions: {
		setup({ dispatch, history }) {
			mDispatch = dispatch;
		},
	},

	effects: {
		*query({ payload }, { call, put }) {
			const queryParams = genSearchParams(payload.queryParams || {});
			const response = yield call(GET, `backend/departments?${queryParams}`);
			if (response.code !== 'SUCCESS') return;

			yield put({
				type: 'save',
				payload: {
					departments:  formatListData(response.data)
				}
			});
		},
		*edit ({ payload }, {call, put}) {
			let response;
			if (payload.id) {
				response = yield call(PATCH, `backend/departments/${payload.id}`, payload.params);
			} else {
				response = yield call(POST, 'backend/departments', payload.params);
			}

			if (payload.cb) payload.cb(response);
			if (response.code !== 'SUCCESS') return;
			message.success('操作成功');
			// mDispatch({
			// 	type: 'query'
			// });
		},
		*delete({ payload }, { call, put }) {
			const response = yield call(DELETE, `backend/departments/${payload.id}`);
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
