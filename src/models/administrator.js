import { GET, POST, PATCH, DELETE } from '../services/http';
import {formListData} from '../utils/utils';
import { message } from 'antd';

export default {

	namespace: 'administrator',

	state: {
		users: [],
		departments: []
	},

	subscriptions: {
		setup({ dispatch, history }) {
		},
	},

	effects: {
		*queryUsers({ payload }, { call, put }) {
			const response = yield call(GET, 'cms/users');
			if (response.code !== 'SUCCESS') return;

			yield put({
				type: 'save',
				payload: {
					users: formListData(response.data)
				}
			});
		},
		*queryDepartments({ payload }, { call, put }) {
			const response = yield call(GET, 'cms/departments');
			if (response.code !== 'SUCCESS') return;

			yield put({
				type: 'save',
				payload: {
					departments: formListData(response.data)
				}
			});
		},
	},

	reducers: {
		save(state, action) {
			return { ...state, ...action.payload };
		}
	},

};
