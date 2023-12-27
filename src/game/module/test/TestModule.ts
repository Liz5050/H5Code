class TestModule extends BaseWindow {
	private proxy: TestProxy;
	private cmdList: List;
	private resourceList: List;
	private controller: fairygui.Controller;
	private searchList: List;

	private testReg1: RegExp = /^日志 (\w+)/i;
	private aiReg: RegExp = /^ai/i;
	private modelLogReg: RegExp = /^logmodel/i;
	private loadLogReg: RegExp = /^logload/i;
	private loadLogMapReg: RegExp = /^logmap/i;
	private resLogReg: RegExp = /^logres/i;
	private tileTestReg: RegExp = /^tile (\d{1,9}) (\d{1,9}) (\d{1,9}) (\d{1,9}) (-?\d{1,9})/i;
	private jsonList: List;
	private txt_autoCopy:fairygui.GTextField;
	private testPlayerWindow: TestPlayerWindow;

	private itemCateCom:fairygui.GComboBox;
	private itemTypeCom:fairygui.GComboBox;
	private itemClrCom:fairygui.GComboBox;

	public constructor(moduleId: ModuleEnum = null) {
		super(PackNameEnum.Test, "Main", moduleId);
		this.proxy = ProxyManager.test;
		this.isAnimateShow = false;
	}

	public initOptUI(): void {
		this.controller = this.getController("c1");
		this.getGObject("levelBtn").addClickListener(this.updateRoleLevel, this);
		this.getGObject("expBtn").addClickListener(this.updateRoleExp, this);
		this.getGObject("lifeBtn").addClickListener(this.updateRoleLife, this);
		this.getGObject("moneyBtn").addClickListener(this.updateMoney, this);
		this.getGObject("itemBtn").addClickListener(this.updateItem, this);
		this.getGObject("btn_revive").addClickListener(this.revive, this);
		this.getGObject("mapBtn").addClickListener(this.transferMap, this);
		this.getGObject("btn_playerHotUpdate").addClickListener(this.playerHotUpdate, this);
		this.getGObject("btn_player").addClickListener(this.openPlayerWindow, this);
		this.getGObject("btn_autoCopy").addClickListener(this.onAutoCopyChange,this);
		this.getGObject("btn_mount").addClickListener(this.switchMount, this);
		this.txt_autoCopy = this.getGObject("txt_autoCopy").asTextField;


		this.getGObject("unitCom").asComboBox.selectedIndex = 1;

		this.getGObject("btn_enterCopy").addClickListener(this.enterCopy, this);
		this.getGObject("btn_exitCopy").addClickListener(this.exitCopy, this);
		this.getGObject("btn_resetCopyTime").addClickListener(this.resetCopyTime, this);
		this.getGObject("btn_tire").addClickListener(this.onClearTire, this);

		this.getGObject("copyCodeTxt").asCom.getChildAt(1).asTextInput.text = "7020";
		this.getGObject("copyTimeTxt").asCom.getChildAt(1).asTextInput.text = "89";
		this.getGObject("tireTxt").asCom.getChildAt(1).asTextInput.text = "0";

		this.getGObject("btn_task_1").addClickListener(this.completePreTask, this);
		this.getGObject("btn_task_2").addClickListener(this.completeTask, this);
		this.getGObject("btn_task_3").addClickListener(this.endTask, this);
		this.getGObject("btn_task_update").addClickListener(this.hotUpdate, this);
		this.getGObject("btn_task_complete").addClickListener(this.completeCurrentTask, this);
		this.getGObject("btn_task_end").addClickListener(this.endCurrentTask, this);

		this.getGObject("btn_map_convery").addClickListener(this.convetyPoint, this);
		this.getGObject("btn_player_state").addClickListener(this.updatePlayerState, this);

		this.getGObject("btn_player_vipLevel").addClickListener(this.updateVipLevel, this);
		this.getGObject("btn_player_vipExp").addClickListener(this.updateVipExp, this);

		this.getGObject("btn_pack_clear").addClickListener(this.clearPack, this);
		this.getGObject("btn_pack_fill").addClickListener(this.fillPack, this);
		this.getGObject("btn_test").addClickListener(this.cTest, this);

		this.cmdList = new List(this.getGObject("list_cmd").asList);
		this.getGObject("btn_test_command").addClickListener(this.exeTestCmd, this);
		this.getGObject("txt_test_search").addEventListener(egret.Event.CHANGE, this.onSearchChanged, this);

		this.getGObject("timesTxt").asCom.getChildAt(1).asTextInput.text = "1";
		this.getGObject("btn_changeUser").addClickListener(this.onChangeUser, this);
		this.getGObject("btn_cmd").addClickListener(this.onCmdHandler, this);
		this.getGObject("btn_gen").addClickListener(this.onGenJsonHandler, this);
		this.getGObject("btn_clear").addClickListener(this.onClearJsonHandler, this);

		this.resourceList = new List(this.getGObject("list_resource").asList);

		this.getGObject("btn_checkPoint").addClickListener(this.onChangeCheckPoint, this);

		//设置默认值
		this.getGObject("mapTxt").asCom.getChildAt(1).asTextInput.text = "109000";
		this.getGObject("txt_task_1").asCom.getChildAt(1).asTextInput.text = "309999";

		this.searchList = new List(this.getGObject("list_pack_search").asList);
		this.getGObject("btn_pack_search").addClickListener(this.onSearchItem, this);
		this.getGObject("btn_pack_search2").addClickListener(this.onSearchInPack, this);
		this.getGObject("btn_pack_search3").addClickListener(this.onSearchInPack2, this);

		this.itemCateCom = this.getGObject("cateCom").asComboBox;
		this.itemTypeCom = this.getGObject("typeCom").asComboBox;
		this.itemClrCom = this.getGObject("clrCom").asComboBox;

		let names:string[] = ["装备","外形装备","药品","道具","宝石","材料","任务","符文","灵魂","神兽材料","神兽装备","宠物","宠物装备","命格","图鉴","星运","法宝","坐骑","秘籍","心法","天赋装备"];
		let items:string[] = ['无限制'];
		let n:number = 21;
		let values:string[] = ['-1'];
		for(let i:number=1;i<=n;i++){
			if(ECategory[i]){
				values.push(String(i));
				items.push(names[i-1]+"_"+i);
			}			
		}
		this.itemCateCom.items = items;
		this.itemCateCom.values = values;
		this.itemCateCom.selectedIndex = 0;
		items = ['无限制'];
		values = ['-1'];
		for(let i:number=1;i<=n;i++){
			if(EEquip[i] && WeaponUtil.getWeaponTypeName(i)){
				values.push(String(i));
				items.push(WeaponUtil.getWeaponTypeName(i)+"_"+i);
			}			
		}
		this.itemTypeCom.items = items;
		this.itemTypeCom.values = values;
		this.itemTypeCom.selectedIndex = 0;

		n = 7;
		items = ['无限制'];
		values = ['-1'];
		for(let i:number=0;i<=n;i++){
			if(EColor[i]){
				values.push(String(i));
				items.push(GameDef.ColorName[i]+"_"+i);
			}			
		}
		this.itemClrCom.items = items;
		this.itemClrCom.values = values;
		this.itemClrCom.selectedIndex = 5;

		this.jsonList = new List(this.getGObject("list_json").asList);
		let cmdEnumCook: any = CookieManager.getCookie("test_cmd_enum");
		if (cmdEnumCook) {
			this.getGObject("cmdTxt").text = cmdEnumCook;
		}
		let cmdCook: any = CookieManager.getCookie("test_cmd");
		if (cmdCook && cmdCook != "{") {
			this.jsonList.data = [cmdCook];
		}
	}

	public updateAll(): void {
		//更新测试指令
		if(DebugUtils.isDebugDC()){
			LayerManager.UI_Cultivate.visible = false;
		}
		this.cmdList.data = ConfigManager.test.getTestTypeCfgs();
		let datas: Array<any> = [];
		let dict: any = ConfigManager.gmItem.getDict();
		for (let key in dict) {
			datas.push(dict[key]);
		}
		let serStr:string = App.DateUtils.formatDate(CacheManager.serverTime.getServerTime(),DateUtils.FORMAT_Y_M_D_HH_MM_SS);
		this.getGObject("txt_open_day").asTextField.text = `开服第 ${CacheManager.serverTime.serverOpenDay} 天,时间:${serStr}`;
		this.resourceList.data = datas;
		(this.getGObject("gm_8") as TestGM8).updateAll();
		(this.getGObject("com_cmd") as TestCmdCom).updateAll();
		this.txt_autoCopy.text = CacheManager.sysSet.autoCopy ? "true" : "false";
	}

	private onClearTire(): void {
		var n: number = Number(this.getGObject("tireTxt").asCom.getChildAt(1).asTextInput.text);
		if (!isNaN(n)) {
			var types: number[] = [n];
			ProxyManager.test.gmOperation(EGmOpType.EGmOpTypeModifyTire, types);
		}

	}
	public resetCopyTime(): void {
		var copyType: string[] = this.getGObject("copyTimeTxt").asCom.getChildAt(1).asTextInput.text.split(',');
		var types: number[] = []
		for (var i: number = 0; i < copyType.length; i++) {
			types.push(Number(copyType[i]));
		}
		ProxyManager.test.gmOperation(EGmOpType.EGmOpTypeResetCopyTimes, types);
	}

	private maskShp:BaseMask;
	private cur:number = 0;
	private dcDebugWin:EfficientDemoWindow;
	/***
	 * 退出当前副本
	 */
	private exitCopy(): void {
		if (CacheManager.copy.isInCopy) {
			EventManager.dispatch(LocalEventEnum.CopyReqExit);
		} else {
			/*
			if(!this.maskShp){
				this.maskShp = new BaseMask(50,0,540,-1);
			}
			this.displayListContainer.addChild(this.maskShp);
			this.maskShp.x = 100;
			this.maskShp.y = 200;
			this.cur += 10;
			let m:number = 100;
			let v:number =  m - this.cur;
			v = this.cur;
			this.maskShp.updateValue(v,m);
			*/
			if(DebugUtils.isDebugDC()){
				if(!this.dcDebugWin){
					this.dcDebugWin = new EfficientDemoWindow();
				}
				this.dcDebugWin.show();
				this.hide();
			}			
			//let cfg:any = ConfigManager.client.getTestOpen();
			//EventManager.dispatch(ModuleEnum.Open,cfg);
			//HomeUtil.open(ModuleEnum.Open,false,cfg);

		}

	}

    /**
	 * 客户端指令调试（正则匹配
     */
	private cTest(): void {
		let cTestStr: string = this.getGObject("txt_test").asCom.getChildAt(1).asTextInput.text;
		if (cTestStr != "") {
			let params: string[];
			if (this.testReg1.test(cTestStr)) {
				params = this.testReg1.exec(cTestStr);
				egret.log(CacheManager.map.statlog());
			} else if (this.aiReg.test(cTestStr)) {
				Log.trace(Log.TEST, "当前AI=", AI.aiListArr);
			} else if (this.modelLogReg.test(cTestStr)) {
				ModelResLoader.printLog();
			} else if (this.loadLogReg.test(cTestStr)) {
				App.LoaderManager.printLoadLog("");
			} else if (this.loadLogMapReg.test(cTestStr)) {
				App.LoaderManager.printLoadLog("map_");
			} else if (this.resLogReg.test(cTestStr)) {
				CacheManager.res.getResLog("all", true);
			} else if (this.tileTestReg.test(cTestStr)) {
				params = this.tileTestReg.exec(cTestStr);
				let keys: string[] = RpgTiles.makeDirTileKeys(1, Math.floor(CacheManager.king.leaderEntity.x / RpgGameData.GameCellWidth), Number(params[1]), Number(params[2]), Number(params[3]), Number(params[4]), Number(params[5]));
				let keyStr: string = "";
				for (let key of keys) {
					keyStr += key + " --- "
				} console.log(Dir[Number(params[5])] + ">", keyStr);
			}
		}
	}

	/**
	 * 进入副本
	 */
	private enterCopy(): void {
		let code: number = Number(this.getGObject("copyCodeTxt").asCom.getChildAt(1).asTextInput.text);
		if (code) {
			EventManager.dispatch(LocalEventEnum.CopyReqEnter, code);
		}
		EventManager.dispatch(UIEventEnum.ModuleClose, this.moduleId);
	}

	/**
	 * 切换地图，传入指定地图ID
	 */
	private transferMap(): void {
		let mapId: number = Number(this.getGObject("mapTxt").asCom.getChildAt(1).asTextInput.text);
		var mapId2: number = Number(this.getGObject("combo_map").asComboBox.value);
		if (!mapId) {
			mapId = mapId2;
		}
		Log.trace(Log.RPG, "开始切换地图，id是：", mapId);
		ProxyManager.test.convey(mapId, 1, 0);
		
		// EventManager.dispatch(LocalEventEnum.ChangeMapAndPosition, { "mapId": 704001, "pos_x": 20, "pos_y": 50, "reason": -1});
	}

	private onAutoCopyChange():void {
		let autoCopy:boolean = CacheManager.sysSet.autoCopy;
		CacheManager.sysSet.autoCopy = !autoCopy;
		this.txt_autoCopy.text = CacheManager.sysSet.autoCopy ? "true" : "false";
	}

	/**
	 * 更新等级
	 */
	private updateRoleLevel(): void {
		var level: number = Number(this.getGObject("levelTxt").asCom.getChildAt(1).asTextInput.text);
		ProxyManager.test.updateRoleLevel(level);
	}


	private updateRoleExp(): void {
		var value: number = Number(this.getGObject("expTxt").asCom.getChildAt(1).asTextInput.text);
		ProxyManager.test.updateRoleExp(value);
	}

	private updateRoleLife(): void {
		let str: string = this.getGObject("lifeTxt").asCom.getChildAt(1).asTextInput.text;
		let strArr: string[] = str.split("#");
		let roleIndex: number = 0;
		let value: number;
		if (strArr.length > 1) {
			roleIndex = Number(strArr[0]);
			value = Number(strArr[1]);
		}
		else if (strArr.length > 0) {
			value = Number(strArr[0]);
		}
		else {
			value = Number(str);
		}
		ProxyManager.test.updateRoleLife(value, roleIndex);
	}

	private updateMoney(): void {
		var unit: number = Number(this.getGObject("unitCom").asComboBox.value);
		var value: number = Number(this.getGObject("moneyTxt").asCom.getChildAt(1).asTextInput.text);
		ProxyManager.test.updateMoney(unit, value);
	}

	/**
	 * 添加物品
	 */
	private updateItem(): void {
		var code: number = Number(this.getGObject("codeTxt").asCom.getChildAt(1).asTextInput.text);
		var amount: number = Number(this.getGObject("numTxt").asCom.getChildAt(1).asTextInput.text);
		ProxyManager.test.addItem(code, amount);
	}

	/**
	 * 复活
	 */
	private revive(): void {
		ProxyManager.test.revive();
	}

	/**
	 * 完成任务的前置任务
	 */
	private completePreTask(): void {
		let taskCode: number = this.getTextNumberValue("txt_task_1");
		this.proxy.gmOperation(EGmOpType.EGmOpTypeCompletePreTask, [taskCode]);
	}

	/**
	 * 完成任务
	 */
	private completeTask(): void {
		let taskCode: number = this.getTextNumberValue("txt_task_2");
		this.proxy.gmOperation(EGmOpType.EGmOpTypeCompleteOneTask, [taskCode]);
	}

	/**
	 * 结束任务
	 */
	private endTask(): void {
		let taskCode: number = this.getTextNumberValue("txt_task_31");
		let count: number = this.getTextNumberValue("txt_task_32");
		this.proxy.gmOperation(EGmOpType.EGmOpTypeEndTask, [taskCode, count]);
	}

	/**
	 * 热更配置
	 */
	private hotUpdate(): void {
		this.proxy.gmOperation(EGmOpType.EGmOpTypeUpdateConfigData);
	}

	private completeCurrentTask(): void {
		let sPlayerTask: any = CacheManager.task.currentTraceTask;
		if (sPlayerTask != null) {
			this.proxy.gmOperation(EGmOpType.EGmOpTypeCompleteOneTask, [sPlayerTask.task.code_I]);
		}
	}

	private endCurrentTask(): void {
		let sPlayerTask: any = CacheManager.task.currentTraceTask;
		if (sPlayerTask != null) {
			this.proxy.gmOperation(EGmOpType.EGmOpTypeEndTask, [sPlayerTask.task.code_I, 1]);
		}
	}

	private getTextStringValue(name: string): string {
		return this.getGObject(name).asCom.getChildAt(1).asTextInput.text;
	}

	private getTextNumberValue(name: string): number {
		return Number(this.getGObject(name).asCom.getChildAt(1).asTextInput.text);
	}

	/**
	 * 传送到地图内指定点
	 */
	private convetyPoint(): void {
		let mapId: number = this.getTextNumberValue("map_txt_map");
		let a: Array<any> = this.getTextStringValue("map_txt_pos").split(",");
		this.proxy.convey(mapId, EConveyType.EConveyTypeTask, { "x": Number(a[0]), "y": Number(a[1]) });
	}

	/**
	 * 人物转生
	 */
	private updatePlayerState(): void {
		let roleState: number = this.getTextNumberValue("txt_player_state");
		this.proxy.gmOperation(EGmOpType.EGmOpTypeModifyRoleState, [roleState]);
	}

	private updateVipLevel(): void {
		let level: number;
		let minute: number = 10;
		let a: Array<string> = this.getTextStringValue("txt_player_vipLevel").split(",");
		level = Number(a[0]);
		if (a.length == 2) {
			minute = Number(a[1]);
		}
		this.proxy.gmOperation(EGmOpType.EGmOpTypeModifyVipLevel, [level, minute]);
	}

	private updateVipExp(): void {
		let exp: number = this.getTextNumberValue("txt_player_vipExp");
		this.proxy.gmOperation(EGmOpType.EGmOpTypeModifyVipExp, [exp]);
	}

	private clearPack(): void {
		this.proxy.gmOperation(EGmOpType.EGmOpTypeClearOrFillUpBag, [111]);
	}

	private fillPack(): void {
		this.proxy.gmOperation(EGmOpType.EGmOpTypeClearOrFillUpBag, [222]);
	}

	/**执行测试指令 */
	private exeTestCmd(): void {
		let type: number = this.getTextNumberValue("txt_test_type");
		if (type == 0) {
			Tip.showTip("指令不能为空");
			return;
		}
		let params: Array<number> = [];
		for (let i = 1; i <= 5; i++) {
			params.push(this.getTextNumberValue("txt_test_p" + i));
		}
		this.proxy.exeCmd(type, params);
	}

	/**
	 * 搜索改变
	 */
	private onSearchChanged(): void {
		let content: string = this.getTextStringValue("txt_test_search");
		if (content != "") {
			this.cmdList.data = ConfigManager.test.search(content);
		} else {
			this.updateAll();
		}
	}

	private onChangeUser(): void {
		this.hide();
		ControllerManager.login.returnToLogin();
	}
	private onGenJsonHandler(): void {
		let cmd: string = this.getGObject("cmdTxt").text;
		cmd.trim();
		let isCmd: boolean = true;
		if (cmd) {
			let c2s: any = App.ProtoConfig.C2S;
			if (c2s[cmd]) {
				let key: string = c2s[cmd];
				try {
					// let cls:any = App.ProtoFile.build(key);
					key = "simple." + key;
					let cls: any = egret.getDefinitionByName(key);
					let obj = new cls();
					let obj2 = this.protoToObj(obj);
					let js: string = JSON.stringify(obj2, null, 4);
					this.jsonList.data = [js];
				} catch (error) {
					console.log(`命令: ${cmd} 生成json出错，看前端是否生成proto了`);
					isCmd = false;
				}
			} else {
				isCmd = false;
			}
		}
		if (!isCmd) {
			Alert.alert(`无法根据命令: ${cmd} 生成json，看前端是否生成proto了`);
		}
	}

	private buildProto(key: string): any {
		let obj: any;
		try {
			// let cls:any = App.ProtoFile.build(key);
			key = "simple." + key;
			let cls: any = egret.getDefinitionByName(key);
			obj = new cls();
		} catch (error) {
			console.log(`buildProto:${key}`);
		}
		return obj;
	}

	private protoToObj(protoObj:any):any{
		let retObj:any = {};	
		if(!protoObj.__proto__){
			return protoObj;
		}else{
			for(let key in protoObj.__proto__){
				if(key=="toJSON"){
					continue;
				}
				retObj[key] = protoObj.__proto__[key];
			}
			return retObj;
		}
		
		//以下是旧的
		/*
		let type:any = protoObj.$type;	
		let fieldsByName:any = type?type._fieldsByName:null;
		for(let key in protoObj){
			if(fieldsByName && !fieldsByName[key]){
				continue;
			}
			if (fieldsByName && fieldsByName[key].resolvedType) {
				let subObj: any = this.buildProto(fieldsByName[key].resolvedType.name);
				if (subObj) {
					subObj = this.protoToObj(subObj);
					retObj[key] = subObj;
				} else {
					retObj[key] = protoObj[key];
				}
			} else {
				retObj[key] = protoObj[key];
			}
		}
		return retObj;
		*/
	}

	private onCmdHandler(): void {
		let json: string = (this.jsonList.list.getChildAt(0) as InputItem).getData();
		if (!json) {
			Alert.alert(`发送失败`);
			return;
		}
		let times: number = this.getTextNumberValue("timesTxt");
		let cmd: string = this.getGObject("cmdTxt").text;
		if (cmd && json) {
			for(let i: number = 0; i < times; i++) {
				ProxyManager.test.sendCmd(cmd, json);
			}

			CookieManager.setCookie("test_cmd_enum", cmd);
			CookieManager.setCookie("test_cmd", json);
		}

	}

	private onClearJsonHandler(): void {
		this.getGObject("cmdTxt").text = "";
		this.jsonList.data = [];
		CookieManager.delCookie("test_cmd_enum");
		CookieManager.delCookie("test_cmd");
	}

	private onChangeCheckPoint(): void {
		let num: number = Number(this.getGObject("checkPoint_txt").text);
		num -= 1;
		if (num < 0) {
			num = 0;
		}
		this.proxy.exeCmd(201, [num]);
		Tip.showTip("设置成功，重登后生效");
	}

	/**热更配置 */
	private playerHotUpdate(): void {
		let params: Array<number> = [];
		this.proxy.exeCmd(115, params);
	}

	private onSearchItem(): void {
		let name: string = this.getTextStringValue("txt_pack_search").trim();
		if (name != "") {
			this.searchList.list.defaultItem = URLManager.getPackResUrl(PackNameEnum.Test, "TestSearchItem");
			let itemDatas: Array<ItemData> = ConfigManager.item.searchByName(name);
			this.searchList.setVirtual(itemDatas);
		}
	}

	/**在背包中搜索 */
	private onSearchInPack(): void {
		let name: string = this.getTextStringValue("txt_pack_search").trim();
		if (name != "") {
			this.searchList.list.defaultItem = URLManager.getPackResUrl(PackNameEnum.Test, "TestSearchItem2");
			let itemDatas: Array<ItemData> = [];
			let packCache: PackBaseCache
			for (let posType: number = 0; posType <= 41; posType++) {
				packCache = CacheManager.pack.getPackCacheByPosType(posType);
				if (packCache) {
					for (let itemData of packCache.itemDatas) {
						if (itemData.getName().indexOf(name) != -1) {
							itemDatas.push(itemData);
						}
					}
				}
			}
			this.searchList.setVirtual(itemDatas);
		}
	}

	private onSearchInPack2():void{
		let itemDatas: Array<ItemData> = [];
		let cond:any = {};
		let flag:boolean = false;
		let costLimit:string = "-1";
		if(this.itemCateCom.value==costLimit && this.itemTypeCom.value==costLimit && this.itemClrCom.value==costLimit ){
			Tip.showRollTip("所有条件都 无限制 你想搜索啥？");
			return;
		}

		if(ECategory[ECategory[this.itemCateCom.value]]!=null){
			flag = true;
			cond.category = Number(this.itemCateCom.value);
		}
		if(EEquip[this.itemTypeCom.value]!=null){			
			if(this.itemCateCom.value==costLimit){
				cond.category = ECategory.ECategoryEquip;
			}
			if(cond.category == ECategory.ECategoryEquip){
				flag = true;
				cond.type = Number(this.itemTypeCom.value);
			}			
		}

		if(EColor[this.itemClrCom.value]!=null){
			flag = true;
			cond.color = Number(this.itemClrCom.value);
		}
		if(flag){
			let st:number = egret.getTimer();
			let cfgs:any[] = ConfigManager.item.select(cond);
			console.log("... 搜索物品表耗时:",egret.getTimer()-st," 毫秒");
			App.ArrayUtils.sortOn(cfgs,"color");
			for(let i:number=0;i<cfgs.length;i++){
				itemDatas.push(new ItemData(cfgs[i].code));
			}			
			this.searchList.setVirtual(itemDatas);
			if(itemDatas.length>0){
				this.searchList.scrollToView(0);
			}
			
			Tip.showRollTip(`物品表搜索到 ${cfgs.length} 条数据`);
		}
		
	}

	/**
	 * 打开人物信息窗口
	 */
	private openPlayerWindow(): void {
		if (this.testPlayerWindow == null) {
			this.testPlayerWindow = new TestPlayerWindow();
		}
		this.testPlayerWindow.show();
	}

	/**
	 * 上下坐骑
	 */
	private switchMount():void {
		this.hide();
		EventManager.dispatch(UIEventEnum.HomeSwitchMount);
	}
}