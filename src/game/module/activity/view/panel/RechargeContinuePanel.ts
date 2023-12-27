/**
 * 连续充值
 */
class RechargeContinuePanel extends ActivityBaseTabPanel {
	private c1:fairygui.Controller;
	private bgLoader:GLoader;
	private gift_loader:GLoader;
	private titleLoader:GLoader;
	private list_item:List;
	private progressBar:UIProgressBar;
	private rewardBtns:RewardButton[];
	private btnGet:fairygui.GButton;
	// private playerShow:PlayerModel;
	private modelShow:ModelShow;
	private modelContainer:fairygui.GComponent;
	private txt_fight:fairygui.GTextField;

	private curIndex:number = -1;
	private curReward:ActivityRewardInfo;
	private isCanGet:boolean = false;
	private getInfos:number[];
	public constructor() {
		super();
		this.activityType = ESpecialConditonType.ESpecialConditonTypeRechargeCondDayCount;
	}

	public initOptUI():void {
		super.initOptUI();
		this.c1 = this.getController("c1");
		this.bgLoader = this.getGObject("bg_loader") as GLoader;
		this.bgLoader.load(URLManager.getModuleImgUrl("activity_bg_1.jpg",PackNameEnum.Activity));
		this.titleLoader = this.getGObject("title_loader") as GLoader;
		this.titleLoader.load(URLManager.getModuleImgUrl("continueRechargeTitle.png",PackNameEnum.Activity));
		this.gift_loader = this.getGObject("gift_loader") as GLoader;
		this.gift_loader.load(URLManager.getModuleImgUrl("continueBg.png",PackNameEnum.Activity));

		this.list_item = new List(this.getGObject("list_item").asList);

		this.progressBar = this.getGObject("progressBar") as UIProgressBar;
		this.progressBar.setStyle(URLManager.getCommonIcon("progressBar_4"),URLManager.getCommonIcon("bg_4"),382,24,1,1);
		this.progressBar.setValue(2,6);

		this.txt_fight = this.getGObject("txt_fight").asTextField;

		this.rewardBtns = [];
		for(let i:number = 0; i < 2; i++) {
			let btn:RewardButton = this.getGObject("btn_reward_" + i) as RewardButton;
			btn.addClickListener(this.onGiftSwitchHandler,this);
			this.rewardBtns.push(btn);
		}

		this.btnGet = this.getGObject("btn_get").asButton;
		this.btnGet.addClickListener(this.onGetRewardHandler,this);

		this.modelShow = new ModelShow(EShape.ECustomPlayer);
		// this.playerShow = new PlayerModel([EEntityAttribute.EAttributeClothes, EEntityAttribute.EAttributeWeapon]);
		this.modelContainer = this.getGObject("model_container").asCom;
		(this.modelContainer.displayObject as egret.DisplayObjectContainer).addChild(this.modelShow);
	}

	public updateAll():void {
		super.updateAll();
	}

	public updateActicityInfo(info:ActivityInfo):void {
		super.updateActicityInfo(info);
		this.updateRechargeDay();
		// for(let i:number = 0; i < info.rewardInfos.length; i++) {
		// 	this.rewardBtns[i].setData(info.rewardInfos[i]);
		// }
		// this.getInfos = CacheManager.activity.getActivityGetRewardInfo(this.activityInfo.code);
		// this.progressBar.setValue(CacheManager.activity.rechargeDay,6);
		// this.autoSwitchIndex();
	}

	public updateRewardGetInfo():void {
		//每日充值下限,达标天数
		this.getInfos = CacheManager.activity.getActivityGetRewardInfo(this.activityInfo.code);
		this.updateGetBtnState();

		for(let i:number = 0; i < this.activityInfo.rewardInfos.length; i++) {
			this.rewardBtns[i].setData(this.activityInfo.rewardInfos[i]);
		}
		this.autoSwitchIndex();
	}

