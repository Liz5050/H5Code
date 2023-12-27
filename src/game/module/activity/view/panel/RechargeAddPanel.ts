/**
 * 累计礼包（充值）
 */
class RechargeAddPanel extends ActivityBaseTabPanel{

	private static SHOWNAME_ITEM_ID:number[] = [12041205, 12050901, 12051001, 12041208];
	private bgLoader:GLoader;
	private progressBar:UIProgressBar;
	private txt_recharge:fairygui.GTextField;
	private list_item:List;
	private list_btn:List;
	private btnGet:fairygui.GButton;
	private playerShow:PlayerModel;
	private needRecharge:number;
	private txt_fight:fairygui.GTextField;
	private isCanGet:boolean = false;

	private getInfos:number[];

	private curReward:ActivityRewardInfo;
	private curIndex:number = -1;
	private curSelectBtn:RechargeAddBtnItem;
	public constructor() {
		super();
		this.activityType = ESpecialConditonType.ESpecialConditonTypeMgRecharge;
	}

	public initOptUI():void {
		super.initOptUI();
		this.bgLoader = this.getGObject("bg_loader") as GLoader;
		this.bgLoader.load(URLManager.getModuleImgUrl("activity_bg_2.jpg",PackNameEnum.Activity));

		this.progressBar = this.getGObject("progressBar") as UIProgressBar;
		this.progressBar.setStyle(URLManager.getCommonIcon("progressBar_4"),URLManager.getCommonIcon("bg_4"),643,30,4,4);
		this.progressBar.setValue(1,2);

		this.txt_recharge = this.getGObject("txt_recharge").asTextField;
		this.list_item = new List(this.getGObject("list_item").asList);
		this.list_btn = new List(this.getGObject("list_btn").asList);
		this.list_btn.list.addEventListener(fairygui.ItemEvent.CLICK,this.onSelectBtnChange,this);

		this.btnGet = this.getGObject("btn_get").asButton;
		this.btnGet.addClickListener(this.onGetRewardHandler,this);

		this.txt_fight = this.getGObject("txt_fight").asTextField;

		this.playerShow = new PlayerModel([EEntityAttribute.EAttributeClothes, EEntityAttribute.EAttributeWeapon]);
		let container:fairygui.GComponent = this.getGObject("model_container").asCom;
		(container.displayObject as egret.DisplayObjectContainer).addChild(this.playerShow);
	}

	public updateAll():void {
		super.updateAll();
		this.playerShow.updatePlayer(1000021);
		this.playerShow.updateWeapon(101005);
	}

	public updateActicityInfo(info:ActivityInfo):void {
		super.updateActicityInfo(info);
		let rewardInfos:ActivityRewardInfo[] = this.activityInfo.rewardInfos;
		this.list_btn.data = rewardInfos
		
		this.getInfos = CacheManager.activity.getActivityGetRewardInfo(this.activityInfo.code);
		let index:number = 0;
		for(let i:number = 0; i < rewardInfos.length; i++) {
			if(rewardInfos[i].hadGetCount > 0) continue;
			index = i;
			break;
		}
		this.setIndex(index);
		this.list_btn.scrollToView(index);
	}

	private onSelectBtnChange(evt:egret.TouchEvent):void {
		let index:number = this.list_btn.selectedIndex;
		this.setIndex(index);
	}

