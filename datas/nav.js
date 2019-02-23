var navs = [{
		"title": "我的申报",
		"icon": "fa-paper-plane-o",
		"spread": true,
		"href": "",
		"children": [{
			"title": "备案申报",
			"icon": "fa-github",
			"href": "main.html"
		}, {
			"title": "立即申报",
			"icon": "fa-lock",
			"href": "button.html"
		}]
	}, {
		"title": "业务受理",
		"icon": "fa-archive",
		"spread": false,
		"href": "",
		"children": [{
			"title": "工作空间",
			"icon": "fa-github",
			"href": "main.html"
		}, {
			"title": "我的审批",
			"icon": "fa-lock",
			"href": "button.html"
		}]
	}, {
		"title": "统计分析",
		"icon": "fa-window-maximize",
		"spread": false,
		"href": "button.html",
		"children": [{
			"title": "备案查询",
			"icon": "fa-github",
			"href": "main.html"
		}, {
			"title": "备案分析",
			"icon": "fa-lock",
			"href": "staAnalysis/reAnalysis.html"
		}]
	}, {
		"title": "系统管理",
		"icon": "fa-asterisk",
		"href": "",
		"spread": false,
		"children": [{
			"title": "角色管理",
			"icon": "fa-github",
			"href": "button.html"
		}, {
			"title": "权限管理",
			"icon": "fa-lock",
			"href": "button.html"
		}, {
			"title": "用户管理",
			"icon": "fa-user-o",
			"href": "button.html"
		}]
	}],
	//系统管理
	navSys = [{
		"title": "角色管理",
		"icon": "fa-github",
		"href": "button.html"
	}, {
		"title": "权限管理",
		"icon": "fa-lock",
		"href": "button.html"
	}, {
		"title": "用户管理",
		"icon": "fa-user-o",
		"href": "button.html"
	}],
	//我的申报
	navRecApply = [{
		"title": "备案申报",
		"icon": "fa-file-archive-o",
		"href": "main.html",
		"spread": false,
	}],
	//业务受理
	navRecMan = [{
		"title": "工作空间",
		"icon": "fa-television",
		"href": "busAccept/workSpace.html"
	}, {
		"title": "我的审批",
		"icon": "fa-gavel",
		"href": "busAccept/myApproval.html"
	}],
	//统计分析
	navBusinessMan = [{
		"title": "备案查询",
		"icon": "fa-search",
		"href": "staAnalysis/recordQuery.html"
	}, {
		"title": "备案分析",
		"icon": "fa-area-chart",
		"href": "staAnalysis/reAnalysis.html"
	}];