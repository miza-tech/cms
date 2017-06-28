import {constant} from '../config';

export function formatListData (data) {
	data = data || [];
	return data.map(item => {
		item.key = item.value = item.id + "";
		item.label = item.display_name;
		// item.parent_id = (item.parent_id || "") + "";
		if (item.children && item.children.length > 0) {
			formatListData(item.children);
		} else {
			delete item.children;
		}
		return item;
	});
};

export function formatpPagination (data) {
	if (data.per_page > data.total) return false;
	return {
		current: data.current_page,
		total: data.total,
		pageSize: data.per_page,
		showTotal: (total, range) => {
			return `显示${range[0]}-${range[1]}，总共${total}条数据`;
		}
	};
};

export function formatPermissions (data) {
	data = data || [];
	let categories = {};
	let permissions = [];
	data.map((item) => {
		categories[item.category_name] = categories[item.category_name] || {
			category_name: item.category_name,
			category_id: item.category_id,
			key: item.category_id + '',
			permissions: []
		};
		categories[item.category_name].permissions.push(item);
	});

	for(var key in categories) {
		permissions.push(categories[key]);
	}

	return permissions;
};

export function filterSelectedArray (array, selectedIds) {
	array = array || [];
	return array.filter((item) => {
		return !!(selectedIds.indexOf(item.id) > -1);
	});
};

export function getGender(gender) {
	return constant.GENDER[gender] || '';
};

export function getMyMenuTree(menuTree, myMenus) {
	myMenus = myMenus || [];
	const traverse = (menus) => {
		let result = false;
		for (var i = 0, l = menus.length; i < l; i++) {
			let item = menus[i];
			if (myMenus.indexOf(item.id) > -1 || (item.children && traverse(item.children))) {
				if (myMenus.indexOf(item.id) > -1 &&
					( (!item.url && !item.children) || (item.children && !traverse(item.children)))
				) {
					item.visible = false;
				} else {
					if (!item.hidden) {
						item.visible = true;
					}
				}
				// item.visible = true;
				result = true;
			}
		}
		return result;
	}
	traverse(menuTree);

	return menuTree;
};

export function getPermissionsByRole (roles, roleIds) {
	let permissions = [];
	roles.map((role) => {
		if(roleIds.indexOf(role.key) > -1) {
			permissions = permissions.concat(role.permissions || []);
		}
	});

	return permissions;
};

export function genErrorFields (form, errors) {
	let formErrors = {};
	const formData = form.getFieldsValue();

	for(let errorField in errors) {
		let errorMsg = errors[errorField];
		if (errorMsg instanceof Array) {
			errorMsg = errorMsg.length > 0 ? errorMsg[0] : '请检查';
		}

		formErrors[errorField] = {
			value: formData[errorField],
			errors: [new Error(errorMsg)]
		};
	}

	form.setFields(formErrors);
};

export function formatKeysArray (arrValues) {
	return arrValues.map((value) => {
		return value + "";
	});
};

export function genSearchParams (searchForm) {
	let params = [];
	for(let field in searchForm) {
		const value = searchForm[field];
		if (value) {
			params.push(`${field}=${value}`);
		}
	}
	return params.join('&');
};