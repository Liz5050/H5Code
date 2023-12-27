class ActivityUpgradeFaBaoItem extends ListRenderer {
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

	public setData(data: ActivityRewardInfo): void{
		// CacheManager.magicWeaponStrengthenCache
		this._data = data;
		let fabaoLv:number = data.conds[1];
		let shapeInfo:any = CacheManager.magicWeaponStrengthen.shapeInfo;
		let myLv:number = shapeInfo != null ? shapeInfo.level_I : 0;
		let fabaoCfg:any = ConfigManager.mgShape.getByShapeAndLevel(EShape.EShapeSpirit , fabaoLv);
		let star:number = fabaoCfg.star > 0 ? fabaoCfg.star : 0;
		this.txt_targetValue.text = fabaoCfg.stage + "阶" + star + "星";
		this.list_item.data = data.getItemDatas();

		let leftCount:number = data.conds[2] - CacheManager.activity.getActivityRewardGetNum(data.code,data.conds[0]);
		if(leftCount <= 0) {
			this.txt_leftCount.text = "";
		}
		else {
			this.txt_leftCount.text = "剩余" + leftCount + "份";
		}
		CommonUtils.setBtnTips(this.btnGet,false);

		if(data.hadGetCount > 0) {
			//已领取
			this.c1.setSelectedIndex(3);
			App.DisplayUtils.grayButton(this.btnGet, true,true);
		}
		else {
			if(leftCount > 0) {
				if(myLv >= fabaoLv) {
					//可领取
					this.c1.setSelectedIndex(1);
					App.DisplayUtils.grayButton(this.btnGet, false,false);
					CommonUtils.setBtnTips(this.btnGet,true);
				}
				else {
					//未达成
					this.c1.setSelectedIndex(0);
					App.DisplayUtils.grayButton(this.btnGet, true,true);
				}
			}
			else {
				//已领完
				this.c1.setSelectedIndex(2);
				App.DisplayUtils.grayButton(this.btnGet, true,true);
			}
		}
	}

	private onGetRewardHandler():void {
		MoveMotionUtil.itemListMoveToBag(this.list_item.list._children,0,LayerManager.UI_Popup);
		EventManager.dispatch(LocalEventEnum.ActivityGetReward,this._data.code,this._data.conds[0]);
	}
}