import { GET, POST } from '../services/http';

export default {

	namespace: 'app',

	// app 全局数据
	state: {
		// 页面是否初始化数据，获取用户个人数据
		appInitialized: false,
		// 侧边栏状态，存储在本地
		siderFold: localStorage.getItem('sidebar_fold') === 'true',
		// auth user
		user: null,
	},

	subscriptions: {
		setup({ dispatch, history }) {
			dispatch({ type: 'queryAppInfo' });
			// history.listen(({ pathname }) => {
			// 	console.error(pathname);
			// })
		},
	},

	effects: {

		*switchSider ({ payload }, {put}) {
			yield put({ type: 'switchSiderHandle' });
		},

		*logout ({ payload }, {call, put}) {
			const response = yield call(POST, 'auth/logout');
			if (!response || response.code !== 'SUCCESS') return;

			yield put({
				type: 'saveProfile',
				payload: {
					user: null
				}
			});
		},

		*queryAppInfo ({ payload }, {call, put}) {
			const response = yield call(GET, 'config');
			if (!response || response.code !== 'SUCCESS') return;
			yield put({
				type: 'initApp',
				payload: {
					user: response.data.user
				}
			});
		},

		*queryProfile ({ payload }, {call, put}) {
			const response = yield call(GET, 'config');
			if (response.code !== 'SUCCESS') return;
			yield put({
				type: 'saveProfile',
				payload: {
					user: response.data.user
				}
			});
		}
	},

	reducers: {
		save(state, action) {
			return { ...state, ...action.payload };
		},

		initApp(state, action) {
			return {
				...state,
				appInitialized: true,
				user: action.payload.user
			};
		},

		saveProfile(state, action) {
			return {
				...state,
				user: action.payload.user
			};
		},

		saveRoles(state, action) {
			return {
				...state,
				roles: action.payload.roles
			};
		},

		savepPrmissions(state, action) {
			return {
				...state,
				permissions: action.payload.permissions
			};
		},

		switchSiderHandle (state) {
			localStorage.setItem('sidebar_fold', !state.siderFold);
			return {
				...state,
				siderFold: !state.siderFold
			};
		}
	},

};
