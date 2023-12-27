class ActivityUpgradeLvItem extends ListRenderer {
	private c1:fairygui.Controller;
	private txt_target:fairygui.GTextField;
	private txt_targetValue:fairygui.GTextField;
	private list_item:List;
	private btnGet:fairygui.GButton;
	private txt_leftCount:fairygui.GTextField;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void {
		super.constructFromXML(xml);
		this.c1 = this.getController("c1");
		this.txt_target = this.getChild("txt_target").asTextField;
		this.txt_targetValue = this.getChild("txt_targetValue").asTextField;
		this.txt_leftCount = this.getChild("txt_leftCount").asTextField;
		this.list_item = new List(this.getChild("list_item").asList);
		this.btnGet = this.getChild("btn_get").asButton;
		this.btnGet.addClickListener(this.onGetRewardHandler,this);
	}

	public setData(data: any): void{
		let strs: Array<string> = data.rewardStr.split("#");
		this._data = data;
		let items:ItemData[] = [];
		for(let i:number = 0; i < strs.length; i++) {
			if(strs[i] == "") continue;
			items.push(RewardUtil.getReward(strs[i]));
		}
		this.list_item.data = items;
		
		let roleState:number = Math.floor(data.level/10000);
		let level:number = data.level - roleState*10000;
		if(roleState <= 0) {
			this.txt_target.text = "等  级";
			this.txt_targetValue.text = level + "级";
		}
		else {
			this.txt_target.text = "转  生";
			if(level <= 0) {
				this.txt_targetValue.text = roleState + "转";
			}
			else {
				this.txt_targetValue.text = roleState + "转" + level + "级";
			}
		}

		let remainNum: number = CacheManager.welfare.getRemainNum(data);
		if(remainNum < 0){
			this.txt_leftCount.visible = false;
		}
		else {
			this.txt_leftCount.visible = true;
			this.txt_leftCount.text = `剩余${remainNum}份`;
		}
		CommonUtils.setBtnTips(this.btnGet,false);
		let myValue:number = CacheManager.role.getRoleState() * 10000 + CacheManager.role.getRoleLevel();
		if(myValue >= data.level){
			if(CacheManager.welfare.levelReward[data.level]){
				//已领取
				this.c1.setSelectedIndex(3);
				App.DisplayUtils.grayButton(this.btnGet, true,true);
			}
			else {
				if(CacheManager.welfare.getRemainNum(data) == 0) {
					//已领完
					this.c1.setSelectedIndex(2);
					App.DisplayUtils.grayButton(this.btnGet, true,true);
				}
				else {
					//可领取
					this.c1.setSelectedIndex(1);
					App.DisplayUtils.grayButton(this.btnGet, false,false);
					CommonUtils.setBtnTips(this.btnGet,true);
				}
			}
		}
		else {
			//未达成
			this.c1.setSelectedIndex(0);
			App.DisplayUtils.grayButton(this.btnGet, true,true);
		}
	}

	private onGetRewardHandler():void {
		let items:ItemData[] = this.list_item.data;
		let hasEquip:boolean = false;
		let equipNum:number = 0;
		for(let itemData of items) {
			if(itemData.getCategory() == ECategory.ECategoryEquip) {
				equipNum ++;
			}
		}
		
		if(CacheManager.pack.backPackCache.isHasCapacity(equipNum)) {
			MoveMotionUtil.itemListMoveToBag(this.list_item.list._children,0,LayerManager.UI_Popup);
		}
		ProxyManager.welfare.getLevelGiftReward(this._data.level);
		// EventManager.dispatch(LocalEventEnum.ActivityGetReward,this._data.code,this._data.conds[0]);
	}
}