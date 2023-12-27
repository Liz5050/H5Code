/**
 * 签到
 */
class SignInDaysItem extends ListRenderer {

    private c1 : fairygui.Controller;
    private c2 : fairygui.Controller;
    private dayTxt : fairygui.GTextField;
    private restDayTxt : fairygui.GTextField;
    // private getRewardDay: number = 0;
    private mc : UIMovieClip;
    private baseItem : BaseItem;
    
    private isCanGetReward: boolean;

    public constructor() {
        super();
    }

    protected constructFromXML(xml:any):void {
        super.constructFromXML(xml);
        this.c1 = this.getController("c1");
        this.c2 = this.getController("c2");

        this.dayTxt = this.getChild("txt_day").asTextField;
        this.restDayTxt = this.getChild("txt_restDay").asTextField;
        this.baseItem = <BaseItem>this.getChild("baseItem");
        this.baseItem.isShowName = false;
        this.baseItem.touchable = false;
        // this.baseItem.isNameCount = false;
        // this.can_get = this.getChild("can_get").asImage;
        this.addClickListener(this.getReward,this);
        
    }

    public setData(data:any):void {
        //this.removeEffect();
        this._data = data;
        let str: Array<string> = data.rewardStr.split("#");
		let itemData: ItemData = RewardUtil.getReward(str[0]);
        this.baseItem.itemData = itemData;
        this.dayTxt.text = `第${data.accDay}天`;


        let getSignRewardDay: number = CacheManager.welfare2.getSignRewardDay;
        let signDays: number = CacheManager.welfare2.signDays;
        let rewardData: any;
        this.isCanGetReward = false;
        this.baseItem.touchable = true;
        if(data.accDay == getSignRewardDay){
            this.c1.selectedIndex = 1;
            this.isCanGetReward = true;
            this.baseItem.touchable = false;
        }else if(data.accDay < getSignRewardDay || (getSignRewardDay == -1 && data.accDay <= signDays)){
            this.c1.selectedIndex = 2;
        }else{
            this.c1.selectedIndex = 0;
        }

        this.c2.selectedIndex = 0;
        rewardData = ConfigManager.mgSignMonth.getRewardData(signDays, false);
        if(rewardData.accDay == data.accDay){
            this.c2.selectedIndex = 1;
            this.restDayTxt.text = `还差${rewardData.accDay - signDays}天`;
        }
        // if(getSignRewardDay == -1){
        //     rewardData = ConfigManager.mgSignMonth.getRewardData(signDays, false);
        //     if(rewardData.accDay == data.accDay){
        //         this.c2.selectedIndex = 1;
        //         this.restDayTxt.text = `还差${rewardData.accDay - signDays}天`;
        //     }
        // }
    }

    public getReward() {
        if(this.isCanGetReward){
            ProxyManager.welfare2.accumulateSignReward(this._data.accDay, CacheManager.vip.vipLevel > 0);

            //掉落背包
            let point:egret.Point = this.baseItem.localToGlobal(0, 0, RpgGameUtils.point);
		    MoveMotionUtil.itemMoveToBagFromPos([this.baseItem.itemData.getCode()],point.x,point.y);
        }
    }

    public showEffect():void {
		if(!this.mc) {
			this.mc = UIMovieManager.get(PackNameEnum.MCHomeIcon);
			this.mc.setScale(0.97, 0.97);	
			this.mc.x = -115 / 4 +5;
			this.mc.y = -115 / 4 +7;
			this.addChild(this.mc);
		}
	}

	public removeEffect():void {
		if(this.mc) {
			this.mc.destroy();
			this.mc = null;
		}
	}
}