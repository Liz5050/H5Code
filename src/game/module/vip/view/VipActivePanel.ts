/**
 * Vip激活标签
 */
class VipActivePanel extends BaseTabView
{
    private static SHOWNAME_ITEM_ID:number[] = [12041205, 12050901, 12051001];
    private vipTitleTxt: fairygui.GTextField;
    private levelDatas:Array<VipLevelData>;
    private vipLevelTxt: fairygui.GTextField;
    private vipChargeLeftTxt: fairygui.GTextField;
    private growthProgress: fairygui.GProgressBar;
    private getRewardBtn: fairygui.GButton;
    private chargeBtn: fairygui.GButton;
    private leftBtn: fairygui.GButton;
    private rightBtn: fairygui.GButton;
    private switchItem:VipDescribeTweenItem;
    private itemList: List;
    private vipChargeTxt: fairygui.GTextField;
    private maskObj:fairygui.GGraph;
    private oneKeyMc: UIMovieClip;
    private lvLoader: GLoader;
    public initOptUI(): void
    {
        this.vipLevelTxt = this.getGObject("txt_viplevel").asTextField;
        this.vipChargeLeftTxt = this.getGObject("txt_charge").asTextField;
        this.vipChargeTxt = this.getGObject("txt_charge2").asTextField;
        this.vipTitleTxt = this.getGObject("txt_title").asTextField;

        this.lvLoader = this.getGObject("loader_bg3") as GLoader;

        this.growthProgress = this.getGObject("progressBar_vipexp").asProgress;
        this.getRewardBtn = this.getGObject("btn_get").asButton;
        this.getRewardBtn.addClickListener(this.onClickGetReward,this);
        this.chargeBtn = this.getGObject("btn_charge").asButton;
        this.chargeBtn.addClickListener(this.onClickCharge,this);
        this.leftBtn = this.getGObject("btn_left").asButton;
        this.leftBtn.addClickListener(this.onClickLeft,this);
        this.rightBtn = this.getGObject("btn_right").asButton;
        this.rightBtn.addClickListener(this.onClickRight,this);
        this.switchItem = this.getGObject("panel_introduce") as VipDescribeTweenItem;
        this.switchItem.setCallBack(this.tweenComp,this);
        this.maskObj = this.getGObject("mask_content").asGraph;
        this.switchItem.mask = this.maskObj.displayObject;

        this.itemList = new List(this.getGObject("list_item").asList);
    }

    public updateAll(data?: any): void
    {
        
        if (!this.levelDatas)
        {
            this.levelDatas = ConfigManager.vip.getVipLevelList();
        }
        let curLevel:number = CacheManager.vip.vipLevel;
        // this.selectIdx = curLevel > 0 ? curLevel - 1 : 0;
        this.vipLevelTxt.text = "" + curLevel;
        this.vipTitleTxt.text = "" + (curLevel || 1);
        let curLevelData:VipLevelData = curLevel > 0 ? this.levelDatas[curLevel-1] : null;
        let nextLevelData:VipLevelData = this.levelDatas[curLevel];
        this.growthProgress.max = nextLevelData ? nextLevelData.growth : curLevelData.growth;
        this.growthProgress.value = CacheManager.vip.growth;
        // let leftTime:number = CacheManager.vip.endDate - CacheManager.serverTime.getServerTime();
        if (nextLevelData)
            this.vipChargeLeftTxt.text = App.StringUtils.substitude(LangVip.LANG4, this.growthProgress.max - this.growthProgress.value, "VIP" + (curLevel > 0 ? nextLevelData.level: 1));
        else
            this.vipChargeLeftTxt.text = LangVip.LANG12;
        
        this.updateNext((data && data.vipLevel?data.vipLevel:0)); //有传入指定的 跳到指定的VIP等级
    }

