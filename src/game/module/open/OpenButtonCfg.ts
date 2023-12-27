/**
 * 开启按钮配置
 */
class OpenButtonCfg {
	/**按钮列表字典 */
	private static _btnListDict: any;
	/**不显示的按钮列表 */
	private static _notShowList: Array<string> = [];

	public static btnDict: any = {
		"TopRight": ["btn_0_recharge_daily", "btn_0_recharge", "btn_synthesis", "btn_career"],
		"Left1": ["btn_welfare", "btn_activity", "btn_0_xunbao", "btn_shop", "btn_setting"],
		"Left2": ["btn_0_market"],
		"Right1": ["btn_arena", "btn_copy", "btn_boss", "btn_guild", "btn_0_marry", "btn_achievement"],
		"Right2": ["btn_rank", "btn_0_zhuzai"],
		"Navbar": ["btn_player", "btn_pet", "btn_rune", "btn_refining", "btn_backpack"],
		"Daily": ["btn_daily"]
	};

	public constructor() {
	}

	/**
	 * 按钮列表字典
	 */
	public static get btnListDict(): any {
		if (OpenButtonCfg._btnListDict == null) {
			OpenButtonCfg._btnListDict = {};
			for (let posEnum in OpenButtonCfg.btnDict) {
				let btnList: OpenButtonList = new OpenButtonList(posEnum, OpenButtonCfg.btnDict[posEnum]);
				OpenButtonCfg._btnListDict[posEnum] = btnList;
			}
		}
		return OpenButtonCfg._btnListDict;
	}

	/**
	 * 获取第一个按钮
	 */
	public static getFirstButton(posEnum: string): fairygui.GObject {
		return OpenButtonCfg.getBtnObj(OpenButtonCfg.btnDict[posEnum][0], posEnum);
	}

	/**
	 * 是否开启按钮
	 * @param name 按钮名称
	 */
	public static isOpenButton(name: string): boolean {
		switch (name) {
			case "btn_synthesis":
				return ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.Compose, false);
			case "btn_career":
				return ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.ChangeCareer1, false);
			case "btn_boss":
				return ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.WorldBoss, false);
			case "btn_copy":
				return ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.CopyHall, false);
			case "btn_guild":
				return ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.Guild, false);
			case "btn_achievement":
				return ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.Achievement, false);
			case "btn_daily":
				return ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.SwordPool, false);
			case "btn_player":
			case "btn_backpack":
			case "btn_shop":
			case "btn_setting":
			case "btn_activity":
				return true;
			case "btn_pet":
				return ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.Pet, false);
			case "btn_refining":
				return ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.WeaponStrengthen, false);
			case "btn_rune":
				return ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.Rune, false);
			case "btn_welfare":
				return ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.WelfareHall, false);
			case "btn_rank":
				return ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.Toplist, false);
		}
		return false;
	}

	/**
	 * 获取按钮对象
	 * @param name 按钮名称
	 * @param posEnum 按钮位置 OpenPosEnum
	 */
	public static getBtnObj(name: string, posEnum: string): fairygui.GObject {
		if (posEnum == OpenPosEnum[OpenPosEnum.Navbar] || posEnum == OpenPosEnum[OpenPosEnum.Daily]) {
			return ControllerManager.home.navbar.getGObject(name);
		} else {
			return ControllerManager.home.module.getGObject(name);
		}
	}

	/**
	 * 获取按钮显示位置
	 * @param name 按钮名称
	 * @param posEnum 按钮位置类型
	 */
	public static getBtnShowPos(name: string, posEnum: string = null): egret.Point {
		let btnPosEnum: string = posEnum;
		if (btnPosEnum == null) {
			btnPosEnum = OpenButtonCfg.getPosEnum(name);
		}
		let buttonList: OpenButtonList = OpenButtonCfg.btnListDict[btnPosEnum];
		return buttonList.getBtnPos(name);
	}

	/**
	 * 更新按钮列表
	 */
	public static updateButtonList(posEnum: string): void {
		let buttonList: OpenButtonList = OpenButtonCfg.btnListDict[posEnum];
		buttonList.update();
	}

	/**
	 * 获取按钮位置类型
	 */
	public static getPosEnum(name: string): string {
		let btnPosEnum: string;
		let names: Array<string>;
		for (let posEnum in OpenButtonCfg.btnDict) {
			names = OpenButtonCfg.btnDict[posEnum];
			for (let btnName of names) {
				if (name == btnName) {
					btnPosEnum = posEnum;
					break;
				}
			}
		}
		return btnPosEnum;
	}

	/**
	 * 获取背包按钮坐标
	 * 取到结果Point之后保存x,y再使用
	 */
	public static getPackBtnPos(): egret.Point {
		let btn: fairygui.GObject = OpenButtonCfg.getBtnObj("btn_backpack", "Navbar");
		return btn.localToGlobal(0,0,RpgGameUtils.point);
	}

	/**
	 * 获取人物按钮坐标
	 * 取到结果Point之后保存x,y再使用
	 */
	public static getPlayerBtnPos(): egret.Point {
		let btn: fairygui.GObject = OpenButtonCfg.getBtnObj("btn_player", "Navbar");
		return btn.localToGlobal(0,0,RpgGameUtils.point);
	}

	/**
	 * 是否为导航栏按钮
	 */
	public static isNavbarBtn(name: string): boolean {
		return OpenButtonCfg.getPosEnum(name) == "Navbar";
	}

	/**
	 * 添加到不显示列表。
	 * @param name按钮名称
	 */
	public static addToNotShow(name: string): void {
		if (this._notShowList.indexOf(name) == -1) {
			this._notShowList.push(name);
		}
	}

	/**
	 * 从不显示列表中删除。
	 * @param name按钮名称
	 */
	public static removeFromNotShow(name: string): void {
		this._notShowList.splice(this._notShowList.indexOf(name), 1);
	}

	/**
	 * 是否在不显示列表中
	 */
	public static isInNotShow(name: string): boolean {
		return this._notShowList.indexOf(name) != -1;
	}
}