import {constant} from '../config';

export function formListData (data) {
	data = data || [];
	return data.map(item => {
		item.key = item.value = item.id + "";
		item.label = item.display_name;
		// item.parent_id = (item.parent_id || "") + "";
		if (item.children && item.children.length > 0) {
			formListData(item.children);
		} else {
			delete item.children;
		}
		return item;
	});
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
					item.visible = true;
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