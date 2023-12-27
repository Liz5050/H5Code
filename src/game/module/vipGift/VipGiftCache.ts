/**
 * vip礼包数据
 */
class VipGiftCache implements ICache
{   
	
	private _inited:boolean = false;
	private _infoDic:any = {};
	private _detailDic:any = {};

	private _hasBuyAll:boolean = false;
    public tabFlag:boolean = true;//Vip礼包标签红点

	public constructor()
	{
	}

	public get inited():boolean {
		return this._inited;
	}

	//数据下推
	public setVipGiftInfo(dic:any):void {
		this._inited = true;
		this._infoDic = dic;
		this.updateDetailDic();
	}

	//数据更新
	public updateVipGiftInfo(data:any):void {
		this._infoDic[data.type_I] = data;
		this.updateDetailDic();
	}

	private updateDetailDic():void {
		for(let k in this._infoDic) {
			let data = this._infoDic[k];
			for(let info of data.detailInfos.data) {
				this._detailDic[info.id_I] = info.buyTimes_I;
			}
		}
	}

	//是否已购买
	public hasBuy(type:number, id:number):boolean {
		let cfgData:any = ConfigManager.vipGift.getByPk(id);
		if(cfgData && this._detailDic[id] && this._detailDic[id] >= cfgData.buyLimited) {
			return true;
		}
		return false;
	}

	//是否可购买(不判断vip等级)
	public canBuy(type:number, id:number):boolean {
		let cfgData:any = ConfigManager.vipGift.getByPk(id);
		if(cfgData.preIdLimited) {
			let preCfgData:any = ConfigManager.vipGift.getByPk(cfgData.preIdLimited);
			if(this.hasBuy(type, preCfgData.id)) {
				return true;
			}
			else {
				return false;
			}
		}
		else{
			return true;
		}
	}

	//是否已购买全部礼包
	public hasBuyAll():boolean {
		if(this._hasBuyAll) {
			return true;
		}

		let cfgDatas:any = ConfigManager.vipGift.getDict();
		let cfgData:any;
		let buyTimes:number;
		for(let key in cfgDatas) {
			cfgData = cfgDatas[key];
			buyTimes = this._detailDic[cfgData.id] ? this._detailDic[cfgData.id] : 0;
			if(buyTimes < cfgData.buyLimited) {
				return false;
			}
		}
		this._hasBuyAll = true;
		return true;
	}

	//是否有可购买的礼包
	public checkVipGiftTips(type:number = -1):boolean {
		if(!ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.VipGiftPackage],false)) {
			return false;
		}
		let vipLevel:number = CacheManager.vip.vipLevel;
		let cfgDatas:any = ConfigManager.vipGift.getDict();
		let cfgData:any;
		let buyTimes:number;
		let vipLevelLimited:number;
		let gold:number = CacheManager.role.getMoney(EPriceUnit.EPriceUnitGold);
		for(let key in cfgDatas) {
			cfgData = cfgDatas[key];
			if(type == -1 || type == cfgData.type) {
				buyTimes = this._detailDic[cfgData.id] ? this._detailDic[cfgData.id] : 0;
				vipLevelLimited = cfgData.vipLevelLimited ? cfgData.vipLevelLimited : 0;
				if(buyTimes < cfgData.buyLimited && vipLevel >= vipLevelLimited && gold >= cfgData.price) {
					return true;
				}
			}
		}
		return false;
	}

	public clear(): void
	{

	}

}