class PreferentialGiftPanelII extends ActivityBaseTabPanel {
	private c1:fairygui.Controller;
	private bgLoader:GLoader;
	private gift_loader:GLoader;
	private giftBtns:fairygui.GButton[];
	private txtTitle:fairygui.GRichTextField;
	private list_item:List;
	private btnBuy:fairygui.GButton;
	// private txt_value:fairygui.GRichTextField;
	// private playerShow:ModelShow;

	private curIndex:number = -1;
	private curReward:ActivityRewardInfo;
	public constructor() {
		super();
		this.activityType = ESpecialConditonType.ESpecialConditionTypePreferentialGiftNormal;
	}

	public initOptUI():void {
		super.initOptUI();
		this.c1 = this.getController("c1");
		this.timeTitleStr = "";
		this.bgLoader = this.getGObject("bg_loader") as GLoader;
		this.bgLoader.load(URLManager.getModuleImgUrl("activity_bg_1.jpg",PackNameEnum.Activity));
		this.gift_loader = this.getGObject("gift_loader") as GLoader;
		this.txtTitle = this.getGObject("txt_title").asRichTextField;
		this.list_item = new List(this.getGObject("list_item").asList);
		this.btnBuy = this.getGObject("btn_buy").asButton;
		this.btnBuy.addClickListener(this.onBuyHandler,this);
		// this.txt_value = this.getGObject("txt_value").asRichTextField;

		this.giftBtns = [];
		for(let i:number = 0; i < 3; i++) {
			let btn:fairygui.GButton = this.getGObject("btn_gift_" + i).asButton;
			btn.addClickListener(this.onGiftSwitchHandler,this);
			this.giftBtns.push(btn);
		}

		// this.playerShow = new ModelShow(EShape.EShapeWing);
		// let container:fairygui.GComponent = this.getGObject("model_container").asCom;
		// (container.displayObject as egret.DisplayObjectContainer).addChild(this.playerShow);
	}

	public updateAll():void {
		super.updateAll();
	}

	public updateActicityInfo(info:ActivityInfo):void {
		super.updateActicityInfo(info);
		// this.playerShow.setData(4005);
		let hadGetList:number[] = CacheManager.activity.getActivityGetRewardInfo(this.activityInfo.code);
		let index:number = 0;
		if(hadGetList) {
			for(let i:number = 0; i < 3; i++) {
				if(!hadGetList[i]) {
					index = i
					break;
				}
			}
		}
		this.setIndex(index);
		let rewardInfos:ActivityRewardInfo[] = this.activityInfo.rewardInfos;
		for(let i:number = 0; i < rewardInfos.length; i++) {
			let cfg:any = ConfigManager.activitySeven.getPreferentialGiftCfg(rewardInfos[i].conds[3]);
			if(cfg) {
				this.giftBtns[i].title = cfg.name;
				this.giftBtns[i].icon = URLManager.getPackResUrl(PackNameEnum.ActivityII,"gift_" + cfg.resourceId);
			}
		}
	}

	private onGiftSwitchHandler(evt:egret.TouchEvent):void {
		let btn:fairygui.GButton = evt.currentTarget as fairygui.GButton;
		let index:number = this.giftBtns.indexOf(btn);
		this.setIndex(index);
	}

	private setIndex(index:number):void {
		if(this.curIndex == index) return;
		if(this.curIndex != -1) {
			this.curReward = null;
			this.list_item.data = null;
			this.txtTitle.text = "";
			this.giftBtns[this.curIndex].selected = false;
		}
		this.curIndex = index;
		this.giftBtns[this.curIndex].selected = true;
		if(index < this.activityInfo.rewardInfos.length) {
			this.curReward = this.activityInfo.rewardInfos[index];
		}
		
		if(this.curReward) {
			let cfg:any = ConfigManager.activitySeven.getPreferentialGiftCfg(this.curReward.conds[3]);
			this.list_item.data = this.curReward.getItemDatas();
			let giftName:string = "";
			let resourceId:number = 1;
			if(cfg) {
				giftName = cfg.name;
				resourceId = cfg.resourceId;
			}
			this.txtTitle.text = "花费" + HtmlUtil.html(this.curReward.conds[0] + "",Color.Color_6) + "元宝即可购买价值" + HtmlUtil.html(this.curReward.conds[2] + "",Color.Color_6) + "元宝" + giftName;//HtmlUtil.html(this.getGiftNameByIndex(index),Color.Green2);
			// this.txt_value.text = "价值：" + this.curReward.conds[2];
			this.gift_loader.load(URLManager.getModuleImgUrl("gift_" + resourceId + ".png",PackNameEnum.Activity));
		}
		this.updateRewardGetInfo(false);
	}

	public updateRewardGetInfo(isAuto:boolean = true):void {
		let hadGetList:number[] = CacheManager.activity.getActivityGetRewardInfo(this.activityInfo.code);
		if(hadGetList && hadGetList[this.curIndex] > 0) {
			this.c1.selectedIndex = 1;
			if(isAuto) {
				let index:number = 0;
				for(let i:number = 0; i < 3; i++) {
					if(!hadGetList[i]) {
						index = i;
						break;
					}
				}
				this.setIndex(index);
			}
		}
		else {
			this.c1.selectedIndex = 0;
			CommonUtils.setBtnTips(this.btnBuy,MoneyUtil.checkEnough(EPriceUnit.EPriceUnitGold,this.curReward.conds[0],false));
		}
	}

	private getGiftNameByIndex(index:number):string {
		switch(index) {
			case 0:
				return "坐骑礼包";
			case 1:
				return "心法礼包";
			case 2:
				return "符文礼包";
			case 3:
				return "翅膀礼包";
		}
	}

	private onBuyHandler():void {
		if(this.curReward) {
			if(!MoneyUtil.checkEnough(EPriceUnit.EPriceUnitGold,this.curReward.conds[0])) {
				return;
			}
			MoveMotionUtil.itemListMoveToBag(this.list_item.list._children,0,LayerManager.UI_Popup);
			EventManager.dispatch(LocalEventEnum.ActivityGetReward,this.activityInfo.code,this.curIndex);
		}
	}

	public hide():void {
		super.hide();
		if(this.curIndex != -1) {
			this.giftBtns[this.curIndex].selected = false;
			this.curIndex = -1;
		}
		// this.playerShow.reset();
	}
}