    public updateNext(vipLevel:number = 0): void {
        let switchLv:number;
        if(vipLevel){
            switchLv = vipLevel; //有传入指定的 跳到指定的VIP等级
        }else{
            switchLv = CacheManager.vip.vipLevel<this.levelDatas.length?CacheManager.vip.vipLevel+1:this.levelDatas.length; 
            switchLv = CacheManager.vip.getFirstVipLevelReward() || switchLv; //有奖励 跳到第一个有奖励的等级     
        }        
        this.switchItem.updateAll(this.levelDatas,switchLv);
        this.updateShowLevel(this.switchItem.showData);
    }

    public updateRewardGet():void {
        let selectLevel:number = this.switchItem.showData.level;
        let vipRewardInfo:any = CacheManager.vip.getVipLevelReward(selectLevel);
        let enabled:boolean;
        if (vipRewardInfo == null) {
            enabled = (CacheManager.vip.vipLevel >= selectLevel);// && (CacheManager.vip.getMaxVipRewardLevel() == this.selectIdx);
            this.getRewardBtn.text = LangVip.LANG10;
            this.getRewardBtn.visible = enabled;
        } else {
            enabled = !vipRewardInfo.flags_B;
            this.getRewardBtn.text = enabled ? LangVip.LANG10 : LangVip.LANG11;
            this.getRewardBtn.visible = true;
        }
        if (enabled) {
            if (!this.oneKeyMc) {
                this.oneKeyMc = UIMovieManager.get(PackNameEnum.MCCommonButton, -10, -10, 1.18);
                this.getRewardBtn.addChild(this.oneKeyMc);
            }
            this.oneKeyMc.playing = true;
            this.oneKeyMc.visible = true;
        } else if (this.oneKeyMc) {
            this.oneKeyMc.playing = false;
            this.oneKeyMc.visible = false;
        }
        App.DisplayUtils.grayButton(this.getRewardBtn, !enabled, !enabled);
    }

    /**
     * 飘道具
     */
    public updateItemGet():void {
        MoveMotionUtil.itemListMoveToBag(this.itemList.list._children);
    }

    private updateReward(level:number):void {
        let curLevelRewardData:any = ConfigManager.vip.getVipLevelReward(level);
        this.itemList.data = RewardUtil.getStandeRewards(curLevelRewardData.reward);
        let childIndex:number = 0;
        let item:BaseItem;
        while (childIndex < this.itemList.list.numChildren) {//部分特殊的要显示名字
            item = this.itemList.list.getChildAt(childIndex) as BaseItem;
            if (VipActivePanel.SHOWNAME_ITEM_ID.indexOf(item.itemData.getCode()) != -1)
                item.setNameText(item.itemData.getName(true));
            childIndex++;
        }
        this.updateRewardGet();
    }

    private onClickGetReward()
    {
        if(!ItemsUtil.checkSmeltTips()) {
            EventManager.dispatch(LocalEventEnum.VipReqVipReward, this.switchItem.showData.level);
        }
    }

    private onClickCharge()
    {
        HomeUtil.openRecharge();
    }

    private tweenComp()
    {
    }

    private onClickLeft()
    {
        this.switchItem.leftClick();
        this.updateShowLevel(this.switchItem.showData);
    }

    private onClickRight()
    {
        this.switchItem.rightClick();
        this.updateShowLevel(this.switchItem.showData);
    }

    private updateShowLevel(curLevelData:VipLevelData):void {
        this.updateReward(curLevelData.level);
        this.lvLoader.load("resource/assets/module/VIP/vipbg" + (curLevelData.level) + ".jpg");
        this.vipChargeTxt.text = App.StringUtils.substitude(LangVip.LANG5, curLevelData.growth, "VIP" + curLevelData.level);
        this.leftBtn.visible = curLevelData.level > 1;
        this.rightBtn.visible = curLevelData.level < this.levelDatas.length;
        this.vipTitleTxt.text = curLevelData.level.toString();
    }

    public hide():void {
        super.hide();
        this.switchItem.hide();
        if (this.oneKeyMc) {
            this.oneKeyMc.destroy();
            this.oneKeyMc = null;
        }
    }
}