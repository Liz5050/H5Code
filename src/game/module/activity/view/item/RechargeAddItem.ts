class RechargeAddItem extends ListRenderer {
	private c1:fairygui.Controller;
	private txt_title:fairygui.GRichTextField;
	private list_item:List;
	private btn_get:fairygui.GButton;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void {
		super.constructFromXML(xml);
		this.c1 = this.getController("c1");
		this.txt_title = this.getChild("txt_title").asRichTextField;
		this.list_item = new List(this.getChild("list_item").asList,{isShowName:false});
		this.btn_get = this.getChild("btn_get").asButton;
		this.btn_get.addClickListener(this.onClickHandler,this);
	}

	public setData(data:ActivityRewardInfo):void {
		this._data = data;
		this.list_item.data = data.getItemDatas();

		//conds索引对应意义 --- 世界等级上限,世界等级下限,充值数额,礼包价值,领取广播 
		let needRecharge:number = data.conds[2];
		let rechargeNum:number = Math.min(CacheManager.activity.addRechargeNum,needRecharge);
		this.txt_title.text = HtmlUtil.colorSubstitude(LangActivity.L19,rechargeNum,needRecharge)
		let getInfos:number[] = CacheManager.activity.getActivityGetRewardInfo(data.code);
		let hadGet:boolean = getInfos != null && getInfos[data.index] > 0;
		CommonUtils.setBtnTips(this.btn_get,false);
		if(hadGet) {
			//已领取
			this.c1.selectedIndex = 2;
		}
		else {
			if(CacheManager.activity.addRechargeNum >= needRecharge) {
				//可领取
				this.c1.selectedIndex = 1;
				CommonUtils.setBtnTips(this.btn_get,true);
			}
			else {
				//未达成
				this.c1.selectedIndex = 0;
			}
		}
	}

	private onClickHandler():void {
		if(this.c1.selectedIndex == 0) {
			HomeUtil.openRecharge();
			return;
		}
		MoveMotionUtil.itemListMoveToBag(this.list_item.list._children,0,LayerManager.UI_Popup);
		EventManager.dispatch(LocalEventEnum.ActivityGetReward,this._data.code,this._data.index);
	}
}