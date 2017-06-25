module.exports = [
	{
		'display_name': '业务统计',
		'url': '/dashboard',
		'icon': 'pie-chart'
	}, {
		'display_name': '个人中心',
		'url': '/profile',
		'icon': 'user'
	}, {
		'display_name': '设置',
		'icon': 'setting',
		'children': [
			{
				'display_name': '系统设置',
				'url': '/setting/system',
				'route': '/setting/system(/:section)'
			},
		]
	},
];