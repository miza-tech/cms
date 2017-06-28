import axios from 'axios';
import qs from 'qs';
import { app } from '../config';
import { browserHistory } from 'dva/router';
import { notification } from 'antd';

axios.defaults.baseURL = app.HOST;
axios.defaults.timeout = 50000;

const Request = (options) => {

	return axios.request({
		headers: {},
		validateStatus: function (status) {
			return [200].indexOf(status) > -1;
		},
		withCredentials:true,
		...options
	})
	.then((response) => {

		const {code, data, meta} = response.data;
		return {
			code: code,
			data: data,
			meta: meta
		};
	})
	.catch(function (e) {
		const {status, data} = e.response;
		const {code, msg} = data;

		switch(data.code) {
			case 'AUTH_FORBIDDEN':
				browserHistory.replace('/auth/login');
				break;
			case 'MAINTAIN':
				browserHistory.replace('/maintain');
				break;
		}

		if (data.msg) {
			notification.error({
				message: data.msg,
				duration: 3,
				description: ''
			});
		}

		return data;
	});
	;
}

export default Request;