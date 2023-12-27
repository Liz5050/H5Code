/**
 * 法器
 */

class MagicWareController extends BaseController {
	private module: MagicWareModule;
	private heartSkillWindow : HeartMethodSkillWindow;
	private lvlupHeartWindow : WindowHeartLvlUp;
	private methodDecoWindow : WindowMethodDecompose;
	private infoWindow : WindowHeartDetail;
	private CSSkillTips:ColorStoneSkillTips;


	//子控制器
	private beastBattle: BeastBattleController;

	public constructor() {
		super(ModuleEnum.MagicWare);
		this.viewIndex = ViewIndex.Two;
	}

	public initView(): BaseModule {
		this.module = new MagicWareModule();
		this.beastBattle.setModule(this.module);
		return this.module;
	}

	public addListenerOnInit(): void {
		this.beastBattle = new BeastBattleController();

		 this.addListen0(NetEventEnum.packBackAddItem, this.onPackBackAddItem, this);
		 this.addListen0(NetEventEnum.pickUpHeartMethond, this.onPickHeartMethond, this);
	}

	public addListenerOnShow(): void {
		this.addListen1(NetEventEnum.packPosTypePropChange, this.packPosTypePropChange, this);
		this.addListen1(NetEventEnum.PlayerStrengthenExUpgraded, this.onPlayerStrengthenExUpgraded, this);
		this.addListen1(NetEventEnum.PlayerStrengthenExUpdated, this.onPlayerStrengthenExUpdated, this);
		this.addListen1(NetEventEnum.PlayerStrengthenExActived, this.onPlayerStrengthenExActived, this);
		this.addListen1(LocalEventEnum.ActiveHeartMethod, this.activeHeartMethond, this);
		this.addListen1(LocalEventEnum.UpLevelHeartMethod, this.upLevelHeartMethond, this);
		this.addListen1(LocalEventEnum.ReplaceHeartMethod, this.replaceHeartMethod, this);
		this.addListen1(LocalEventEnum.EquipHeartMethod, this.equipHeartMethod, this);
		this.addListen1(LocalEventEnum.MagicShowCSSkill, this.onShowCSSkillTips, this);
		this.addListen1(NetEventEnum.CultivateInfoUpdateHeartMethod, this.updateHeartMethodData, this);
		this.addListen1(UIEventEnum.HeartSkillWindowOpen, this.onClickHeartSkill,this);
		this.addListen1(UIEventEnum.HeartDecpWindowOpne, this.onClickHeartDecp, this);
		this.addListen1(UIEventEnum.HeartLvlUpOpen, this.onClickHeartEquip, this);
		this.addListen1(LocalEventEnum.HeartMethodDecompose, this.HeartMethodDecompose,this);
		this.addListen1(UIEventEnum.HeartInfoOpen, this.openInfoHeart ,this);

		this.addListen1(NetEventEnum.moneyBeastEquipExp, this.beastEquipExpUpdate, this);
	}

	private beastEquipExpUpdate(): void {
		this.module.updateBeastEquipExp();
	}
 
	private HeartMethodDecompose(uids : Array<string> , amounts : Array<number>) : void {
		ProxyManager.cultivate.decomposeMethod(uids,amounts);
	}

	private openInfoHeart(data : any) {
		if(!this.infoWindow) {
			this.infoWindow = new WindowHeartDetail();
		}
		this.infoWindow.show(data);
	}
	
	private onPackBackAddItem(itemData: ItemData, itemAmount: number, updateCode: number) {
		if(CacheManager.copy.isInCopy) {
			return;
		}
		if(itemData.getItemInfo().category == 20) {
			var item:ItemData = new ItemData(itemData.getCfgCode());
			item.itemAmount = itemAmount;
            EventManager.dispatch(LocalEventEnum.HomeShowReceiveNormalItemTips,item);
        }
	}

	private onPickHeartMethond(itemData: ItemData, itemAmount: number, updateCode: number) {
		if(!CacheManager.copy.isInCopy) {
			return;
		}
		if(itemData.getItemInfo().category == 20) {
			var item:ItemData = new ItemData(itemData.getCfgCode());
			item.itemAmount = itemAmount;
            EventManager.dispatch(LocalEventEnum.HomeShowReceiveNormalItemTips,item);
        }
	}

