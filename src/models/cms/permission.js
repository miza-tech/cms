import { GET, POST, PATCH, DELETE } from '../../services/http';
import { message } from 'antd';
import {formatListData} from '../../utils/utils';
let mDispatch;

export default {

	namespace: 'cmsPermission',

	state: {
		permissions: null,
		categories: null
	},

	subscriptions: {
		setup({ dispatch, history }) {
			mDispatch = dispatch;
		},
	},

	effects: {
		*query({ payload }, { call, put }) {
			const response = yield call(GET, 'cms/permissions');
			if (response.code !== 'SUCCESS') return;

			yield put({
				type: 'save',
				payload: {
					permissions:  formatListData(response.data)
				}
			});
		},
		*edit ({ payload }, {call, put}) {
			let response;
			if (payload.id) {
				response = yield call(PATCH, `cms/permissions/${payload.id}`, payload.params);
			} else {
				response = yield call(POST, 'cms/permissions', payload.params);
			}

			if (payload.cb) payload.cb(response);
			if (response.code !== 'SUCCESS') return;
			message.success('操作成功');
			mDispatch({
				type: 'query'
			});
		},
		*delete({ payload }, { call, put }) {
			const response = yield call(DELETE, `cms/permissions/${payload.id}`);
			if (response.code !== 'SUCCESS') return;
			message.success('删除成功');

			mDispatch({
				type: 'query'
			});
		},

		*queryCategories ({ payload }, {call, put}) {
			const response = yield call(GET, 'cms/permission/categories');
			if (response.code !== 'SUCCESS') return;

			yield put({
				type: 'save',
				payload: {
					categories:  formatListData(response.data)
				}
			});
		},
		*editCategory ({ payload }, {call, put}) {
			let response;
			if (payload.id) {
				response = yield call(PATCH, `cms/permission/categories/${payload.id}`, payload.params);
			} else {
				response = yield call(POST, 'cms/permission/categories', payload.params);
			}

			if (payload.cb) {
				payload.cb(response);
			}
			if (response.code !== 'SUCCESS') return;
			message.success('操作成功');
			mDispatch({
				type: 'queryCategories'
			});
		},
		*deleteCategory ({ payload }, {call, put}) {

			const response = yield call(DELETE, `cms/permission/categories/${payload.id}`);
			if (response.code !== 'SUCCESS') return;
			message.success('删除成功');
			mDispatch({
				type: 'queryCategories'
			});
		},
	},

	reducers: {
		save(state, action) {
			return { ...state, ...action.payload };
		},
	}
};
