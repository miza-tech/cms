import { GET, POST, PATCH, DELETE } from '../services/http';
import {formListData} from '../utils/utils';
import { message } from 'antd';

let mDispatch;

export default {

	namespace: 'setting',

	// app 全局数据
	state: {
		menus: null,
		roles: null,
		permissions: null,
		categories: null
	},

	subscriptions: {
		setup({ dispatch, history }) {
			mDispatch = dispatch;
		},
	},

	effects: {

		*saveItem ({ payload }, {call, put}) {
			yield put({
				type: 'save',
				payload: payload
			});
		},

		*queryRoles ({ payload }, {call, put}) {

			const response = yield call(GET, 'cms/roles');
			if (response.code !== 'SUCCESS') return;

			yield put({
				type: 'saveRoles',
				payload: {
					roles: formListData(response.data)
				}
			});
		},
		*editRole ({ payload }, {call, put}) {
			let response;
			if (payload.id) {
				response = yield call(PATCH, 'cms/roles/' + payload.id, payload.params);
			} else {
				response = yield call(POST, 'cms/roles', payload.params);
			}

			if (payload.cb) {
				payload.cb(response);
			}
			if (response.code !== 'SUCCESS') return;
			message.success('操作成功');
			mDispatch({
				type: 'queryRoles'
			});
		},
		*deleteRole ({ payload }, {call, put}) {
			const response = yield call(DELETE, 'cms/roles/' + payload.id);
			if (response.code !== 'SUCCESS') return;

			message.success('删除成功');

			mDispatch({
				type: 'queryRoles'
			});
		},

		*queryPermissions ({ payload }, {call, put}) {

			const response = yield call(GET, 'cms/permissions');
			if (response.code !== 'SUCCESS') return;

			yield put({
				type: 'savePrmissions',
				payload: {
					permissions: formListData(response.data)
				}
			});
		},
		*editPermission ({ payload }, {call, put}) {
			let response;
			if (payload.id) {
				response = yield call(PATCH, 'cms/permissions/' + payload.id, payload.params);
			} else {
				response = yield call(POST, 'cms/permissions', payload.params);
			}

			if (payload.cb) {
				payload.cb(response);
			}
			if (response.code !== 'SUCCESS') return;
			message.success('操作成功');
			mDispatch({
				type: 'queryPermissions'
			});
		},
		*deletePermission ({ payload }, {call, put}) {

			const response = yield call(DELETE, 'cms/permissions/' + payload.id);
			if (response.code !== 'SUCCESS') return;
			message.success('删除成功');
			mDispatch({
				type: 'queryPermissions'
			});
		},

		*queryMenus ({ payload }, {call, put}) {

			const response = yield call(GET, 'cms/menus');
			if (response.code !== 'SUCCESS') return;

			yield put({
				type: 'saveMenus',
				payload: {
					menus:  formListData(response.data)
				}
			});
		},

		*editMenu ({ payload }, {call, put}) {

			let response;
			if (payload.id) {
				response = yield call(PATCH, 'cms/menus/' + payload.id, payload.params);
			} else {
				response = yield call(POST, 'cms/menus', payload.params);
			}

			if (payload.cb) {
				payload.cb(response);
			}
			if (response.code !== 'SUCCESS') return;
			message.success('操作成功');
			mDispatch({
				type: 'queryMenus'
			});
		},

		*deleteMenu ({ payload }, {call, put}) {

			const response = yield call(DELETE, 'cms/menus/' + payload.id);
			if (response.code !== 'SUCCESS') return;

			mDispatch({
				type: 'queryMenus'
			});
		},

		*queryCategories ({ payload }, {call, put}) {

			const response = yield call(GET, 'cms/permission/categories');
			if (response.code !== 'SUCCESS') return;

			yield put({
				type: 'saveCategories',
				payload: {
					categories:  formListData(response.data)
				}
			});
		},

		*editCategory ({ payload }, {call, put}) {

			let response;
			if (payload.id) {
				response = yield call(PATCH, 'cms/permission/categories/' + payload.id, payload.params);
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

			const response = yield call(DELETE, 'cms/permission/categories/' + payload.id);
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

		saveRoles(state, action) {
			return {
				...state,
				roles: action.payload.roles
			};
		},

		savePrmissions(state, action) {
			return {
				...state,
				permissions: action.payload.permissions
			};
		},

		saveMenus(state, action) {
			return {
				...state,
				menus: action.payload.menus
			};
		},

		saveCategories(state, action) {
			return {
				...state,
				categories: action.payload.categories
			};
		},
	},

};
