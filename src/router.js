import React from 'react';
import { Router, Route } from 'dva/router';
import App from './routes/app/Index';

function RouterConfig({ history }) {

	const routes = [
		{
			path: '/',
			component: App,
			getIndexRoute (nextState, cb) {
				require.ensure([], require => {
					cb(null, { component: require('./routes/cms/dashboard/Index') })
				}, 'dashboard')
			},
			childRoutes: [
				{
					path: 'dashboard',
					getComponent (nextState, cb) {
						require.ensure([], require => {
							cb(null, require('./routes/cms/dashboard/Index'))
						})
					},
				},
				{
					path: 'backend/accounts',
					getComponent (nextState, cb) {
						require.ensure([], require => {
							cb(null, require('./routes/backend/account/List'))
						})
					}
				},
				{
					path: 'backend/account/new',
					getComponent (nextState, cb) {
						require.ensure([], require => {
							cb(null, require('./routes/backend/account/Edit'))
						})
					}
				},
				{
					path: 'backend/account/:accountId',
					getComponent (nextState, cb) {
						require.ensure([], require => {
							cb(null, require('./routes/backend/account/Info'))
						})
					},
					indexRoute: { onEnter: (nextState, replace) => {
						console.error(nextState);
						return replace(`/backend/account/${nextState.params.accountId}/edit`);
					} },
					childRoutes: [
						{
							path: 'edit',
							getComponent (nextState, cb) {
								require.ensure([], require => {
									cb(null, require('./routes/backend/account/Edit'))
								})
							}
						},
						{
							path: 'departments',
							getComponent (nextState, cb) {
								require.ensure([], require => {
									cb(null, require('./routes/backend/department/List'))
								})
							}
						},
						// {
						// 	path: 'departmen/new',
						// 	getComponent (nextState, cb) {
						// 		require.ensure([], require => {
						// 			cb(null, require('./routes/backend/department/Edit'))
						// 		})
						// 	}
						// },
						// {
						// 	path: 'departmen/:id/edit',
						// 	getComponent (nextState, cb) {
						// 		require.ensure([], require => {
						// 			cb(null, require('./routes/backend/department/Edit'))
						// 		})
						// 	}
						// },
						{
							path: 'roles',
							getComponent (nextState, cb) {
								require.ensure([], require => {
									cb(null, require('./routes/backend/role/List'))
								})
							}
						},
						// {
						// 	path: 'role/new',
						// 	getComponent (nextState, cb) {
						// 		require.ensure([], require => {
						// 			cb(null, require('./routes/backend/role/Edit'))
						// 		})
						// 	}
						// },
						// {
						// 	path: 'role/:id/edit',
						// 	getComponent (nextState, cb) {
						// 		require.ensure([], require => {
						// 			cb(null, require('./routes/backend/role/Edit'))
						// 		})
						// 	}
						// },
					]
				},
				{
					path: 'backend/users',
					getComponent (nextState, cb) {
						require.ensure([], require => {
							cb(null, require('./routes/backend/user/List'))
						})
					}
				},
				{
					path: 'backend/user/:id/edit',
					getComponent (nextState, cb) {
						require.ensure([], require => {
							cb(null, require('./routes/backend/user/Edit'))
						})
					}
				},
				{
					path: 'backend/user/new',
					getComponent (nextState, cb) {
						require.ensure([], require => {
							cb(null, require('./routes/backend/user/Edit'))
						})
					}
				},
				{
					path: 'backend/system',
					getComponent (nextState, cb) {
						require.ensure([], require => {
							cb(null, require('./routes/backend/settings/System'))
						})
					},
					indexRoute: { onEnter: (nextState, replace) => replace('/backend/system/menus') },
					childRoutes: [
						{
							path: 'menus',
							getComponent (nextState, cb) {
								require.ensure([], require => {
									cb(null, require('./routes/backend/menu/List'))
								});
							}
						},
						{
							path: 'permissions',
							getComponent (nextState, cb) {
								require.ensure([], require => {
									cb(null, require('./routes/backend/permission/List'))
								});
							}
						},
						{
							path: 'permission/categorys',
							getComponent (nextState, cb) {
								require.ensure([], require => {
									cb(null, require('./routes/backend/permission/CategoryList'))
								});
							}
						}
					]
				},
				{
					path: 'profile',
					getComponent (nextState, cb) {
						require.ensure([], require => {
							cb(null, require('./routes/cms/profile/Info'))
						})
					}
				},
				{
					path: 'cms/users',
					getComponent (nextState, cb) {
						require.ensure([], require => {
							cb(null, require('./routes/cms/user/List'))
						})
					}
				},
				{
					path: 'cms/system',
					getComponent (nextState, cb) {
						require.ensure([], require => {
							cb(null, require('./routes/cms/settings/System'))
						})
					},
					indexRoute: { onEnter: (nextState, replace) => replace('/cms/system/menus') },
					childRoutes: [
						{
							path: 'menus',
							getComponent (nextState, cb) {
								require.ensure([], require => {
									cb(null, require('./routes/cms/menu/List'))
								});
							}
						},
						{
							path: 'permissions',
							getComponent (nextState, cb) {
								require.ensure([], require => {
									cb(null, require('./routes/cms/permission/List'))
								});
							}
						},
						{
							path: 'permission/categorys',
							getComponent (nextState, cb) {
								require.ensure([], require => {
									cb(null, require('./routes/cms/permission/CategoryList'))
								});
							}
						}
					]
				},
				{
					path: 'cms/administrator',
					getComponent (nextState, cb) {
						require.ensure([], require => {
							cb(null, require('./routes/cms/settings/Administrator'))
						})
					},
					indexRoute: { onEnter: (nextState, replace) => replace('/cms/administrator/departments') },
					childRoutes: [
						{
							path: 'departments',
							getComponent (nextState, cb) {
								require.ensure([], require => {
									cb(null, require('./routes/cms/department/List'))
								});
							}
						},
						{
							path: 'roles',
							getComponent (nextState, cb) {
								require.ensure([], require => {
									cb(null, require('./routes/cms/role/List'))
								});
							}
						}
					]
				},
			]
		},
		{
			path: '/auth/login',
			getComponent (nextState, cb) {
				require.ensure([], require => {
					cb(null, require('./routes/auth/Login'))
				})
			}
		},
		{
			path: '/*',
			getComponent (nextState, cb) {
				require.ensure([], require => {
					cb(null, require('./routes/status/S404'))
				})
			}
		}
	];

	return <Router history={history} routes={routes}></Router>;
}

export default RouterConfig;