	private updateGetBtnState():void {
		let hadGet:boolean = this.getInfos != null && this.getInfos[this.curIndex] > 0;
		this.isCanGet = false;
		if(hadGet) {
			//已领取
			this.btnGet.title = LangActivity.LANG9;
			App.DisplayUtils.grayButton(this.btnGet, true, true);
		}
		else {
			App.DisplayUtils.grayButton(this.btnGet, false, false);
			if(this.curReward && CacheManager.activity.rechargeDay >= this.curReward.conds[1]) {
				//可领取
				this.btnGet.title = LangActivity.LANG2;
				// App.DisplayUtils.grayButton(this.btnGet, false, false);
				this.isCanGet = true;
			}
			else{
				//未达成
				this.btnGet.title = LangActivity.LANG11;
				// App.DisplayUtils.grayButton(this.btnGet, true, true);
			}
		}
	}

	private autoSwitchIndex():void {
		let index:number = 0;
		for(let i:number = 0; i < this.activityInfo.rewardInfos.length; i++) {
			let hadGet:boolean = this.getInfos != null && this.getInfos[i] > 0;
			if(hadGet) continue;
			index = i;
			break;
		}
		this.setIndex(index);
	}

	private onGiftSwitchHandler(evt:egret.TouchEvent):void {
		let btn:RewardButton= evt.currentTarget as RewardButton;
		let index:number = this.rewardBtns.indexOf(btn);
		this.setIndex(index);
	}

	private setIndex(index:number):void {
		if(this.curIndex == index) return;
		if(this.curIndex != -1) {
			this.curReward = null;
			this.list_item.data = null;
			this.rewardBtns[this.curIndex].selected = false;
		}
		this.curIndex = index;
		this.c1.selectedIndex = index;
		this.rewardBtns[this.curIndex].selected = true;
		if(index < this.activityInfo.rewardInfos.length) {
			this.curReward = this.activityInfo.rewardInfos[index];
		}
		this.modelShow.reset();
		this.txt_fight.text = "";
		if(this.curReward) {
			this.txt_fight.text = "" + this.curReward.conds[3];
			let itemDatas:ItemData[] = this.curReward.getItemDatas();
			this.list_item.data = itemDatas;
			if(index == 1) {
				//6天奖励模型展示
				let modelId:number = -1;
				let fashionType:number;
				let itemCfg:any = itemDatas[0].getItemInfo();
				if(itemCfg.category == ECategory.ECategoryEquip) {
					if(itemCfg.modelId) {
						modelId = itemCfg.modelId;
						if(itemCfg.type == EEquip.EEquipClothes) {
							fashionType = 1;
						}
						else if(itemCfg.type == EEquip.EEquipWeapon) {
							fashionType = 2;
						}
					}
				}
				else {
					let fashionCfg:any = ConfigManager.mgFashion.getFashionByItemCode(itemCfg.code);
					if(fashionCfg) {
						modelId = fashionCfg.modelId;
						fashionType = fashionCfg.type;
					}
				}
				if(modelId != -1) {
					this.modelShow.x = 0;
					this.modelShow.y = 0;
					this.modelShow.scaleX = this.modelShow.scaleY = 1;
					if(fashionType == 1) {
						this.modelShow.setShowType(EShape.ECustomPlayer);
						this.modelShow.setData(modelId);
					}
					else if(fashionType == 2) {
						this.modelShow.setShowType(EShape.EShapeMagic);
						this.modelShow.setData(modelId);
						
						// if(Number(modelId) == 1010004) {
						// 	this.modelShow.y = -60;
						// 	this.modelShow.x = 160;
						// }
						// else {
						// 	this.modelShow.y = 20;
						// 	this.modelShow.x = 150;
						// }
						this.modelShow.y = -60;
						this.modelShow.x = 160;
					}
					else if(fashionType == 3) {
						this.modelShow.setShowType(EShape.EShapeWing);
						this.modelShow.setData(modelId);
						this.modelShow.scaleX = this.modelShow.scaleY = 0.7;
					}
				}
			}
		}
		this.updateGetBtnState();
	}

	public updateRechargeDay():void {
		this.progressBar.setValue(CacheManager.activity.rechargeDay,6);
		this.updateRewardGetInfo();
	}

	private onGetRewardHandler():void {
		if(!this.isCanGet) {
			HomeUtil.openRecharge();
			return;
		}
		EventManager.dispatch(LocalEventEnum.ActivityGetReward,this.activityInfo.code,this.curIndex);
	}

	public hide():void {
		super.hide();
		this.modelShow.reset();
		if(this.curIndex != -1) {
			this.rewardBtns[this.curIndex].selected = false;
			this.curIndex = -1;
		}
	}
}