	/**
	 * 道具背包更新
	 */
	private packPosTypePropChange(): void {
		this.module.onPropUpdate();
		if(this.methodDecoWindow) {
			if(this.methodDecoWindow.isShow) {
				this.methodDecoWindow.updateProp();
			}
		}
		if(this.lvlupHeartWindow) {
			if(this.lvlupHeartWindow.isShow) {
				this.lvlupHeartWindow.updateProp();
			}
		}
	}

	/**
	 * 强化信息更新了
	 */
	private onPlayerStrengthenExUpgraded(info: SUpgradeStrengthenEx): void {
		this.module.onStrengthenExUpgraded(info);
	}

	/**
	 * 强化信息更新了
	 */
	private onPlayerStrengthenExUpdated(data: any): void {
		this.module.onStrengthenExUpdated(data);
	}

	/**
	 * 强化信息激活
	 */
	private onPlayerStrengthenExActived(info: SUpgradeStrengthenEx): void {
		this.module.onnStrengthenExActived(info);
		if (info != null) {
			if (info.type == EStrengthenExType.EStrengthenExTypeDragonSoul) {
				EventManager.dispatch(LocalEventEnum.ActivationShow, { "name": "龙炎甲", "model": 1, "modelType": EShape.EDragonScale });
			} else if (info.type == EStrengthenExType.EStrengthenExTypeWing) {
				EventManager.dispatch(LocalEventEnum.ActivationShow, { "name": "翅膀", "model": info.data.info.useModelId });
			}else if(info.type == EStrengthenExType.EStrengthenExTypeColorStone){
				EventManager.dispatch(LocalEventEnum.ActivationShow, { "name": "五色石", "urlModel":URLManager.getModuleImgUrl("color_stone.png",PackNameEnum.MagicWare)});
			}
		}
	}

	public hide(data?: any):void{
		super.hide(data);
		this.viewIndex = ViewIndex.Two;
	}

	private activeHeartMethond(index : number, roleindex : number, level : number) : void {
		ProxyManager.cultivate.heartMethondActiveLevelup(ECultivateType.ECultivateTypeHeartMethod, index, level, roleindex);
	}

	private upLevelHeartMethond(index : number, roleindex : number, level : number) : void {
		ProxyManager.cultivate.heartMethondActiveLevelup(ECultivateType.ECultivateTypeHeartMethod, index, level, roleindex);
	}

	private replaceHeartMethod(index : number, roleindex : number, level : number) : void {
		ProxyManager.cultivate.heartMethondReplace(ECultivateType.ECultivateTypeHeartMethod, index, level, roleindex);
	}

	private equipHeartMethod(index: number, roleindex : number, level : number) : void {
		ProxyManager.cultivate.heartMethondActiveLevelup(ECultivateType.ECultivateTypeHeartMethod, index, level, roleindex);
	}

	private onShowCSSkillTips(cfgData:any):void{
		if(!this.CSSkillTips){
			this.CSSkillTips = new ColorStoneSkillTips();
		}
		this.CSSkillTips.show(cfgData);
	}




	private updateHeartMethodData() {
		if(this.module) {
			this.module.onHeartMethodUpadte();
		}
		if(this.lvlupHeartWindow) {
			if(this.lvlupHeartWindow.isShow) {
				this.lvlupHeartWindow.onDataUpdate();
			}
		}
	}

	private onClickHeartEquip(data : any) {
		if(!this.lvlupHeartWindow) {
			this.lvlupHeartWindow = new WindowHeartLvlUp();
		}
		this.lvlupHeartWindow.show(data);
	}

	private onClickHeartDecp(data : any) {
		if(!this.methodDecoWindow) {
			this.methodDecoWindow = new WindowMethodDecompose();
		}
		this.methodDecoWindow.show(data);
	}

	private onClickHeartSkill(data : any) {
		if(!this.heartSkillWindow) {
			this.heartSkillWindow = new HeartMethodSkillWindow();
		}
		this.heartSkillWindow.show(data);
	}

}