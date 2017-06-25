import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { Spin, Layout } from 'antd';
import Login from '../auth/Login';
import { MyMenu, MyHeader, MyBread} from './components';
import { app as config } from '../../config';
import styles from './app.less';

const { Sider, Content, Footer } = Layout;

function App({ children, location, dispatch, app, routes }) {

	// app model 获取state
	const { appInitialized, user, siderFold } = app;

	// 框架
	const menuProps = {
		siderFold,
		location
	};
	const headerProps = {
		siderFold,
		location,
		user,
		switchSider () {
			dispatch({ type: 'app/switchSider' })
		},
		logout () {
			dispatch({ type: 'app/logout' })
		}
	};
	const layoutComponent = (
		<Layout className="appLayout">
			<Sider
				trigger={null}
				collapsible
				breakpoint="lg"
				collapsedWidth="48"
				width="200"
				collapsed={siderFold}
				>
				<div className="header">
					<span className="logo"></span>
					<span className="label">Miza科技</span>
				</div>
				<MyMenu {...menuProps} />
			</Sider>
			<Layout>
				<MyHeader {...headerProps} />
				<Content>
					<MyBread location={location} routes={routes} />
					<div className="container">
						{children}
					</div>
				</Content>
				<Footer>{config.footer}</Footer>
			</Layout>
		</Layout>
	);

	// 页面初始化的loading
	const loadingComponent = (
		<div className={styles.pageInit}><Spin size="large" tip="数据初始化，请稍后..." /></div>
	)

	return (
		<div className="appWraper">
			{appInitialized ?  (user ? layoutComponent : <Login />) : loadingComponent}
		</div>
	)
}

App.propTypes = {
	children: PropTypes.element.isRequired,
	location: PropTypes.object,
	dispatch: PropTypes.func,
	app: PropTypes.object,
	setting: PropTypes.object,
};

function mapStateToProps({ app, setting }) {
	return { app, setting };
}

export default connect(mapStateToProps)(App);