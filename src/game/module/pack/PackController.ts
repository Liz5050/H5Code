/**
 * 背包
 */
class PackController extends BaseController {
	private module: PackModule;
	private smeltWindow: PackSmeltWindow;
	private extendWindow: PackExtendWindow;
	private splitWindow: PackSplitWindow;
	private useWindow: PackUseWindow;
	private quickUseWindow: PackQuickUseWindow;
	private smeltTipWin: BossSmeltTipWindow;
	private quickUseEquip: QuickUseEquipWindow;
	private chooseGifbagWindow: PackGiftChooseWindow;
	/**获得一个物品的提示(新快速使用) */
	private quickUseTip:PackGetItemTip;
	private hookQuickParam:any;
	private isQuickUesHook:boolean;

	private illustrateUpgrateView: IllustrateUpgrateView;
	private illustrateDecomposeView: IllustrateDecomposeView;
	private illustrateSuitTip: IllustrateSuitTip;
	private illustratePropGet : TrainIllustratePropGet;

	public constructor() {
		super(ModuleEnum.Pack);
	}

	public initView(): BaseModule {
		this.module = new PackModule();
		return this.module;
	}

	public addListenerOnInit(): void {
		this.addListen0(UIEventEnum.PackSmeltOpen, this.packSmeltOpen, this);
		this.addListen0(LocalEventEnum.PackUse, this.packUse, this);
		this.addListen0(LocalEventEnum.PackUseByCode, this.packUseByCode, this);
		this.addListen0(LocalEventEnum.PackStore, this.packStore, this);
		this.addListen0(LocalEventEnum.PackFetch, this.packFetch, this);
		this.addListen0(LocalEventEnum.PackSale, this.packSale, this);
		this.addListen0(LocalEventEnum.PackSaleMore, this.packSaleMore, this);
		this.addListen0(LocalEventEnum.PackSaleOneKey, this.packSaleOneKey, this);
		this.addListen0(LocalEventEnum.MovePackItemList, this.onMoveItemListHandler, this);

		this.addListen0(NetEventEnum.packPosTypeBagChange, this.packPosTypeBagChange, this);
		this.addListen0(NetEventEnum.packPosTypePropChange, this.packPosTypeBagChange, this);
		this.addListen0(NetEventEnum.packPosTypeRuneChange, this.packPosTypeBagChange, this);
		this.addListen0(NetEventEnum.packRolePackItemsChange, this.packRolePackItemsChange, this);//角色背包有变动
		this.addListen0(NetEventEnum.packBackAddItem, this.packBackAddItem, this);
		this.addListen0(UIEventEnum.PackExtendOpen, this.packExtendOpen, this);
		this.addListen0(LocalEventEnum.PackExtendSend, this.packExtendSend, this);
		this.addListen0(UIEventEnum.PackExtendHide, this.packExtendHide, this);
		this.addListen0(UIEventEnum.PackSplitOpen, this.packSplitOpen, this);
		this.addListen0(UIEventEnum.PackUseOpen, this.packUseOpen, this);
		this.addListen0(UIEventEnum.PackChooseGiftBagWindowOpen, this.chooseGiftBagWindowOpen, this);
		// this.addListen0(UIEventEnum.PackQuickUseItem, this.packQuickUseItem, this);//屏蔽快速使用
		// this.addListen0(LocalEventEnum.PackQuickUseEquip, this.onQuickUseEquip, this);//新手阶段快速使用装备。屏蔽
		this.addListen0(UIEventEnum.PackageLoaded, this.onPackLoaded, this);
		this.addListen0(LocalEventEnum.PackCheckSpiritExpire, this.checkSpiritExpire, this);
		this.addListen0(LocalEventEnum.PackCheckSpiritExpEquip, this.checkSpiritExpEquip, this);
		this.addListen0(LocalEventEnum.ShowSmeltTipsWin, this.showSmeltTipWin, this);
		this.addListen0(LocalEventEnum.PackGetItemTip, this.onShowGetItemTip, this);
		this.addListen0(LocalEventEnum.PackHookGetTips, this.onHookGetItemTip, this);
		this.addListen0(LocalEventEnum.PackCheckPropTips, this.onPackCheckPropTips, this);
		this.addListen0(NetEventEnum.moneyGoldUpdate, this.onGoldUpdate, this);

		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameMeltEquipSuccess], this.meltEquipSuccess, this);
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateUseLimit], this.onUseLimitUpdate, this);

		//图鉴相关
		this.addListen0(LocalEventEnum.TrainShowIllustrateUpgrateView, this.onShowIllustrateUpgrateView, this);
		this.addListen0(LocalEventEnum.TrainHideIllustrateUpgrateView, this.onHideIllustrateUpgrateView, this);
		this.addListen0(LocalEventEnum.TrainShowIllustrateDecomposeView, this.onShowIllustrateDecomposeView, this);
		this.addListen0(LocalEventEnum.TrainShowIllustrateSuitTip, this.onShowIllustrateSuitTip, this);
		this.addListen0(LocalEventEnum.TrainShowGetWindow, this.onShowIllustrateGetWindow, this);
		this.addListen0(LocalEventEnum.TrainHideGetWindow, this.onTrainHideGetWindow, this);
		this.addListen0(LocalEventEnum.GameReSize,this.onUpdateGameSize,this);
		this.addListen0(NetEventEnum.CultivateInfoUpdateKill, this.onCheckQuickUseClose, this);
		this.addListen0(LocalEventEnum.TrainGodWeaponInfoUpdate, this.onGodWeaponUpdate, this);
	}

	public addListenerOnShow(): void {
		this.addListen1(NetEventEnum.moneyCoinBindUpdate, this.moneyUpdate, this);		
		this.addListen1(NetEventEnum.moneyHonourUpdate, this.moneyUpdate, this);
		this.addListen1(NetEventEnum.packBackPackItemsChange, this.updateModuleItems, this);
		this.addListen1(NetEventEnum.packPosTypeWarehouseChange, this.updateModuleItems, this);
		this.addListen1(NetEventEnum.packPosTypeRuneChange, this.updateModuleItems, this);

		this.addListen1(NetEventEnum.packPosTypeBagCapacityChange, this.packPosTypeBagCapacityChange, this);
		this.addListen1(LocalEventEnum.PackTidy, this.packTidy, this);
		this.addListen1(LocalEventEnum.PackSmletCate, this.onPackSmeltCate, this);
		this.addListen1(LocalEventEnum.PackSmletType, this.onPackSmeltType, this);
		this.addListen1(UIEventEnum.GoToGetIllustrate, this.getIllustrate, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameSplitItem], this.splitSuccess, this);

		//图鉴
		this.addListen1(NetEventEnum.roleIllustrateExpUpdated, this.onIllustrateExpUpdate, this);
		this.addListen1(NetEventEnum.CultivateInfoUpdateIllustrated, this.onIllustrateUpdate, this);
		this.addListen1(NetEventEnum.CultivateFightUpdate, this.onCultivateFightUpdate, this);
		

	}

	private getIllustrate() {
		if(this.illustrateUpgrateView) {
			this.illustrateUpgrateView.hide();
		}
		EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Lottery, {}, ViewIndex.One);
		/*if(CacheManager.guildNew.isJoinedGuild()) {
		 	EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.GuildCopy, {}, ViewIndex.Two);
		}
		else{
			this.hide();
			EventManager.dispatch(LocalEventEnum.GuildNewReqSearch,{ "name": "", "includeFull": true } );
		}*/


	}

	private onGoldUpdate():void{
		this.onPackCheckPropTips();
		this.checkHomePackRedTip();
		if(this.isShow){
			this.moneyUpdate();
		}		
	}

	private moneyUpdate(): void {
		this.module.updateMoney();		
	}

	private packPosTypeBagCapacityChange(): void {
		this.module.updateItems();
		this.module.updateCapacity();
	}

	private packBackPackItemsChange(): void {
		this.module.updateItems();
		this.module.updateCapacity();
	}

	//角色背包改变
	private packRolePackItemsChange():void{
		CacheManager.packQuickUse.delLowEquipAll();
		if(this.isQuickUseShow()){
			this.quickUseTip.checkClose();
		}
	}

	/**背包整体更新 */
	private packPosTypeBagChange(): void {
		this.updateModuleItems();
		if (this.isShow) {
			this.module.onPackChange();
		}
		if(this.isQuickUseShow()){
			this.quickUseTip.checkClose();
		}
	}

	private updateModuleItems(): void {
		if (this.module != null && this.module.isShow) {
			this.module.updateItems();
			this.module.updateCapacity();
		}
	}

	/**今日物品使用次数更新 */
	private onUseLimitUpdate(data: any): void {
		CacheManager.pack.updateItemUsedCount(data.intIntDict);
	}

	/**打开熔炼窗口 */
	private packSmeltOpen(itemDatas: Array<ItemData>): void {
		if (UIManager.isShow(ModuleEnum.Pack)) {
			EventManager.dispatch(UIEventEnum.ModuleClose, ModuleEnum.Pack);
		}
		if (!this.smeltWindow) {
			this.smeltWindow = new PackSmeltWindow();
		}
		if (!itemDatas) {
			itemDatas = WeaponUtil.getItemsCanSmelt();
		}
		this.smeltWindow.show(itemDatas);
		//this.smeltWindow.updateAll(itemDatas);
	}

	private isQuickUseShow():boolean{
		return this.quickUseTip && this.quickUseTip.isShow;
	}

	private isQuickUseNeedShow():boolean{
		return this.quickUseTip && this.quickUseTip.isNeedShow;
	}

	private onUpdateGameSize():void{
		if(this.isQuickUseShow()){
			this.quickUseTip.updatePos();
		}		
	}

	private onPackCheckPropTips():void{
		if (this.module != null && this.module.isShow) {
			this.module.updatePropPackTips();			
		}
		this.checkHomePackRedTip();
	}
	private onGodWeaponUpdate():void{
		CacheManager.packQuickUse.delQuickPiece();
		if(this.hookQuickParam){
			if(!CacheManager.godWeapon.isGodWPieceCanAct(this.hookQuickParam.item.code,this.hookQuickParam.item.piece)){
				this.hookQuickParam = null;
			}
		}
		this.onCheckQuickUseClose();
	}
	private onCheckQuickUseClose():void{		
		if(this.isQuickUseShow()){
			this.quickUseTip.checkClose();
		}		
	}

	private onHookGetItemTip(data:any):void{
		this.isQuickUesHook = data.isHook;
		if(this.isQuickUesHook){
			if(this.isQuickUseShow()){
				this.hookQuickParam = this.quickUseTip.getHookData();
				this.quickUseTip.hide();			
			}
		}else {
			let param:any;
			if(this.hookQuickParam){
				param = this.hookQuickParam;
				this.hookQuickParam = null;
			}else{
				let itm:any = CacheManager.packQuickUse.pop();
				if(itm){
					param = CacheManager.packQuickUse.getQuickParam(itm);
				}				
			}
			if(param){
				this.showQuickByItem(param);
			}			
		}
		
	}

	private onShowGetItemTip(data:any):void{
		let item:any = data.item; //如果是神器 是神器碎片的配置信息
		if(data.isPiece){ // data.isPiece 神器碎片标识
			if(!ConfigManager.const.isGodWeaponQuickUse()){
				return;//关卡未达要求 不弹快捷使用 2019年2月20日14:12:29 
			}
			item = data; 
		}else if(!item.isQuickUse){ 
			return;
		}else if(ItemsUtil.isKillItem(item)){
			//判断是否可激活
			let pos:number = (item as ItemData).getItemInfo().effectEx;
			if(!CacheManager.uniqueSkill.isanActiveOrUpgradeByPos(pos)){
				return;
			}
		}

		if(this.isQuickUseShow() && !data.isPiece && this.quickUseTip.isShowingItem(item)){ //获得的是正在显示的同一个物品 刷新数量即可			
			this.quickUseTip.updateAll(CacheManager.packQuickUse.getQuickParam(item));			
			return;
		}
		let isAdd:boolean = CacheManager.packQuickUse.addQuickUseItem(item,data.isPiece);
		if(isAdd){ //成功添加到快捷使用队列
			if(this.isQuickUesHook){
				return;
			}
			if(this.isQuickUseShow() && !data.isPiece ){
				if(ItemsUtil.isEquipItem(item) && this.quickUseTip.isNotEquip()){ //装备替换正在显示的物品
					let equipItm:any = CacheManager.packQuickUse.pop();
					this.quickUseTip.updateAll(CacheManager.packQuickUse.getQuickParam(equipItm));
				}				
			}else if(!this.isQuickUseNeedShow()){ //不是正在延迟显示 显示当前的数据
				let itm:any = CacheManager.packQuickUse.pop();
				if(itm){					
					this.showQuickByItem(CacheManager.packQuickUse.getQuickParam(itm));
				}
			}			
		}		
						
	}

	private showQuickByItem(param:any):void{
		if(!this.quickUseTip){
			this.quickUseTip = new PackGetItemTip();
		}
		if (ResourceManager.isPackageLoaded(PackNameEnum.Common)) {
			this.quickUseTip.show(param);
			this.quickUseTip.updatePos();
		}
	}

	private showSmeltTipWin(limitNumPack: number = 0): void {
		if (!this.smeltTipWin) {
			this.smeltTipWin = new BossSmeltTipWindow();
		}
		this.smeltTipWin.show({ "limitNumPack": limitNumPack });
	}

	/**打开扩展窗口 */
	private packExtendOpen(posType: number): void {
		if (!this.extendWindow) {
			this.extendWindow = new PackExtendWindow();
		}
		this.extendWindow.posType = posType;
		this.extendWindow.show();
		this.extendWindow.title = posType ? "扩展仓库" : "扩展背包";
	}

	/**关闭扩展窗口 */
	private packExtendHide(posType: number): void {
		if (this.extendWindow) {
			this.extendWindow.hide();
		}
	}

	/**打开拆分窗口 */
	private packSplitOpen(itemData: ItemData): void {
		if (!this.splitWindow) {
			this.splitWindow = new PackSplitWindow();
		}
		this.splitWindow.itemData = itemData;
		this.splitWindow.show();

	}
	private onPackLoaded(packName: string): void {
		if (packName == PackNameEnum.Common) {
			let nextItem: ItemData = CacheManager.pack.getNextQuickUseEquip();
			if (nextItem) {
				this.showQickUseEquip(nextItem);
			}
		}
	}
	/**快速使用装备 */
	private onQuickUseEquip(itemData: ItemData): void {
		if (ResourceManager.isPackageLoaded(PackNameEnum.Common)) {
			if (this.quickUseEquip && this.quickUseEquip.isShow) {
				CacheManager.pack.quickUseEquipQueue.push(itemData);
			} else {
				this.showQickUseEquip(itemData);
			}
		} else {
			CacheManager.pack.quickUseEquipQueue.push(itemData);
		}
	}

	private showQickUseEquip(itemData: ItemData): void {
		if (!this.quickUseEquip) {
			this.quickUseEquip = new QuickUseEquipWindow();
		}
		this.quickUseEquip.show(itemData);
	}

	/**打开批量使用窗口 */
	private packUseOpen(itemData: ItemData): void {
		if (!this.useWindow) {
			this.useWindow = new PackUseWindow();
		}
		this.useWindow.show({ "itemData": itemData });
	}

	/**
	 * 自选礼包选择窗口
	 */
	private chooseGiftBagWindowOpen(itemData: ItemData): void {
		if (!this.chooseGifbagWindow) {
			this.chooseGifbagWindow = new PackGiftChooseWindow();
		}
		this.chooseGifbagWindow.show({ "itemData": itemData });
	}

	private splitSuccess(): void {
		if (this.splitWindow.isShow) {
			this.splitWindow.hide();
		}
		Tip.showTip("拆分成功");
	}

	/**
	 * 熔炼成功
	 * @param data S2C_SMeltEquip
	 */
	private meltEquipSuccess(data: any): void {
		let coin: number = Number(data.coin);
		let hallowEquip: number = Number(data.hallowEquip);
		if (this.smeltWindow && this.smeltWindow.isShow) {
			this.smeltWindow.smeltSuccess();
		}
	}

	/**发送扩容请求 */
	private packExtendSend(data: any): void {
		if (data != null) {
			ProxyManager.pack.addBagCapacity(data.posType, data.value);
		}
	}

	/**
	 * 使用物品
	 */
	private packUse(itemData: ItemData): void {
		if (itemData) {
			if (ItemsUtil.isEquipItem(itemData) && !ItemsUtil.isKillItem(itemData)) {
				EventManager.dispatch(LocalEventEnum.EquipToRole, itemData);
			} else if (ItemsUtil.isShapeItem(itemData)) {
				switch (itemData.getShape()) {
					case 4:
						EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Player, { "tabIndex": 1 });
						break;
					case 6:
						EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Player, { "tabIndex": 2 });
						break;
					case 3:
						EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Player, { "tabIndex": 3 });
						break;
					case 8:
						EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Player, { "tabIndex": 4 });
						break;
					// case 1:
					// 	EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.PetMount, { "tabIndex": 1 });
					// 	break;
					// case 2:
					// 	EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.PetMount, { "tabIndex": 0 });
					// 	break;
				}
			} else if (ItemsUtil.isPetMountActiveItem(itemData)) {
				switch (itemData.getShape()) {
					case 1:
						EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.PetChange, { "tabIndex": 1 });
						break;
					case 2:
						EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.PetChange, { "tabIndex": 0 });
						break;
				}
			} else if (ItemsUtil.isFashionItem(itemData)) {
				let fashionData: any = ItemsUtil.getFashionData(itemData);
				ItemsUtil.openFashion(fashionData,ViewIndex.One);

			}else if(ItemsUtil.isIllustrateItem(itemData)){
				ItemsUtil.usellustrate(itemData);
			}else if (ItemsUtil.isJewelItem(itemData)) {
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Refine, { "tabIndex": 1 });
			} else if (ItemsUtil.isCopyExpPass(itemData)) {//九幽魔窟
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.CopyHall, { "tabIndex": 1, "cName": "c2", "tabIndex2": 3, "cName2": "c1" });
			} else if (ItemsUtil.isVipExperience(itemData)) {
				EventManager.dispatch(UIEventEnum.VipExperienceOpen);
			} else if (ItemsUtil.isOfflineWork(itemData) && CacheManager.sysSet.isFullOfflineTime(itemData.getEffect())) {
				Alert.alert(LangSetting.LANG6, function (): void {
					ProxyManager.pack.useItem(itemData.getUid(), 1, []);
				});
			} else if (ItemsUtil.isPetExpDrug(itemData)) {
				EventManager.dispatch(UIEventEnum.PetSwallowOpen);
			} else if (ItemsUtil.isRealmItem(itemData)) {
				HomeUtil.open(ModuleEnum.Realm);
			} else if (ItemsUtil.isModifyNameItem(itemData)) {
				EventManager.dispatch(UIEventEnum.PlayerModifyNameWindowShow);
			} else if(ItemsUtil.isKillItem(itemData)){
				EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.Player,{tabType:PanelTabType.UniqueSkill});
			} else if(ItemsUtil.isVipLimitedGiftBag(itemData)){
				ToolTipManager.showByCode(itemData,false,null,ToolTipSouceEnum.Pack);
			} else if(ItemsUtil.isBossExpDrug(itemData)) {
				ProxyManager.pack.useItem(itemData.getUid(), itemData.getItemAmount(), []);
			}
			else {
				if (itemData.getUseFlag() > 1 && itemData.getItemAmount() > 1) {
					EventManager.dispatch(UIEventEnum.PackUseOpen, itemData);
				} else {
					ProxyManager.pack.useItem(itemData.getUid(), 1, []);
				}
			}
		}
	}

	/**
	 * 根据物品code使用物品
	 */
	private packUseByCode(itemData: ItemData, useAmount: number = 0): void {
		if (useAmount == 0) {
			useAmount = itemData.getItemAmount();
		}
		ProxyManager.pack.useItemByCode(itemData.getCode(), useAmount, []);
	}

	/**
	 * 存入仓库
	 */
	private packStore(itemData: ItemData): void {
		// if (itemData) {
		// 	let uid: string = itemData.getUid();
		// 	let index: number = CacheManager.pack.backPackCache.getPosIndexInServer(uid);
		// 	let toIndex: number = CacheManager.pack.warePackCache.getFirstAblePosIndex();
		// 	if (toIndex == -1) {
		// 		EventManager.dispatch(LocalEventEnum.ShowRollTip, "仓库已满");
		// 		return;
		// 	}
		// 	ProxyManager.pack.moveItem(uid, EPlayerItemPosType.EPlayerItemPosTypeBag, index, EPlayerItemPosType.EPlayerItemPosTypeWarehouse, toIndex);
		// }
	}

	/**
	 * 从仓库取出
	 */
	private packFetch(itemData: ItemData): void {
		// if (itemData) {
		// 	let uid: string = itemData.getUid();
		// 	let index: number = CacheManager.pack.warePackCache.getPosIndexInServer(uid);
		// 	let toIndex: number = CacheManager.pack.backPackCache.getFirstAblePosIndex();
		// 	if (toIndex == -1) {
		// 		EventManager.dispatch(LocalEventEnum.ShowRollTip, "背包已满");
		// 		return;
		// 	}
		// 	ProxyManager.pack.moveItem(uid, EPlayerItemPosType.EPlayerItemPosTypeWarehouse, index, EPlayerItemPosType.EPlayerItemPosTypeBag, toIndex);
		// }
	}

	/**
	 * 背包间移动物品列表
	 */
	private onMoveItemListHandler(fromPosType: EPlayerItemPosType, toPosType: EPlayerItemPosType): void {
		let packCache: PackBaseCache = CacheManager.pack.getPackCacheByPosType(toPosType);
		if (!packCache) return;
		// let toIndex: number = packCache.getFirstAblePosIndex();
		if (!packCache.isHasCapacity(1)) {
			let tips: string = "背包已满";
			if (toPosType == EPlayerItemPosType.EPlayerItemPosTypeRune) {
				tips = "符文背包已满";
			}
			Tip.showTip(tips);
			return;
		}
		// let mapUid:any = {value_I:[],key_S:[]};
		// for(let i:number = 0; i < items.length; i++) {
		// 	if(items[i].getPosType() == toPosType) {
		// 		Log.trace(Log.SERR,"移动失败，物品已经在该类型中----->>>>>",items[i].getCode(),toPosType);
		// 		continue;
		// 	}
		// 	let uid:string = items[i].getUid();
		// 	let amount:number = items[i].getItemAmount();
		// 	mapUid.key_S.push(uid);
		// 	mapUid.value_I.push(amount);
		// }
		// if(mapUid.value_I.length == 0) return;
		ProxyManager.pack.moveItemList(fromPosType, toPosType);
	}

	/**
	 * 出售
	 */
	private packSale(itemData: ItemData): void {
		if (itemData) {
			Alert.info(`是否出售${itemData.getName(true)}*${itemData.getItemAmount()}？确定后该道具将永久消失！`, () => {
				ProxyManager.pack.sellItem(EPlayerItemPosType.EPlayerItemPosTypeBag, [itemData.getUid()]);
			}, this);
		}
	}

	/**
	 * 出售
	 */
	private packSaleMore(uids: Array<string>): void {
		if (uids.length > 0) {
			ProxyManager.pack.sellItem(EPlayerItemPosType.EPlayerItemPosTypeBag, uids);
		}
	}

	/**
	 * 一键出售
	 */
	private packSaleOneKey(): void {
		ProxyManager.pack.sellEquipOneKey();
	}

	/**
	 * 整理背包/仓库
	 */
	private packTidy(posType: EPlayerItemPosType): void {
		ProxyManager.pack.tidyBag(posType);
	}

	private onPackSmeltCate(data: any): void {
		this.module.updateSmletCate(data);
	}

	private onPackSmeltType(data: any): void {
		this.module.updateSmeltType(data);
	}

	/**
	 * 快速使用物品
	 */
	private packQuickUseItem(data: any): void {
		//屏蔽快速使用
		if (data != null) {
			this.quickUseItem(data);
		}
	}

	/**
	 * 背包增加了物品
	 */
	private packBackAddItem(itemData: ItemData): void {
		/*
		if (itemData) {
			let category: ECategory = itemData.getCategory();			
			//等级
			if (!CacheManager.role.isLevelMatch(itemData.getLevel())) {
				return;
			}
			
			if (itemData.getPosType() == EPlayerItemPosType.EPlayerItemPosTypeRole) { //角色背包
				return;
			}			
		}
		*/
	}

	/**
	* 检测守护过期，过期需要提醒
	*/
	private checkSpiritExpire(data: any = null): void {
		let items: Array<ItemData> = CacheManager.pack.backPackCache.getItemsByFun(ItemsUtil.isEquipSpritItem, ItemsUtil);
		for (let item of items) {
			if (item.isExpire) {
				EventManager.dispatch(UIEventEnum.PackQuickUseItem, { "itemData": item, "isShowCountdown": false });
			}
		}
	}

	/**
	 * 经验副本检测是否装备了小鬼怪
	 */
	private checkSpiritExpEquip(): void {
		if (CacheManager.copy.isInCopyByType(ECopyType.ECopyMgExperience)) {
			let equipItemData: ItemData = CacheManager.pack.rolePackCache.getItemAtIndex(EDressPos.EDressPosSpirit);
			if (!ItemsUtil.isSpiritExp(equipItemData)) {//未装备小鬼怪
				let items: Array<ItemData> = CacheManager.pack.backPackCache.getItemsByFun(ItemsUtil.isSpiritExp, ItemsUtil);
				for (let itemData of items) {
					if (!itemData.isExpire) {
						EventManager.dispatch(UIEventEnum.PackQuickUseItem, { "itemData": itemData, "isShowCountdown": false });
						break;
					}
				}
			}
		}
	}

	/**
	 * 快速使用物品
	 */
	private quickUseItem(data: { itemData: ItemData, isShowCountdown?: boolean, quickUseType?: EQuickUseType }): void {
		if (data != null) {
			if (this.quickUseWindow == null) {
				this.quickUseWindow = new PackQuickUseWindow();
			}
			if (!this.quickUseWindow.isShow) {
				this.quickUseWindow.show();
			}
			this.quickUseWindow.addData(data);
		}
	}

	private onShowIllustrateUpgrateView(data: any): void {
		if (!this.illustrateUpgrateView) {
			this.illustrateUpgrateView = new IllustrateUpgrateView();
		}
		this.illustrateUpgrateView.show(data);
	}

	private onHideIllustrateUpgrateView(): void {
		if (this.illustrateUpgrateView) {
			this.illustrateUpgrateView.hide();
		}
	}

	private onShowIllustrateGetWindow(data : any) : void {
		if(!this.illustratePropGet) {
			this.illustratePropGet = new TrainIllustratePropGet();
		}
		this.illustratePropGet.show(data);
	}

	private onTrainHideGetWindow(): void {
		if(this.illustratePropGet) {
			this.illustratePropGet.hide();
		}
	}

	private onShowIllustrateDecomposeView(): void {
		if (!this.illustrateDecomposeView) {
			this.illustrateDecomposeView = new IllustrateDecomposeView();
		}
		this.illustrateDecomposeView.show();
	}

	private onShowIllustrateSuitTip(subType: number): void {
		if (!this.illustrateSuitTip) {
			this.illustrateSuitTip = new IllustrateSuitTip();
		}
		this.illustrateSuitTip.show(subType);
	}

	private onIllustrateUpdate(): void {
		this.module.updateIllustrate();
		if (this.illustrateUpgrateView && this.illustrateUpgrateView.isShow) {
			this.illustrateUpgrateView.updateAll(this.illustrateUpgrateView.data);
		}
		this.checkHomePackRedTip();
	}

	private onIllustrateExpUpdate(): void {
		this.module.updateIllustrateExp();
		if (this.illustrateUpgrateView && this.illustrateUpgrateView.isShow) {
			this.illustrateUpgrateView.updateIllustrateExp();
		}
		this.checkHomePackRedTip();
	}

	/**养成系统战力更新 */
	private onCultivateFightUpdate(type: ECultivateType): void {
		if (type == ECultivateType.ECultivateTypeIllustrated) {
			this.module.updateIllustrateFight();
		}
	}

	private checkHomePackRedTip(): void {
		EventManager.dispatch(LocalEventEnum.HomeSetBtnTip, ModuleEnum.Pack, CacheManager.pack.isRedTip);
	}

	public setHeightTab(type : number) {
		(this.module as PackModule).setTabType(type);
	}
}