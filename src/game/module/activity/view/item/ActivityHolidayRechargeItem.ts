class ActivityHolidayRechargeItem extends ListRenderer {
	private c1:fairygui.Controller;
	private c2:fairygui.Controller;
	private txt_day:fairygui.GTextField;
	private txt_rechargeDay:fairygui.GTextField;
	private txt_rechargeProgress:fairygui.GRichTextField;
	private list_item:List;
	private btn_get:fairygui.GButton;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
		this.c1 = this.getController("c1");
		this.c2 = this.getController("c2");
		this.txt_day = this.getChild("txt_day").asTextField;
		this.txt_rechargeDay = this.getChild("txt_rechargeDay").asTextField;
		this.txt_rechargeProgress = this.getChild("txt_rechargeProgress").asRichTextField;
		this.list_item = new List(this.getChild("list_item").asList);
		this.btn_get = this.getChild("btn_get").asButton;
		this.btn_get.addClickListener(this.onClickHandler,this);
	}

	public setData(data:any):void {
		this._data = data;
		this.list_item.data = RewardUtil.getStandeRewards(data.rewards);
		this.txt_day.text = App.StringUtils.substitude(LangActivity.L24,data.day);
		this.txt_rechargeDay.text = HtmlUtil.colorSubstitude(LangActivity.L22,data.rechargeDays);
		let state:number = CacheManager.activity.holidayRechargeGetState(this._data.code,this._data.id);
		this.c1.selectedIndex = state;
		if(data.type == 1) {
			this.c2.selectedIndex = 0;
			this.btn_get.visible = true;
		}
		else {
			this.c2.selectedIndex = 1;
			this.btn_get.visible = state == 1;
			this.txt_rechargeProgress.visible = state == 0;
			let rechargeDay:number = CacheManager.activity.getHolidayRechargeDay(this._data.rechargeAmount);
			let color:string = rechargeDay >= this._data.rechargeDays ? Color.Color_6 : Color.Color_4;
			this.txt_rechargeProgress.text = HtmlUtil.colorSubstitude(LangActivity.L21,rechargeDay,this._data.rechargeDays,color);
		}
		CommonUtils.setBtnTips(this.btn_get,state == 1);
	}

	private onClickHandler():void {
		if(this.c1.selectedIndex == 0) {
			HomeUtil.openRecharge();
			return;
		}
		MoveMotionUtil.itemListMoveToBag(this.list_item.list._children,0,LayerManager.UI_Popup);
		ProxyManager.activity.getHolidayRechargeReward(this._data.code,this._data.id);
	}
}