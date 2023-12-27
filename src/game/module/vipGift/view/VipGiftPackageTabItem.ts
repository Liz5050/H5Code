/**
 * VIP礼包item
 */
class VipGiftPackageTabItem extends ListRenderer {
	
	private _selected_1:boolean;
	private _selectedBg:fairygui.GImage;
	private _loaderIcon:GLoader;

	private _loaderV:GLoader;

	private _hasTip:boolean = false;

	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void{			
		this._selectedBg = this.getChild("img_selectedbg").asImage;
		this._loaderIcon = this.getChild("loader_icon") as GLoader;
		this._loaderV = this.getChild("loader_v") as GLoader;
	}

	public setData(data:any,index:number):void {		
		this._data = data;

		this._loaderIcon.load(URLManager.getModuleImgUrl("icon/order_" + data.order + ".png", PackNameEnum.VipGift));

		let vipLevel:number = CacheManager.vip.vipLevel;
		let vipLevelLimited:number = data.vipLevelLimited ? data.vipLevelLimited : 0;
		let gold:number = CacheManager.role.getMoney(EPriceUnit.EPriceUnitGold);
		this._loaderV.load(URLManager.getModuleImgUrl("vipgift_v" + vipLevelLimited + ".png", PackNameEnum.VipGift));

		this._hasTip = true;
		if(vipLevel < vipLevelLimited || gold < data.price) {
			this._hasTip = false;
		}
		else if(CacheManager.vipGift.hasBuy(EVipGiftPackageType.EVipGiftPackageTypeCommon, data.id)) {
			this._hasTip = false;
		}
		else if(!CacheManager.vipGift.canBuy(EVipGiftPackageType.EVipGiftPackageTypeCommon, data.id)) {
			this._hasTip = false;
		}
		CommonUtils.setBtnTips(this, this._hasTip, 74,7,false);
	}

	public set selected(value:boolean) {
		this._selected_1 = value;
		this._selectedBg.visible = value;
	}

	public get selected():boolean {
		return this._selected_1;
	}

	public get hasTip():boolean {
		return this._hasTip;
	}
	
}