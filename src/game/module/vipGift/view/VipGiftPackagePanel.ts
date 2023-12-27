/**
 * VIP礼包界面
 */
class VipGiftPackagePanel extends BaseTabView {
	
	private _loaderTopTxt:GLoader;
	private _loaderLeftTxt:GLoader;
	private _loaderShow:GLoader;

	private _ListRewards:List;

	private _btnOpt:fairygui.GButton;

	private btnLeft:fairygui.GButton;
	private btnRight:fairygui.GButton;

	private _tabList:List;

	public constructor() {
		super();
	}

	public initOptUI(): void {

		this._loaderTopTxt = this.getGObject("loader_top") as GLoader;
		this._loaderLeftTxt = this.getGObject("loader_left") as GLoader;
		this._loaderShow = this.getGObject("loader_show") as GLoader;

		this._ListRewards = new List(this.getGObject("list_rewards").asList);

		this._btnOpt = this.getGObject("btn_opt").asButton;
		this._btnOpt.addClickListener(this.onOptBtnClick, this);

		this.btnLeft = this.getGObject("btn_left").asButton;
		this.btnLeft.addClickListener(this.onBtnLeftClick, this);
		this.btnRight = this.getGObject("btn_right").asButton;
		this.btnRight.addClickListener(this.onBtnRightClick, this);

		this._tabList = new List(this.getGObject("list_tab").asList);
		this._tabList.list.addEventListener(fairygui.ItemEvent.CLICK, this.onTabListSelect, this);
		this._tabList.list.scrollPane.addEventListener(fairygui.ScrollPane.SCROLL, this.onTabListScroll, this);
		this._tabList.list.scrollPane.addEventListener(fairygui.ScrollPane.SCROLL_END, this.onTabListScrollEnd, this);
		

	}

	//
	public updateAll(param:any = null): void {
		let vipLevel:number = -1;
		if(param) {
			vipLevel = param.vipLevel;
		}
		let datas:Array<any> = ConfigManager.vipGift.getVipGiftDatas(EVipGiftPackageType.EVipGiftPackageTypeCommon);
		this._tabList.data = datas
		
		let idx:number = 0;
		if(vipLevel == -1) {
			let data:any;
			for(let i=0; i<datas.length; i++) {
				data = datas[i];
				if(!CacheManager.vipGift.hasBuy(EVipGiftPackageType.EVipGiftPackageTypeCommon, data.id)) {
					idx = i;
					break;
				}
			}
		}
		else {
			idx = vipLevel - 1;
		}
		this._tabList.selectedIndex = idx;
		this._tabList.scrollToView(idx);

		this.updateSelectedData(this._tabList.selectedData);

		this.onTabListScroll();
		this.onTabListScrollEnd();
	}

	//礼包购买信息更新
	public updateGiftPackageInfo():void {
		this.updateAll();
	}

    /**
     * 飘道具
     */
    public updateItemGet():void {
        MoveMotionUtil.itemListMoveToBag(this._ListRewards.list._children);
    }

	private onOptBtnClick():void {
		let data:any = this._tabList.selectedData;
		if(CacheManager.vipGift.canBuy(EVipGiftPackageType.EVipGiftPackageTypeCommon, data.id)) {
			if(MoneyUtil.checkEnough(data.priceUnit, data.price)) {
				ProxyManager.vipGift.buyVipGiftPackage(data.id);
			}
		}
	}

	private onTabListSelect(e:fairygui.ItemEvent):void {
		let item:VipGiftPackageTabItem = <VipGiftPackageTabItem>e.itemObject;
		let data:any = item.getData();
		this.updateSelectedData(data);
	}

	private updateSelectedData(data:any):void {
		this._loaderTopTxt.load(URLManager.getModuleImgUrl("uitext/uitext_m" + data.order + ".png", PackNameEnum.VipGift));
		this._loaderLeftTxt.load(URLManager.getModuleImgUrl("uitext/uitext_l" + data.order + ".png", PackNameEnum.VipGift));
		this._loaderShow.load(URLManager.getModuleImgUrl("show/order_" + data.order + ".png", PackNameEnum.VipGift));

		this._ListRewards.data = RewardUtil.getStandeRewards(data.content);

		if(CacheManager.vipGift.hasBuy(EVipGiftPackageType.EVipGiftPackageTypeCommon, data.id)) {
			this._btnOpt.text = "已购买";
			App.DisplayUtils.grayButton(this._btnOpt,true,true);
			this._btnOpt.visible = true;
			//this._btnOpt.grayed = true;
			CommonUtils.setBtnTips(this._btnOpt, false);
		}
		else {
			if(CacheManager.vipGift.canBuy(EVipGiftPackageType.EVipGiftPackageTypeCommon, data.id)) {
				this._btnOpt.text = data.price + GameDef.EPriceUnitName[data.priceUnit];
				this._btnOpt.visible = true;
				//this._btnOpt.grayed = false;

				let vipLevel:number = CacheManager.vip.vipLevel;
				let vipLevelLimited:number = data.vipLevelLimited ? data.vipLevelLimited : 0;
				let gold:number = CacheManager.role.getMoney(EPriceUnit.EPriceUnitGold);
                App.DisplayUtils.grayButton(this._btnOpt,vipLevel < vipLevelLimited,false);
				if(vipLevel >= vipLevelLimited && gold >= data.price) {
					CommonUtils.setBtnTips(this._btnOpt, true);
				}
				else {
					CommonUtils.setBtnTips(this._btnOpt, false);
				}

			}
			else {
				this._btnOpt.visible = false;
			}
		}
	}

	private onBtnLeftClick():void {
		let idx:number = this._tabList.list.getFirstChildInView();
		idx -= 5;
		idx < 0 ? idx = 0 : null;
		
		this._tabList.scrollToView(idx, true, true);

		App.TimerManager.doDelay(800, this.onTabListScrollEnd, this);
	}

	private onBtnRightClick():void {
		let idx:number = this._tabList.list.getFirstChildInView();
		idx += 5;
		idx > this._tabList.data.length-1 ? idx = this._tabList.data.length-1 : null;
		
		this._tabList.scrollToView(idx, true, true);

		App.TimerManager.doDelay(800, this.onTabListScrollEnd, this);
	}

	private onTabListScroll():void {
		let percX:number = this._tabList.list.scrollPane.percX;

		if(percX == 0) {
			this.btnLeft.visible = false;
			this.btnRight.visible = true;
		}
		else if(percX == 1) {
			this.btnLeft.visible = true;
			this.btnRight.visible = false;
		}
		else {
			this.btnLeft.visible = true;
			this.btnRight.visible = true;
		}
	}

	private onTabListScrollEnd():void {
		let leftTip:boolean = false;
		let rightTip:boolean = false;
		let firstIdx:number = this._tabList.list.getFirstChildInView();
		let item:VipGiftPackageTabItem;
		for(let i=0; i < this._tabList.data.length; i++) {
			if(!this._tabList.isChildInView(i)) {
				item = this._tabList.list.getChildAt(this._tabList.list.itemIndexToChildIndex(i)) as VipGiftPackageTabItem;
				if(item && item.hasTip) {
					if(i <= firstIdx) {
						leftTip = true;
					}
					else {
						rightTip = true;
					}
				}
			}
		}
		CommonUtils.setBtnTips(this.btnLeft, leftTip);
		CommonUtils.setBtnTips(this.btnRight, rightTip, 0,0,false);
	}
	
}