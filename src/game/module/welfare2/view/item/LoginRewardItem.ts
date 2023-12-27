class LoginRewardItem extends ListRenderer {
    private baseItem: BaseItem;
	private dayTxt: fairygui.GTextField;
	private statusController: fairygui.Controller;
	private mc: UIMovieClip;
	private goldMc: UIMovieClip;

	private isCanSign: boolean;
	private isRewardGot: boolean;

    public constructor() {
        super();
    }

    protected constructFromXML(xml:any):void {
        super.constructFromXML(xml);
        this.baseItem = <BaseItem>this.getChild("baseItem");
		this.dayTxt = this.getChild("txt_day").asTextField;
		this.baseItem.touchable = false;
		this.statusController = this.getController("c1");
		// this.vipController = this.getController("c2");
		// this.addClickListener(this.click, this);
    }

    public setData(data:any):void{
		this._data = data;
		this.isRewardGot = CacheManager.welfare2.isLoginRewardGot(data.day);

		let rewardArr: Array<any> = data.rewardStr.split("#");
		if(data.day == 14 && data.continueLoginReward != null) {
            rewardArr = data.continueLoginReward.split("#");
        }
		this.baseItem.isShowEffect = !this.isRewardGot;
		this.baseItem.itemData = RewardUtil.getReward(rewardArr[0]);
		this.dayTxt.text = `第${GameDef.NumberName[data.day]}天`;
		this.statusController.selectedIndex = this.isRewardGot ? 1 : 0;
	}
}