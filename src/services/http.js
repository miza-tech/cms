import request from '../utils/request';

export async function GET(url, options) {
	return request({
		url: url,
		method: 'get',
		...options
	});
}

export async function DELETE(url, options) {
	return request({
		url: url,
		method: 'delete',
		...options
	});
}

export async function POST(url, params, options) {
	return request({
		url: url,
		method: 'post',
		data: params,
		...options
	});
}

export async function PATCH(url, params, options) {
	return request({
		url: url,
		method: 'patch',
		data: params,
		...options
	});
}

export async function PUT(url, params, options) {
	return request({
		url: url,
		method: 'put',
		data: params,
		...options
	});
}