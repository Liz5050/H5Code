/**功能开放配置 */
class MgOpenConfig extends BaseConfig {
	// private sortedData: Array<any>;//按预览等级排序的数组
	// private taskOpenDict: any;//需要任务开启的配置
	private openData: Array<any>;//需要开启模块显示的功能配置
	private openFunCfg:BaseConfig;
	private openFuncDatas:any[];

	public constructor() {
		super("t_mg_open", "openId");
		this.openFunCfg = new BaseConfig('t_mg_open_function',"openId");
	}

	public getDict(): any {
		// if (this.sortedData == null) {
		// 	this.sortedData = [];
		// 	this.taskOpenDict = {};
		// 	this.dataDict = super.getDict();
		// 	let value: any;
		// 	for (let key in this.dataDict) {
		// 		value = this.dataDict[key];
		// 		if (value.showModel != null) {
		// 			this.sortedData.push(value);
		// 		}
		// 		if (value.openTask > 0 && value.showModel != null) {
		// 			if (this.taskOpenDict[value.openTask] == null) {
		// 				this.taskOpenDict[value.openTask] = value;
		// 			}
		// 		}
		// 	}
		// 	this.sortedData.sort((a: any, b: any): number => {
		// 		return a.previewLevel - b.previewLevel;
		// 	});
		// }

		if (this.openData == null) {
			this.openData = [];
			this.dataDict = super.getDict();
			let value: any;
			for (let key in this.dataDict) {
				value = this.dataDict[key];
				if (value.showModel != null) {
					this.openData.push(value);
				}
			}
		}

		return this.dataDict;
	}

	public getByOpenKey(key: string): any {
		if(key == PanelTabType[PanelTabType.FriendContact] || key == PanelTabType[PanelTabType.FriendApply] || key == PanelTabType[PanelTabType.FriendShield]){
			key = PanelTabType[PanelTabType.Friend];
		}
		let datas: Array<any> = this.select({ "openKey": key });
		if (datas.length > 0) {
			if(key==PanelTabType[PanelTabType.RoleState]){
				datas[0].openCondList="1,80";
			}
			return datas[0];
		}
		return null;
	}

	/**
	 * 功能是否开放了
	 */
	public isOpenedByKey(openKey: string, needTip: boolean = true): boolean {
		let cfg: any = this.getByOpenKey(openKey);
		if (!cfg) {
			return true;//没有配置，默认开启功能
		}
		let isOpen: boolean = true;
		let roleLv:number = CacheManager.role.getRoleLevel();
		if (cfg.openTask > 0) {
			isOpen = CacheManager.task.isTaskOpenEnd(cfg.openTask)
		} else if (cfg.openLevel > 0) {
			isOpen = roleLv >= cfg.openLevel;
			// tip = `${cfg.openLevel}级可开启`;
		}
		if (cfg.openCondList) {
			let conditions: string[] = cfg.openCondList.split("#");
			for (let i: number = 0; i < conditions.length; i++) {
				if (conditions[i] == "") continue;
				if (!this.checkOpenType(conditions[i]) && isOpen) {
					isOpen = false;
					break;
				}
			}
		}
		if (!isOpen) {
			let previewTips:boolean = cfg.previewLevel > 0 && roleLv < cfg.previewLevel;//可提前预览的功能未达到预览等级弹提示
			if (needTip && (cfg.showStyleUnopen == UnOpenShowEnum.Show_Tips || cfg.showStyleUnopen == UnOpenShowEnum.Hide_Entrance || previewTips)) {
				if (cfg.openCondDesc) {
					Tip.showTip(cfg.openCondDesc);
				}
				else {
					Log.trace(Log.SERR, "功能未开启，未配置提示语", openKey);
				}
			}
			return false;
		}
		return true;
	}

	public getOpenCondDesc(openKey: string): string {
		let cfg: any = this.getByOpenKey(openKey);
		if (!cfg) {
			return "";
		}
		return cfg.openCondDesc;
	}

	private checkOpenType(openType: string): boolean {
		let arr: string[] = openType.split(",");
		let type: number = Number(arr[0]);
		let value: number = Number(arr[1]);
		/*
		switch (type) {
			case EOpenCondType.EOpenCondTypeLevel://角色等级限制
				return CacheManager.role.getRoleLevel() >= value;
			case EOpenCondType.EOpenCondTypeRoleState://角色转生等级限制
				return CacheManager.role.getRoleState() >= value;
			case EOpenCondType.EOpenCondTypeCheckPoint://关卡通关数限制
				return CacheManager.checkPoint.passPointNum >= value;
			case EOpenCondType.EOpenCondTypeGodWeapon://神器
				return CacheManager.godWeapon.isGodWPAct(value); //判断某个神器是否激活
			case EOpenCondType.EOpenCondTypeServerOpenDays://开服天数
				return CacheManager.serverTime.serverOpenDay >= value;
		}
		*/
		return this.checkType(type, value);
	}

