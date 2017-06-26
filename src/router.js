import React from 'react';
import { Router, Route } from 'dva/router';
import App from './routes/app/Index';
import Index from './routes/dashboard/Index';
import { menu } from './config';

function RouterConfig({ history }) {

	const routes = [
		{
			path: '/',
			component: App,
			getIndexRoute (nextState, cb) {
				require.ensure([], require => {
					cb(null, { component: require('./routes/dashboard/Index') })
				}, 'dashboard')
			},
			childRoutes: [
				{
					path: '/dashboard',
					getComponent (nextState, cb) {
						require.ensure([], require => {
							cb(null, require('./routes/dashboard/Index'))
						})
					}
				}, {
					path: '/profile',
					getComponent (nextState, cb) {
						require.ensure([], require => {
							cb(null, require('./routes/profile/Info'))
						})
					}
				}, {
					path: '/setting/system(/:section)',
					getComponent (nextState, cb) {
						require.ensure([], require => {
							cb(null, require('./routes/settings/System'))
						})
					}
				}, {
					path: '/setting/administrator(/:section)',
					getComponent (nextState, cb) {
						require.ensure([], require => {
							cb(null, require('./routes/settings/Administrator'))
						})
					}
				},

				{
					path: '/backend/account/list',
					getComponent (nextState, cb) {
						require.ensure([], require => {
							cb(null, require('./routes/backendSettings/AccountList'))
						})
					}
				},
				{
					path: '/backend/account/new',
					getComponent (nextState, cb) {
						require.ensure([], require => {
							cb(null, require('./routes/backendSettings/AccountEdit'))
						})
					}
				},
				{
					path: '/backend/account/:id/edit',
					getComponent (nextState, cb) {
						require.ensure([], require => {
							cb(null, require('./routes/backendSettings/AccountEdit'))
						})
					}
				},
				{
					path: '/backend/users',
					getComponent (nextState, cb) {
						require.ensure([], require => {
							cb(null, require('./routes/backendSettings/UserList'))
						})
					}
				},
				{
					path: '/backend/users/:id/edit',
					getComponent (nextState, cb) {
						require.ensure([], require => {
							cb(null, require('./routes/backendSettings/UserEdit'))
						})
					}
				},
				{
					path: '/backend/users/new',
					getComponent (nextState, cb) {
						require.ensure([], require => {
							cb(null, require('./routes/backendSettings/UserEdit'))
						})
					}
				}
				, {
					path: '/backend/setting/administrator(/:section)',
					getComponent (nextState, cb) {
						require.ensure([], require => {
							cb(null, require('./routes/backendSettings/Administrator'))
						})
					}
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