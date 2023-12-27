class SysSetCache implements ICache {
	public static KeyMenuSkillPosDict:string = "MenuSkillPosDict";
	/** 离线挂机最大时间(秒)*/
	public static FULL_OFFLINE_WORK_TIME:number = 20 * 60 * 60;

	//特殊副本中是否自动释放合击(野外BOSS，秘境BOSS，王者争霸，矿洞)
	public specialCopyAutoXP:boolean = true;

	//材料副本是否自动释放合击
	public materialCopyAutoXP:boolean = false;

	/**是否可自动进入各种副本的前提 */
	private _autoCopy:boolean = true;

	private _data:any = {};

	/**客户端to服务端字段名映射 */
	private serverkeyMap:any = {
		Onhook_Point:"e",
		AutoTeam:"o",
		AutoRelive:"c",
	};
	//对应LocalEventEnum中的类型，命名规则要一样
	private gDefaultSet:any = {
		HideOther:false,//屏蔽其他玩家
		NoShake:false,//屏蔽震屏
		HideOtherEffect:false,//屏蔽其他玩家特效
		HideTitle:false,//屏蔽称号
		HideMonster:false,//屏蔽野怪
		HaveNoSound:false,//静音
		MusicVolume:0.2,//背景音乐音量
		EffectVolume:0.8,//特效音量
		Onhook_Point:false,//定点挂机
		AutoPickUp:true,//自动拾取
		PickUpWhite:true,//白色装备
		PickUpBlue:true,//蓝色装备
		PickUpPurple:true,//紫色装备
		PickUpOrange:true,//橙色装备
		PickUpCopper:true,//铜钱
		PickUpOther:true,//其他
		AutoSell:true,//自动出售
		AutoRecycle:true,//宠物自动吞噬低分紫装（背包格子<5）
		AutoTeam:true,//离线组队
		AutoRelive:false,//自动买活
		OffLineOnhook:120,//离线挂机时间
		MenuSkillPosDict:true,
        SysSettingGuide:true,//设置引导红点
		BossFollow:0,//boss关注设置
		BossSetList:0,//是否设置过boss关注状态
		AutoXP:false,//自动释放XP技能
		HideEffect:false,//隐藏所有特效
	};

	private _offlineWorkLeftTime:number;
	private _offlineWorkRatio:number = 0;//离线挂机效率

	private _isInit:boolean = false;
	public constructor() {
	}

	public set data(data:any){
		let playerId:number = data.playerId_I;
		if(playerId == 0){
			playerId = this.playerId;
		}
		if(data.jsStr_S != ""){
			this._data[playerId] = JSON.parse(data.jsStr_S);
			// let key:string;
			// for(key in this.gDefaultSet) { //除了可以设置的2个之外，其他用默认
			// 	if (key != LocalEventEnum[LocalEventEnum.HaveNoSound]
			// 		&& key != LocalEventEnum[LocalEventEnum.NoShake]
			// 		&& key != LocalEventEnum[LocalEventEnum.AutoXP]
			// 		&& key != LocalEventEnum[LocalEventEnum.SysSettingGuide] 
			// 		&& key != LocalEventEnum[LocalEventEnum.BossFollow]
			// 		&& key != LocalEventEnum[LocalEventEnum.BossSetList]
			// 		&& key != LocalEventEnum[LocalEventEnum.HideOther]
			// 		&& key != LocalEventEnum[LocalEventEnum.HideEffect]) {
            //         this._data[playerId][key] = this.gDefaultSet[key];
			// 	}
			// }
		}else{
			this._data[playerId] = this.defaultSet;
			ProxyManager.sysSet.save(this.jsonStr);
		}
		this._isInit = true;
        EventManager.dispatch(LocalEventEnum.SysSettingInit,LocalEventEnum.SysSettingInit);
    }

	public get data():any
	{
		return this._data[this.playerId];
	}

	public setValue(key:any, value:any, needDispatch:boolean = true,playerId:number=-1, needSave:boolean = true):void{
		if(typeof key == "number") {
			key = LocalEventEnum[key];
		}
		if(this.gDefaultSet[key] == undefined) return;//默认设置中未定义的类型不给设置
		if(playerId == -1){
			playerId = this.playerId;
		}
		if(!this._data[playerId]) return;
		let _toServerKey:string = this.serverkeyMap[key];
		//取不到映射，直接读取客户端定义字段(纯客户端设置)
		if(_toServerKey == undefined) _toServerKey = key;
		if(this._data[playerId][_toServerKey] != value || key == LocalEventEnum[LocalEventEnum.BossFollow] || key == LocalEventEnum[LocalEventEnum.BossSetList])//boss关注设置是数组，引用是同一个
		{
			this._data[playerId][_toServerKey] = value;
			if (needSave) ProxyManager.sysSet.save(this.jsonStr);
			if(LocalEventEnum[key] && needDispatch)
			{
				EventManager.dispatch(LocalEventEnum[key],LocalEventEnum[key]);
			}
		}
	}

	public getValue(key:any, playerId:number=-1):any{
		if(playerId == -1){
			playerId = this.playerId;
		}
		if(typeof key == "number") {
			key = LocalEventEnum[key];
		}
		let _toServerKey:string = this.serverkeyMap[key];
		//取不到映射，直接读取客户端定义字段(纯客户端设置)
		if(_toServerKey == undefined) _toServerKey = key;
		if(this._data[playerId] != null && this._data[playerId][_toServerKey] != undefined){
			return this._data[playerId][_toServerKey];
		}
		return this.gDefaultSet[key];
	}

	/**检测掉落是否被屏蔽拾取 */
	public checkItemShield(code:number):boolean
	{
		let _item:any = ConfigManager.item.getByPk(code);
		if(!_item) return false;
		let _flag:boolean = this.getValue(LocalEventEnum[LocalEventEnum.AutoPickUp]);
		if(!_flag) return true;//没有设置自动拾取
		if(_item.category == ECategory.ECategoryEquip)
		{
			let _checks:LocalEventEnum[] = [
				LocalEventEnum.PickUpWhite,
				LocalEventEnum.PickUpBlue,
				LocalEventEnum.PickUpPurple,
				LocalEventEnum.PickUpOrange,
				];
			let _index:number = _item.color - 1;
			if(_index >= 0 && _index < _checks.length)
			{
				_flag = this.getValue(LocalEventEnum[_checks[_index]]);
				return !_flag;//没有勾选自动拾取对应的品质装备
			}
		}
		else if(_item.type == EProp.EPropCoinBind)
		{
			//铜钱
			_flag = this.getValue(LocalEventEnum[LocalEventEnum.PickUpCopper]);
			return !_flag;
		}
		else
		{
			//其他物品
			_flag = this.getValue(LocalEventEnum[LocalEventEnum.PickUpOther]);
			return !_flag;
		}
	}

	public isFullOfflineTime(addMin:number):boolean
	{
		return this._offlineWorkLeftTime + addMin * 60> SysSetCache.FULL_OFFLINE_WORK_TIME;
	}

    /**
     * 获取建议离线挂机卡道具Id
     */
    public getAdviceOfflineWorkItemCode():number
    {
        let items:Array<any> = ConfigManager.item.selectByCT(ECategory.ECategoryProp, EProp.EPropOfflineWork);
        let goldBindItemCode:number;
        let goldItemCode:number;
        if (items.length)
		{
			let sellItems:any;
            for (let item of items)
            {
                sellItems = ConfigManager.shopSell.select({"itemCode":item.code});
                if (sellItems.length)
				{
					if (sellItems[0].shopCode == ShopType.SHOP_GOLDBIND) goldBindItemCode = item.code;
					else if (sellItems[0].shopCode == ShopType.SHOP_NORMAL) goldItemCode = item.code;
                }
            }
		}
        return goldBindItemCode || goldItemCode;
    }

	public isAutoPick():boolean
	{
		return this.getValue(LocalEventEnum[LocalEventEnum.AutoPickUp]);
	}

	/**
	 * 获取默认设置
	 */
	public getDefaultValue(key:string, playerId:number=-1):any
	{
		if(playerId == -1){
			playerId = this.playerId;
		}
		return this.gDefaultSet[key];
	}

	public get jsonStr():string{
		return JSON.stringify(this._data[this.playerId]);
	}

	public get playerId():number{
		return CacheManager.role.getPlayerId();
	}

	/**默认设置，只读不修改 */
	public get defaultSet():any
	{
		let _setData:any = {};
		for(let key in this.gDefaultSet)
		{
			_setData[key] = this.gDefaultSet[key];
		}
		return _setData;
	}

    public get offlineWorkLeftTime(): number {
        return this._offlineWorkLeftTime;
    }

    public set offlineWorkLeftTime(value: number) {
        this._offlineWorkLeftTime = value;
    }

	public get offlineWorkRatio():number {
		return this._offlineWorkRatio;
	}

	public set offlineWorkRatio(value:number) {
		this._offlineWorkRatio = value;
	}

	public get canAutoXP():boolean {
		let curCopyType:ECopyType = CacheManager.copy.curCopyType;
		let isInSpecialCopy:boolean = curCopyType == ECopyType.ECopyMgKingStife
            || curCopyType == ECopyType.ECopyMgNewWorldBoss
            || curCopyType == ECopyType.ECopyMgBossLead
            || curCopyType == ECopyType.ECopyMgSecretBoss
            || curCopyType == ECopyType.ECopyMgDarkSecretBoss
            || curCopyType == ECopyType.ECopyMgCrossGuildBossIntruder
			|| curCopyType == ECopyType.ECopyMgNewBossHome
			|| curCopyType == ECopyType.ECopyMgMiningChallenge
			|| curCopyType == ECopyType.ECopyMgPersonalBoss
			|| curCopyType == ECopyType.ECopyNewCrossBoss
			|| curCopyType == ECopyType.ECopyMgNormalDefense
			|| curCopyType == ECopyType.ECopyMgQiongCangHall
			|| curCopyType == ECopyType.ECopyMgQiongCangAttic
			|| curCopyType == ECopyType.ECopyMgQiongCangDreamland
			|| curCopyType == ECopyType.ECopyLegend
			|| curCopyType == ECopyType.ECopyCrossTeam
			|| curCopyType == ECopyType.ECopyGuildTeam
			|| curCopyType == ECopyType.ECopyMgBossIntruder
			|| curCopyType == ECopyType.ECopyWorldBoss
			|| curCopyType == ECopyType.ECopyMgPeakArena;

		let isMaterialCopy:boolean = curCopyType == ECopyType.ECopyMgMaterial;

		let noAutoCopy:boolean = curCopyType == ECopyType.ECopyPosition//不需要自动必杀的类型
			|| curCopyType == ECopyType.ECopyCrossStair
			|| curCopyType == ECopyType.ECopyBattleBich
			|| curCopyType == ECopyType.ECopyMgNewGuildWar;

        return (!isInSpecialCopy && !isMaterialCopy && !noAutoCopy && this.isAutoXp)
			|| (isInSpecialCopy && this.specialCopyAutoXP)
			|| (isMaterialCopy && this.materialCopyAutoXP);
	}

    /**
     * 是否自动释放xp
     */
    public get isAutoXp():boolean {
    	return this.getValue(LocalEventEnum.AutoXP);
	}

    public set isAutoXp(value:boolean) {
    	this.setValue(LocalEventEnum.AutoXP, value);
	}

	public get isInit():boolean {
		return this._isInit;
	}

	public set autoCopy(value:boolean) {
    	if (value != this._autoCopy) {
            this._autoCopy = value;
            EventManager.dispatch(LocalEventEnum.AutoCopyStateChange);
		}
	}

	public get autoCopy():boolean {
		return this._autoCopy
	}

	public clear(): void {
		this._data = {};
	}
}