class RoleStateExchangeItem extends ListRenderer {
	private controller:fairygui.Controller;
	private effectTxt:fairygui.GRichTextField;
	private leftTimeTxts:fairygui.GRichTextField;
	private levelTxt:fairygui.GRichTextField;
	private operationBtn:fairygui.GButton;

	private txt_price:fairygui.GTextField;
	private item:BaseItem;
	private canUse:boolean = false;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void {
		super.constructFromXML(xml);
		this.controller = this.getController("c1");
		this.item = this.getChild("baseitem") as BaseItem;
		// this.item.setNameVisible(false);
		this.item.isShowName = false;
		this.effectTxt = this.getChild("txt_effect").asRichTextField;
		this.leftTimeTxts = this.getChild("txt_times").asRichTextField;
		this.levelTxt = this.getChild("txt_level").asRichTextField;
		this.txt_price = this.getChild("txt_price").asTextField;
		this.operationBtn = this.getChild("btn_decompose").asButton;
		this.operationBtn.addClickListener(this.onClickHandler,this);
	}

	public setData(data:any):void {
		this._data = data;
		let itemData:ItemData = new ItemData(data);
		let itemCfg:any = itemData.getItemInfo();

		let leftExCount:number = CacheManager.pack.getItemLeftUseCount(data);
        if(leftExCount < 0) {
            leftExCount = 0;
        }
		let color:number = leftExCount <= 0 ? Color.Red : Color.Green2;
		this.leftTimeTxts.text = "今天还可兑换" + HtmlUtil.html(leftExCount + "",color) + "次";
		this.leftTimeTxts.visible = true;
		this.item.setData(itemData);

		if(itemCfg.type && itemCfg.type == EProp.EPropRoleExp){
			//等级兑换修为
			this.leftTimeTxts.visible = false; //等级没有次数限制
			this.item.enableToolTip = false;
			this.item.touchable = false;
			
			let b:boolean = CacheManager.player.isCurLevelGetXW();
			let myLv:number = CacheManager.role.getRoleLevel();
			let info:any = ConfigManager.exp.getCurLevelExp((!b?myLv+1:CacheManager.player.roleExpAcceptInfo.lastAcceptLevel+1));
			let n:number = info && info.getLevelExp?info.getLevelExp:0;
			let lv:number = info?info.level:myLv;
			this.effectTxt.text = HtmlUtil.colorSubstitude(LangPlayer.L1,n);
			this.levelTxt.text = HtmlUtil.colorSubstitude(LangPlayer.L2,lv)+HtmlUtil.brText+HtmlUtil.colorSubstitude(LangPlayer.L4,myLv);
			this.operationBtn.text = "领取";
			this.controller.setSelectedIndex(0);		
			App.DisplayUtils.grayButton(this.operationBtn,!b,!b);	
			//this.operationBtn.enabled = b;
			CommonUtils.setBtnTips(this.operationBtn,b);

		}else if(itemCfg.type && itemCfg.type == EProp.EPropCheckpointRoleExp){ //关卡兑换

			this.controller.setSelectedIndex(0);
			let b:boolean = CacheManager.player.isCurCheckPointGetXW();
			let cp:number = CacheManager.copy.getCopyProcess(CopyEnum.CopyCheckPoint);
			let info:any = ConfigManager.checkPoint.getLevelExp((!b?cp+1:cp));
			let n:number = info && info.levelExp?info.levelExp:0;
			this.effectTxt.text = HtmlUtil.colorSubstitude(LangPlayer.L1,App.MathUtils.formatNum2(n));
			let mimCp:number = ConfigManager.checkPoint.getMinXWCheckPoint();
			this.levelTxt.text = cp>=mimCp?LangPlayer.L3:HtmlUtil.colorSubstitude(LangPlayer.L5,mimCp);
			this.operationBtn.text = "领  取";			
			//this.operationBtn.enabled = b;
			App.DisplayUtils.grayButton(this.operationBtn,!b,!b);	
			CommonUtils.setBtnTips(this.operationBtn,b);
			this.canUse = b;
			GuideTargetManager.reg(GuideTargetName.WindowRoleStateExchangeOperationBtn, this.operationBtn, true);
		}
		// else if(data == ItemCodeConst.RoleLvExp) {
		// 	this.leftTimeTxts.visible = false;
		// 	this.effectTxt.text = itemCfg.name;
		// 	this.levelTxt.text = "装备寻宝可获得大量修为丹";
		// 	this.operationBtn.text = "前  往";	
		// }
		else if(data == 30051067) {
			this.leftTimeTxts.visible = false;
			this.effectTxt.text = itemCfg.name;
			this.levelTxt.text = "BOSS等级越高，使用后获得修为越多";
			this.operationBtn.text = "前  往";	
		}
		else if(data == ItemCodeConst.CopyRoleStateExp) {
			this.leftTimeTxts.visible = false;
			this.effectTxt.text = itemCfg.name;
			this.levelTxt.text = "经验副本产出海量修为";
			this.operationBtn.text = "前  往";
			CommonUtils.setBtnTips(this.operationBtn,CacheManager.copy.checkExpCopyTips());	
		}
		else if(data == ItemCodeConst.SuperRoleLvExp || data == ItemCodeConst.RoleLvExp){
			this.leftTimeTxts.text = "今天还可使用" + HtmlUtil.html(leftExCount + "",color) + "次";
			let roleExp: number = ConfigManager.mgDynamicRoleStateProp.getRoleExp(data, CacheManager.role.getRoleState());
			this.effectTxt.text = HtmlUtil.colorSubstitude(LangPlayer.L1,App.MathUtils.formatNum2(roleExp));
			let bagCount:number = CacheManager.pack.propCache.getItemCountByCode2(data);
			this.controller.setSelectedIndex(0);
			if(bagCount > 0) {
				this.operationBtn.text = "立即使用";
				this.levelTxt.text = itemCfg.name + "：剩余" + bagCount + "个";
				this.canUse = leftExCount > 0;
				CommonUtils.setBtnTips(this.operationBtn,this.canUse);	
				App.DisplayUtils.grayButton(this.operationBtn,!this.canUse,!this.canUse);
			}
			else {
				this.operationBtn.text = "前  往";
				this.levelTxt.text = data == ItemCodeConst.RoleLvExp ? "装备寻宝可获得大量修为丹" : "神秘商店可打折出售";
				this.canUse = false;
				CommonUtils.setBtnTips(this.operationBtn,false);	
				App.DisplayUtils.grayButton(this.operationBtn,false,false);
			}
		}
	}

