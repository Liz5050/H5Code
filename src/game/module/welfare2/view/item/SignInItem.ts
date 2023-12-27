/**
 * 签到
 */
class SignInItem extends ListRenderer {
    // private baseItem: BaseItem;
	private iconLoader: GLoader;
	private colorLoader: GLoader;
	private numTxt: fairygui.GRichTextField;
	private nameTxt: fairygui.GRichTextField;
	private statusController: fairygui.Controller;
	private vipController: fairygui.Controller;
	private mc: UIMovieClip;
	private mcColor: UIMovieClip;
	private canGetIcon : fairygui.GImage;

	private isCanSign: boolean;
	private isSign: boolean;
	private itemData: ItemData;
	private isShowEffect: boolean;

    public constructor() {
        super();
    }

    protected constructFromXML(xml:any):void {
        super.constructFromXML(xml);
        // this.baseItem = <BaseItem>this.getChild("baseItem");
		this.iconLoader = <GLoader>this.getChild("loader_icon");
		this.colorLoader = <GLoader>this.getChild("loader_color");
		this.numTxt = this.getChild("txt_num").asRichTextField;
		this.nameTxt = this.getChild("txt_name").asRichTextField;
		this.canGetIcon = this.getChild("canGet").asImage;
		this.statusController = this.getController("c1");
		this.vipController = this.getController("c2");
		this.addClickListener(this.click, this);
		this.iconLoader.addClickListener(this.openTips, this);
    }

    public setData(data:any):void {
        this._data = data;
		let str: Array<string> = data.rewardStr.split("#");
		this.itemData = RewardUtil.getReward(str[0]);
		this.iconLoader.load(URLManager.getPackResUrl(PackNameEnum.WelfareSignIn, `${this.itemData.getItemInfo().icon}`));
		this.colorLoader.load(URLManager.getPackResUrl(PackNameEnum.WelfareSignIn, `color_${this.itemData.getColor()}`));
		if(this.itemData.getItemAmount() == 1){
			this.numTxt.text = "";
		}else{
			this.numTxt.text = `${App.MathUtils.formatItemNum(this.itemData.getItemAmount())}`;
		}
		this.nameTxt.text = `第${data.day}天`;

		if(!data.doubleVipLevel){
			this.vipController.selectedIndex = 6;
		}else{
			this.vipController.selectedIndex = data.doubleVipLevel - 1;
		}

		this.isSign = CacheManager.welfare2.isSign(data.day);
		this.statusController.selectedIndex = this.isSign ? 1 : 0;


		this.isCanSign = CacheManager.welfare2.isCanSign(data.day);
		if(this.isSign || this.isCanSign){
			this.iconLoader.touchable = false;
			this.canGetIcon.visible = true;
		}else{
			this.iconLoader.touchable = true;
			this.canGetIcon.visible = false;
		}

		if(this.isCanSign){
			if (this.mc == null){
				this.mc = UIMovieManager.get(PackNameEnum.MCSginReward, -348, -391,1.04,1.15);
				this.mc.playing = true;
				this.mc.frame = 0;
			}
			this.addChild(this.mc);
		}else{
			if (this.mc != null){
				UIMovieManager.push(this.mc);
				this.mc = null;
			}
		}


		this.isShowEffect = !this.isSign;
		this.addItemEff();
		// this.baseItem.itemData = itemData;
		// this.baseItem.showBind();
		// this.baseItem.txtName.fontSize = 18;
    }

	private click(): void{
		if(this.isCanSign){
			if(this._data.doubleVipLevel && this._data.doubleVipLevel > CacheManager.vip.vipLevel){
				Alert.alert("建议双倍领取， 长期可获得高达百倍收益", this.sendMsg, this, this.openCharge, "", "", "提 示", 2, ["单倍领取", "双倍领取"]);
			}else{
				this.sendMsg();
			}
		}else if(this.isSign){
			Tip.showLeftTip("已领取");
		}else{
			Tip.showLeftTip("未达到签到时间");
		}
	}

	private openTips(): void {
		let toolTipData: ToolTipData;
		let extData: any = {};
		if (this.itemData) {
			toolTipData = new ToolTipData();
			toolTipData.data = this.itemData;
			toolTipData.extData = extData;
			toolTipData.type = ItemsUtil.getToolTipType(this.itemData);
			ToolTipManager.show(toolTipData);
		}
	}

	private sendMsg(): void{
		ProxyManager.welfare2.dailySignReward(CacheManager.vip.vipLevel > 0, CacheManager.welfare2.signDays + 1);

		//掉落背包
		let point:egret.Point = this.iconLoader.localToGlobal(0, 0, RpgGameUtils.point);
		MoveMotionUtil.itemMoveToBagFromPos([this.itemData.getCode()],point.x,point.y);
	}

	private openCharge(): void{
		HomeUtil.openRecharge();
	}

	private addItemEff(): void {		
        this.removeEff();
		if(this.isShowEffect){
        	this.addEff();
		}
    }

    private addEff():boolean {
        let flag:boolean = false;
        let pkgName: string = this.getColotEffectName();
        if (pkgName) {
            flag = true;
            this.mcColor = UIMovieManager.get(pkgName, -188, -191, 1, 1);
            this.mcColor.frame = 0;
            this.mcColor.visible = true;
            this.mcColor.playing = true;
            this.mcColor.grayed = false; //创建的时候都不是灰的
            this.addChildAt(this.mcColor, 3);
            // this.swapChildren(this.imgSelect, this.mcColor);
            let redPoint: fairygui.GObject = this.getChild(CommonUtils.redPointName);
            if (redPoint) {
                this.setChildIndex(redPoint, this.numChildren - 1);
            }
        }
        return flag;
    }
    private removeEff(): void {
        if (this.mcColor) {
            UIMovieManager.push(this.mcColor);
            this.mcColor = null;
        }
    }
    private getColotEffectName(): string {
        let pkgName: string = "";
        if (this.itemData && this.itemData.isNeedEffect()) {
            pkgName = PackNameEnum[`MCItemColor${this.itemData.getColor()}`];
        }
        return pkgName;
    }
}