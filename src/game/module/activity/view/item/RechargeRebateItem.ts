class RechargeRebateItem extends fairygui.GComponent {
	private c1:fairygui.Controller;
	private txt_condition:fairygui.GRichTextField;
	private txt_rechargeValue:fairygui.GRichTextField;
	private list_item:List;
	private btn_get:fairygui.GButton;
	private txt_fight:fairygui.GTextField;

	private _type:number;
	private _rechargeCfg:any;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void {
		super.constructFromXML(xml);
		this.c1 = this.getController("c1");
		this.txt_condition = this.getChild("txt_condition").asRichTextField;
		this.txt_rechargeValue = this.getChild("txt_rechargeValue").asRichTextField;
		this.list_item = new List(this.getChild("list_item").asList);
		this.btn_get = this.getChild("btn_get").asButton;
		this.btn_get.addClickListener(this.onGetRewardHandler,this);
		this.txt_fight = this.getChild("txt_fight").asTextField;
	}

	/**1每日充值 2七天累计充值 */
	public set type(value:number) {
		this._type = value;
	}

	public setData(data:any):void {
		this._rechargeCfg = data;
		if(!data) return;
		if(this._type == 1) {
			this.txt_condition.text = "今日累计充值<font color='#eee43f'>" + data.rechargeAmount + "</font>元宝领取";
		}
		else {
			this.txt_condition.text = "七日累计充值<font color='#eee43f'>" + data.rechargeAmount + "</font>元宝领取";
		}
		this.list_item.data = RewardUtil.getStandeRewards(data.rewards);
		this.txt_fight.text = "战力飙升：" + data.warfareShow;
	}
	
	public updateRechargeInfo():void {
		if(!this._rechargeCfg) return;
		let rechargeInfo:any = CacheManager.activity.rechargeInfo;
		let rechargeNum:number = 0;
		let hadGet:boolean = false;
		if(rechargeInfo != null) {
			if(this._type == 1) {
				rechargeNum = rechargeInfo.dayCount;
				hadGet = rechargeInfo.dayGet != 0;
			}
			else {
				rechargeNum = rechargeInfo.totalCount;
				hadGet = rechargeInfo.totalGet != 0;
			}
		}
		let needRecharge:number = this._rechargeCfg.rechargeAmount;
		// let color:number = rechargeNum >= needRecharge ? Color.Green2 : Color.Red;
		this.txt_rechargeValue.text = "已充值" + HtmlUtil.html(rechargeNum + "/" + needRecharge,Color.Color_6) + "元宝";
		if(hadGet) {
			//已领取
			this.c1.setSelectedIndex(2);
		}
		else {
			if(rechargeNum >= needRecharge) {
				//可领取
				this.c1.setSelectedIndex(1);
				App.DisplayUtils.grayButton(this.btn_get, false,false);
				CommonUtils.setBtnTips(this.btn_get,true);
			}
			else {
				//未达成
				this.c1.setSelectedIndex(0);
				App.DisplayUtils.grayButton(this.btn_get, true,true);
				CommonUtils.setBtnTips(this.btn_get,false);
			}
		}
	}

	private onGetRewardHandler():void {
		MoveMotionUtil.itemListMoveToBag(this.list_item.list._children,0,LayerManager.UI_Popup);
		ProxyManager.activity.getRechargeRebateReward(this._rechargeCfg.day);
	}
}