	private onClickHandler():void {
		let itemCfg:any = ConfigManager.item.getByPk(this._data);
		if(this._data == 30051067) {
			HomeUtil.open(ModuleEnum.Boss, false, {tabType:PanelTabType.WorldBoss}, ViewIndex.Two);
			EventManager.dispatch(UIEventEnum.CloseRoleStateExpExchange);
		}
		else if(this._data == ItemCodeConst.CopyRoleStateExp) {
			HomeUtil.open(ModuleEnum.CopyHall, false, {tabType:PanelTabType.CopyHallDaily}, ViewIndex.Two);
			EventManager.dispatch(UIEventEnum.CloseRoleStateExpExchange);
		}
		else {
			// let leftExCount:number = CacheManager.pack.getItemLeftUseCount(this._data);
			// if(itemCfg.type != EProp.EPropRoleExp && leftExCount <= 0) {
			// 	Tip.showTip("剩余次数不足");
			// 	return;
			// }
			if(this.controller.selectedIndex == 0 && this.canUse) {
				//兑换修为
				if(itemCfg.type == EProp.EPropRoleExp) {
					//等级兑换修为
					EventManager.dispatch(LocalEventEnum.UseRoleExp);
				}else if(itemCfg.type == EProp.EPropCheckpointRoleExp){
					EventManager.dispatch(LocalEventEnum.UseCheckPointExp);
				}
				else {
					//直接使用物品
					let bagItem:ItemData = CacheManager.pack.propCache.getItemByCode(this._data);
					if(bagItem) {
						EventManager.dispatch(LocalEventEnum.PackUseByCode,bagItem,1);
					}
				}
			}
			else {
				if(this._data == ItemCodeConst.RoleLvExp) {
					HomeUtil.open(ModuleEnum.Lottery, false, {}, ViewIndex.Two);
				}
				else if(this._data == ItemCodeConst.SuperRoleLvExp) {
					HomeUtil.open(ModuleEnum.Shop, false, {tabType:PanelTabType.ShopMystery}, ViewIndex.Two);
				}
				EventManager.dispatch(UIEventEnum.CloseRoleStateExpExchange);
				//购买道具
				// EventManager.dispatch(UIEventEnum.QuickShopBuyOpen,this._data,new CallBack(this.buyCall,this));
			}
		}
	}

	private buyCall(isMoney:boolean):void{
		if(!isMoney){
			EventManager.dispatch(UIEventEnum.CloseRoleStateExpExchange);
		}
	}

}