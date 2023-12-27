/**
 * 道具获取
 */
class PropGetController extends BaseController {
	private module: PropGetModule;

	public constructor() {
		super(ModuleEnum.PropGet);
		this.viewIndex = ViewIndex.Two;
	}

	protected initView(): any {
		this.module = new PropGetModule();
		return this.module;
	}

	/**类初始化时开启的监听 */
	protected addListenerOnInit(): void {
		this.addListen0(LocalEventEnum.PropGetGotoLink,this.onGotoLink,this);
	}

	/**模块显示时开启的监听 */
	protected addListenerOnShow(): void {
		
	}

	private onGotoLink(data:any):void{
		switch (data.type) {
			case GotoEnum[GotoEnum.CopyMaterial]:
				HomeUtil.open(ModuleEnum.CopyHall, false, { "tabType": PanelTabType.CopyHallMaterial }, ViewIndex.Two);
				break;
			case GotoEnum[GotoEnum.Smelt]:
				EventManager.dispatch(UIEventEnum.PackSmeltOpen);
				break;
			case GotoEnum[GotoEnum.BossCountry]:
				HomeUtil.open(ModuleEnum.Boss, false, { "tabType": PanelTabType.WorldBoss }, ViewIndex.Two);
				break;
			case GotoEnum[GotoEnum.GodBoss]:
				HomeUtil.open(ModuleEnum.Boss, false, { "tabType": PanelTabType.GodBoss }, ViewIndex.Two);
				break;
			case GotoEnum[GotoEnum.SecretBoss]:
				HomeUtil.open(ModuleEnum.Boss, false, { "tabType": PanelTabType.SecretBoss }, ViewIndex.Two);
				break;
			case GotoEnum[GotoEnum.Area]:
				HomeUtil.open(ModuleEnum.Arena, false, { "tabType": PanelTabType.KingBattle }, ViewIndex.Two);
				break;
			case GotoEnum[GotoEnum.Encounter]:
				HomeUtil.open(ModuleEnum.Arena, false, { "tabType": PanelTabType.Encounter }, ViewIndex.Two);
				break;
			case GotoEnum[GotoEnum.TrainNobility]:
				HomeUtil.open(ModuleEnum.Train, false, { "tabType": PanelTabType.TrainNobility }, ViewIndex.Two);
				break;
			case GotoEnum[GotoEnum.CheckPoint]:
				EventManager.dispatch(UIEventEnum.ModuleClose, ModuleEnum.Shop);
				break;
			case GotoEnum[GotoEnum.Mining]:
				HomeUtil.open(ModuleEnum.Arena, false, { "tabType": PanelTabType.Mining });
				break;
			case GotoEnum[GotoEnum.Lottery]:
				HomeUtil.open(ModuleEnum.Lottery, false,{ "tabType": PanelTabType.LotteryEquip },ViewIndex.Two);
				break;
			case GotoEnum[GotoEnum.LotteryAncient]:
				HomeUtil.open(ModuleEnum.Lottery, false,{ "tabType": PanelTabType.LotteryAncient },ViewIndex.Two);
				break;
			case GotoEnum[GotoEnum.VIP10]:
				HomeUtil.open(ModuleEnum.VIP, false,{vipLevel:10},ViewIndex.Two);
				break;		
			case GotoEnum[GotoEnum.VIP9]:
				HomeUtil.open(ModuleEnum.VIP, false,{vipLevel:9},ViewIndex.Two);
				break;
			case GotoEnum[GotoEnum.VIP8]:
				HomeUtil.open(ModuleEnum.VIP, false,{vipLevel:8},ViewIndex.Two);
				break;
			case GotoEnum[GotoEnum.VIP7]:
				HomeUtil.open(ModuleEnum.VIP, false,{vipLevel:7},ViewIndex.Two);
				break;	
			case GotoEnum[GotoEnum.VIP6]:
				HomeUtil.open(ModuleEnum.VIP, false,{vipLevel:6},ViewIndex.Two);
				break;	
			case GotoEnum[GotoEnum.VIP5]:
				HomeUtil.open(ModuleEnum.VIP, false,{vipLevel:5},ViewIndex.Two);
				break;
			case GotoEnum[GotoEnum.VIP4]:
				HomeUtil.open(ModuleEnum.VIP, false,{vipLevel:4},ViewIndex.Two);
				break;		
			case GotoEnum[GotoEnum.VIP3]:
				HomeUtil.open(ModuleEnum.VIP, false,{vipLevel:3},ViewIndex.Two);
				break;	
			case GotoEnum[GotoEnum.VIP2]:
				HomeUtil.open(ModuleEnum.VIP, false,{vipLevel:2},ViewIndex.Two);
				break;	
			case GotoEnum[GotoEnum.VIP1]:
				HomeUtil.open(ModuleEnum.VIP, false,{vipLevel:1},ViewIndex.Two);
				break;
			case GotoEnum[GotoEnum.AncientSmelt]:
				if(data.posType!=null){
					EventManager.dispatch(LocalEventEnum.AncientEquipShowComposeWin,{type:data.posType});
				}
			case GotoEnum[GotoEnum.MagicWeaponCopy]:
				HomeUtil.open(ModuleEnum.MagicWeaponStrengthen, false, { "tabType": PanelTabType.MagicWeaponCopy }, ViewIndex.Two);
				break;
			case GotoEnum[GotoEnum.CopySword]:
				HomeUtil.open(ModuleEnum.CopyHall, false, { "tabType": PanelTabType.CopyHallDaily , "copyType" : 2}, ViewIndex.Two);
				break;
			case GotoEnum[GotoEnum.Team2]:
				HomeUtil.open(ModuleEnum.CopyHall, false, { "tabType": PanelTabType.Team2}, ViewIndex.Two);
				break;
			case GotoEnum[GotoEnum.RechargeDay]:
				if(!CacheManager.recharge.isFirstRecharge()){
					HomeUtil.openRecharge();
					return;
				}			
				if(CacheManager.activity.dayRechargeHadAllGet()){
					Tip.showLeftTip("今天的每日充值已完成");
				}else{
					EventManager.dispatch(LocalEventEnum.OpenDayRecharge);
				}				
				break;
			case GotoEnum[GotoEnum.MgRecharge]:
				HomeUtil.openActivityByType(ESpecialConditonType.ESpecialConditonTypeMgRecharge);
				break;
			case GotoEnum[GotoEnum.ToplistActiveOpen]:
				HomeUtil.openActivityByType(ESpecialConditonType.ESpecialConditonTypeToplistActiveOpen);
				break;
			case GotoEnum[GotoEnum.ShopMystery]:
				HomeUtil.open(ModuleEnum.Shop, false, { "tabType": PanelTabType.ShopMystery});
				break;
			case GotoEnum[GotoEnum.ShopProp]:
				HomeUtil.open(ModuleEnum.Shop, false, { "tabType": PanelTabType.ShopProp});
				break;
			case GotoEnum[GotoEnum.GamePlayExam]:
				HomeUtil.open(ModuleEnum.Train, false,  { "tabType": PanelTabType.GamePlay});
				break;
			case GotoEnum[GotoEnum.GamePlayBattleField]:
				HomeUtil.open(ModuleEnum.Train, false,  { "tabType": PanelTabType.GamePlay});
				break;
			case GotoEnum[GotoEnum.GamePlayCampBattle]:
				HomeUtil.open(ModuleEnum.Train, false,  { "tabType": PanelTabType.GamePlay});
				break;
			case GotoEnum[GotoEnum.GamePlayCrossStair]:
				HomeUtil.open(ModuleEnum.Train, false,  { "tabType": PanelTabType.GamePlay});
				break;
			case GotoEnum[GotoEnum.SignIn]:
				HomeUtil.open(ModuleEnum.Welfare2,false);
				break;
			case GotoEnum[GotoEnum.VIPGift10]:
				HomeUtil.open(ModuleEnum.VIP, false,{"tabType": PanelTabType.VipGiftPackage, vipLevel:10},ViewIndex.Two);
				break;
			case GotoEnum[GotoEnum.VIPGift9]:
				HomeUtil.open(ModuleEnum.VIP, false,{"tabType": PanelTabType.VipGiftPackage, vipLevel:9},ViewIndex.Two);
				break;
			case GotoEnum[GotoEnum.VIPGift8]:
				HomeUtil.open(ModuleEnum.VIP, false,{"tabType": PanelTabType.VipGiftPackage, vipLevel:8},ViewIndex.Two);
				break;
			case GotoEnum[GotoEnum.VIPGift7]:
				HomeUtil.open(ModuleEnum.VIP, false,{"tabType": PanelTabType.VipGiftPackage, vipLevel:7},ViewIndex.Two);
				break;
			case GotoEnum[GotoEnum.VIPGift6]:
				HomeUtil.open(ModuleEnum.VIP, false,{"tabType": PanelTabType.VipGiftPackage, vipLevel:6},ViewIndex.Two);
				break;
			case GotoEnum[GotoEnum.VIPGift5]:
				HomeUtil.open(ModuleEnum.VIP, false,{"tabType": PanelTabType.VipGiftPackage, vipLevel:5},ViewIndex.Two);
				break;
			case GotoEnum[GotoEnum.VIPGift4]:
				HomeUtil.open(ModuleEnum.VIP, false,{"tabType": PanelTabType.VipGiftPackage, vipLevel:4},ViewIndex.Two);
				break;
			case GotoEnum[GotoEnum.VIPGift3]:
				HomeUtil.open(ModuleEnum.VIP, false,{"tabType": PanelTabType.VipGiftPackage, vipLevel:3},ViewIndex.Two);
				break;
			case GotoEnum[GotoEnum.RechargeDayReturn]:
				HomeUtil.openActivityByType(ESpecialConditonType.ESpecialConditonTypeRechargeDayReturn);
				break;
			case GotoEnum[GotoEnum.LoginReward]:
				HomeUtil.open(ModuleEnum.Welfare2, false,  { "tabType": PanelTabType.LoginReward});
				if(!CacheManager.welfare2.isLoginRewardPanelShow()){
					Tip.showTip("活动未开启");
				}
				break;
			case GotoEnum[GotoEnum.GuildBattle]:
				if (CacheManager.guildNew.isJoinedGuild()) {
					EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.GuildBattle);
				} 
				else {
					EventManager.dispatch(LocalEventEnum.GuildNewOpenSearchWin,true);
				}
				break;
			case GotoEnum[GotoEnum.Peak]:
				HomeUtil.openByIconId(IconResId.Peak);
				break;
			case GotoEnum[GotoEnum.GuildDefend]:
				if (CacheManager.guildNew.isJoinedGuild()) {
					//HomeUtil.open(ModuleEnum.Train, false,  { "tabType": PanelTabType.GamePlay});
					if(CacheManager.guildDefend.showIcon) {
						HomeUtil.openByIconId(IconResId.GuildDefend);
					}
					else {
						Tip.showTip("活动未开启");
					}
					break;
				} 
				else {
					EventManager.dispatch(LocalEventEnum.GuildNewOpenSearchWin,true);
				}
				break;
			case GotoEnum[GotoEnum.PrivilegeCard]:
				HomeUtil.open(ModuleEnum.Welfare2, false,{"tabType": PanelTabType.PrivilegeCard});
				break;
				
		}
	}

}