	private checkType(type: number, value: number): boolean {
		switch (type) {
			case EOpenCondType.EOpenCondTypeLevel://角色等级限制
				return CacheManager.role.getRoleLevel() >= value;
			case EOpenCondType.EOpenCondTypeRoleState://角色转生等级限制
				return CacheManager.role.getRoleState() >= value;
			case EOpenCondType.EOpenCondTypeCheckPoint://关卡通关数限制
				return CacheManager.checkPoint.passPointNum >= value;
			case EOpenCondType.EOpenCondTypeGodWeapon://神器
				return CacheManager.godWeapon.isGodWPAct(value); //判断某个神器是否激活
			case EOpenCondType.EOpenCondTypeServerOpenDays://开服天数
				return CacheManager.serverTime.serverOpenDay >= value;
		}
		return true; //配置了还没定义的类型 返回true
	}

	/**找到某一类型的开启条件的值 */
	public getOpenTypeValue(key: string, openType: number): number {
		let value: number = -1;
		let cfg: any = this.getByOpenKey(key);
		if (cfg && cfg.openCondList) {
			let conditions: string[] = cfg.openCondList.split("#");
			for (let i: number = 0; i < conditions.length; i++) {
				if (conditions[i] == "") continue;
				let openTypeStr: string = conditions[i];
				let arr: string[] = openTypeStr.split(",");
				let type: number = Number(arr[0]);
				let val: number = Number(arr[1]);
				if (openType == type) {
					value = val;
				}
			}
		}
		return value;
	}

	/**判断某个key中的某个类型是否开启 */
	public isTypeOpen(key: string, openType: number): boolean {
		let val: number = this.getOpenTypeValue(key, openType);
		if (val > -1) {
			return this.checkType(openType, val);
		}
		return true;
	}

	/**
	 * 获取功能开启预览信息
	 */
	// public getPreviewInfo(): any {
	// 	let roleLevel: number = CacheManager.role.getRoleLevel();
	// 	this.getDict();
	// 	for (let value of this.sortedData) {
	// 		if (value.showType != 1) {
	// 			continue;
	// 		}
	// 		if (value.previewLevel < 999) {
	// 			if (value.openTask > 0) {
	// 				if (!CacheManager.task.isTaskOpenEnd(value.openTask)) {
	// 					return value;
	// 				}
	// 			} else {
	// 				if (roleLevel >= value.previewLevel && roleLevel < value.openLevel) {
	// 					return value;
	// 				}
	// 			}
	// 		}
	// 	}
	// 	return null;
	// }

	/**
	 * 获取功能开启信息。按等级开启的。主要是外观开启
	 * @param lastLevel 上一次的等级
	 * @param currentLevel 当前等级
	 */
	public getByLevel(currentLevel: number, lastLevel: number): any {
		let dict: any = this.getDict();
		let condition: Array<string>;
		let type: EOpenCondType;
		let value: number;
		for (let cfg of this.openData) {
			condition = cfg.openCondList.split(",");
			type = Number(condition[0]);
			value = Number(condition[1]);
			if (type == EOpenCondType.EOpenCondTypeLevel && lastLevel < value && currentLevel >= value) {
				return cfg;
			}
		}
		return null;
	}

	public getByCondType(tarType:EOpenCondType,tarValue:number):any{
		let dict: any = this.getDict();
		let condition: Array<string>;
		let type: EOpenCondType;
		let value: number;
		for (let cfg of this.openData) {
			condition = cfg.openCondList.split("#")[0].split(",");
			type = Number(condition[0]);
			value = Number(condition[1]);
			if (type == tarType && value==tarValue) {
				return cfg;
			}
		}
		return null;
	}

	/**
	 * 获取功能开启信息。按转生开启的。主要是外观开启
	 * @param lastLevel 上一次的等级
	 * @param currentLevel 当前等级
	 */
	public getByRoleState(roleState: number): any {
		let dict: any = this.getDict();
		let condition: Array<string>;
		let type: EOpenCondType;
		let value: number;
		for (let cfg of this.openData) {
			condition = cfg.openCondList.split("#")[0].split(",");
			type = Number(condition[0]);
			value = Number(condition[1]);
			if (type == EOpenCondType.EOpenCondTypeRoleState && roleState >= value) {
				return cfg;
			}
		}
		return null;
	}

	/**
	 * 根据开启任务获取
	 */
	public getByOpenTask(taskCode: number): any {
		let dict: any = this.getDict();
		for (let cfg of this.openData) {
			if (cfg.openTask == taskCode) {
				return cfg;
			}
		}
		return null;
	}

	public getOpenTask(openKey: string): number {
		let data: any = this.getByOpenKey(openKey);
		if (data) {
			return data.openTask;
		}
		return -1;
	}

	/**获取当前需要功能引导的数据 */
	public getCurOpenGuideData():any{
		if(!this.openFuncDatas){
			this.openFuncDatas = [];
			let dict:any = this.openFunCfg.getDict();
			for(let k in dict){
				this.openFuncDatas.push(dict[k]);
			}
			App.ArrayUtils.sortOn(this.openFuncDatas,"index");
		}
		let data:any;
		for(let i:number = 0;i<this.openFuncDatas.length;i++){
			let cfg:any = this.getByPk(this.openFuncDatas[i].openId);
			if(cfg && !this.isOpenedByKey(cfg.openKey,false)){
				data = this.openFuncDatas[i];
				break;
			}
		}
		return data;
	}

	public getOpenFuncByKey(value:any):any{
		return this.openFunCfg.getByPk(value);
	}

}