	private setIndex(index:number):void {
		if(this.curIndex == index) return;
		this.clearCurIndex();
		this.curIndex = index;
		this.curSelectBtn = this.list_btn.list.getChildAt(this.curIndex) as RechargeAddBtnItem;
		this.curSelectBtn.btnSelected = true;

		this.curReward = this.activityInfo.rewardInfos[this.curIndex];
		this.txt_fight.text = this.curReward.conds[5] + "";
		let itemDatas:ItemData[] = this.curReward.getItemDatas();
		this.list_item.data = itemDatas;
		// let fashionIndex:number = 0;
		// for(let itemData of itemDatas) {
		// 	let itemCfg:any = itemData.getItemInfo();
		// 	if(itemCfg.category == ECategory.ECategoryEquip) {
		// 		if(itemCfg.modelId) {
		// 			if(itemCfg.type == EEquip.EEquipWeapon) {
		// 				this.playerShow.updateWeapon(itemCfg.modelId);
		// 				fashionIndex++;
		// 			}
		// 			else if(itemCfg.type == EEquip.EEquipClothes) {
		// 				this.playerShow.updatePlayer(itemCfg.modelId);
		// 				fashionIndex++;
		// 			}
		// 		}
		// 	}
		// 	else if(itemCfg.type == EProp.EPropFashion){
		// 		let fashionCfg:any = ConfigManager.mgFashion.getFashionByItemCode(itemCfg.code);
		// 		if(fashionCfg) {
		// 			if(fashionCfg.type == 1) {
		// 				this.playerShow.updatePlayer(fashionCfg.modelId);
		// 				fashionIndex++;
		// 			}
		// 			else if(fashionCfg.type == 2){
		// 				this.playerShow.updateWeapon(fashionCfg.modelId);
		// 				fashionIndex++;
		// 			}
		// 		}
		// 	}
		// 	if(fashionIndex == 2) break;
		// }
		this.updateRechargeNum();

        let childIndex:number = 0;
        let item:BaseItem;
		while (childIndex < this.list_item.list.numChildren) {//部分特殊的要显示名字
            item = this.list_item.list.getChildAt(childIndex) as BaseItem;
			
            if (RechargeAddPanel.SHOWNAME_ITEM_ID.indexOf(item.itemData.getCode()) != -1)
                item.setNameText(item.itemData.getName(true));
            childIndex++;
        }
	}

	public updateRewardGetInfo():void {
		this.getInfos = CacheManager.activity.getActivityGetRewardInfo(this.activityInfo.code);
		this.updateCurRewardState();
		this.checkTabBtnTips();
		
		let index:number = 0;
		for(let i:number = 0; i < this.activityInfo.rewardInfos.length; i++) {
			if(this.activityInfo.rewardInfos[i].hadGetCount > 0) continue;
			index = i;
			break;
		}
		this.setIndex(index);
		this.list_btn.scrollToView(index);
	}

	public updateRechargeNum():void {
		//conds索引对应意义 --- 世界等级上限,世界等级下限,充值数额,礼包价值,领取广播 
		this.needRecharge = this.activityInfo.rewardInfos[this.curIndex].conds[2];
		this.txt_recharge.text = "已充值" + CacheManager.activity.addRechargeNum + "/" + this.needRecharge + "元宝";
		this.progressBar.setValue(CacheManager.activity.addRechargeNum,this.needRecharge);
		this.updateCurRewardState();
		this.checkTabBtnTips();
	}

	private updateCurRewardState():void {
		let hadGet:boolean = this.getInfos != null && this.getInfos[this.curIndex] > 0;
		this.isCanGet = false;
		if(hadGet) {
			//已领取
			this.btnGet.title = LangActivity.LANG9;
			App.DisplayUtils.grayButton(this.btnGet, true, true);
		}
		else {
			App.DisplayUtils.grayButton(this.btnGet, false, false);
			if(CacheManager.activity.addRechargeNum >= this.needRecharge) {
				//可领取
				this.isCanGet = true;
				this.btnGet.title = LangActivity.LANG2;
				// App.DisplayUtils.grayButton(this.btnGet, false, false);
			}
			else {
				//未达成
				this.btnGet.title = LangActivity.LANG11;
				// App.DisplayUtils.grayButton(this.btnGet, true, true);
			}
		}
	}

	private checkTabBtnTips():void {
		let rechargeNum:number = CacheManager.activity.addRechargeNum;
		for(let i:number = 0; i < this.activityInfo.rewardInfos.length; i++) {
			let rewardInfo:ActivityRewardInfo = this.activityInfo.rewardInfos[i];
			let hadGet:boolean = this.getInfos != null && this.getInfos[i] > 0;
			let btnItem:RechargeAddBtnItem = this.list_btn.list.getChildAt(i) as RechargeAddBtnItem;
			CommonUtils.setBtnTips(btnItem,rechargeNum >= rewardInfo.conds[2] && !hadGet);
		}
	}

	private onGetRewardHandler():void {
		if(!this.isCanGet) {
			HomeUtil.openRecharge();
			return;
		}
		EventManager.dispatch(LocalEventEnum.ActivityGetReward,this.activityInfo.code,this.curIndex);
	}

	private clearCurIndex():void {
		if(this.curIndex != -1) {
			this.curSelectBtn.btnSelected = false;
			this.list_item.data = null;
			// this.playerShow.updatePlayer(0);
			// this.playerShow.updateWeapon(0);
			this.curIndex = -1;
		}
	}

	public hide():void {
		super.hide();
		this.clearCurIndex();
		this.playerShow.updatePlayer(0);
		this.playerShow.updateWeapon(0);
	}
}