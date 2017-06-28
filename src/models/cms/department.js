import { GET, POST, PATCH, DELETE } from '../../services/http';
import { message } from 'antd';
import {formatListData} from '../../utils/utils';
let mDispatch;

export default {

	namespace: 'cmsDepartment',

	state: {
		departments: null,
	},

	subscriptions: {
		setup({ dispatch, history }) {
			mDispatch = dispatch;
		},
	},

	effects: {
		*query({ payload }, { call, put }) {
			const response = yield call(GET, 'cms/departments');
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
				response = yield call(PATCH, `cms/departments/${payload.id}`, payload.params);
			} else {
				response = yield call(POST, 'cms/departments', payload.params);
			}

			if (payload.cb) payload.cb(response);
			if (response.code !== 'SUCCESS') return;
			message.success('操作成功');
			mDispatch({
				type: 'query'
			});
		},
		*delete({ payload }, { call, put }) {
			const response = yield call(DELETE, `cms/departments/${payload.id}`);
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
