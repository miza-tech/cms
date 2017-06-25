import dva from 'dva';
import { browserHistory } from 'dva/router';
import { message } from 'antd';
import createLoading from 'dva-loading';

// 具体配置见 https://github.com/dvajs/dva/blob/master/docs/API_zh-CN.md#appusehooks
// 1. Initialize
const app = dva({
	// router
	history: browserHistory,
	// 指定初始数据，优先级高于 model 中的 state，默认是 {}
	initialState: {},
	// effect 执行错误或 subscription 通过 done 主动抛错时触发，可用于管理全局出错状态。
	onError (e) {
		console.error(e);
		// message.error(e.message, 3);
	},
	// state 改变时触发，可用于同步 state 到 localStorage，服务器端等。
	onStateChange: function () {},
});

// 2. Plugins
app.use(createLoading());

// 3. Model
app.model(require('./models/app'));
app.model(require('./models/setting'));
app.model(require('./models/administrator'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
