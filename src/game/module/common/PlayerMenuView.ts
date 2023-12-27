class PlayerMenuView extends BaseContentView {
	private head_icon:GLoader;
	private txt_name:fairygui.GTextField;
	private txt_level:fairygui.GTextField;
	private txt_guild:fairygui.GTextField;
	private operationType:MenuOperationEnum[];
	private operationBtns:fairygui.GButton[];
	private realCareer:number = 0;
	private playerData:any;
	public constructor() {
		super(PackNameEnum.Common,"PlayerMenuView",null,LayerManager.UI_Popup);
		this.isCenter = true;
		this.modal = true;
		this.isPopup = true;
	}

	public initOptUI():void {
		this.head_icon = this.getGObject("head_icon") as GLoader;
		this.txt_name = this.getGObject("txt_name").asTextField;
		this.txt_level = this.getGObject("txt_level").asTextField;
		this.txt_guild = this.getGObject("txt_guild").asTextField;
		this.operationType = [MenuOperationEnum.Chat,MenuOperationEnum.CheckInfo,MenuOperationEnum.Shield,MenuOperationEnum.Friend];
		this.operationBtns = [];
		for(let i:number = 0; i < this.operationType.length; i++) {
			let btn:fairygui.GButton = this.getGObject("btn_operation_" + i).asButton;
			btn.title = GameDef.MenuOperationName[this.operationType[i]];
			btn.addClickListener(this.onBtnClickHandler,this);
			this.operationBtns.push(btn);
		}
	}

	public updateAll(data:any):void {
		this.playerData = data;
		let miniPlayer:any = data.miniPlayer;
		let roleDates:any[] = this.playerData.roleDatas.data;
		let mainPlayerData:any;
		for(let i:number = 0; i < roleDates.length; i++) {
			if(roleDates[i].roleIndex_I == 0) {
				mainPlayerData = roleDates[i];
				break;
			}
		}
		if(mainPlayerData) {
			this.realCareer = mainPlayerData.career_SH;
			this.head_icon.load(URLManager.getPlayerHead(CareerUtil.getBaseCareer(mainPlayerData.career_SH)));
		}
		this.txt_name.text = miniPlayer.name_S;
		if(miniPlayer.roleState_I > 0) {
			this.txt_level.text = miniPlayer.roleState_I + "转" + miniPlayer.level_SH + "级";
		}
		else {
			this.txt_level.text = miniPlayer.level_SH + "级";
		}
		this.txt_guild.text = miniPlayer.guildName_S;
		this.setBtnState();
	}

	private setBtnState():void{
		let miniPlayer:any = this.playerData.miniPlayer;
		let isCrossPlayer:boolean = EntityUtil.isCrossPlayer(miniPlayer.entityId);
		let state:boolean = isCrossPlayer; //跨服玩家不能操作的按钮
		for(let i:number = 0;i<this.operationType.length;i++){
			if(MenuOperationEnum.CheckInfo!=this.operationType[i]){ //不是查看按钮
				let btn:fairygui.GButton = this.operationBtns[i];
				if(btn){
					let grayed:boolean = state; 
					if(MenuOperationEnum.Shield==this.operationType[i]){ //就算是跨服玩家 在跨服聊天场景能操作屏蔽按钮
						grayed = isCrossPlayer && !CopyUtils.isInCrossChat();
					}
					App.DisplayUtils.grayButton(btn,grayed);
					btn.touchable = !grayed;
				}
			}
		}
	}

	private onBtnClickHandler(evt:egret.TouchEvent):void {
		if(!this.playerData) return;
		let btn:fairygui.GButton = evt.currentTarget as fairygui.GButton;
		let index:number = this.operationBtns.indexOf(btn);
		let type:MenuOperationEnum = this.operationType[index];
		let playerId: number = this.playerData.miniPlayer.entityId.id_I;
		switch(type) {
			// case MenuOperationEnum.Chat:
			// 	break;
			case MenuOperationEnum.CheckInfo:
				// EventManager.dispatch(LocalEventEnum.CommonViewPlayerInfo,this.playerData);
				CommonController.lookupPlayer(this.playerData);
				break;
			case MenuOperationEnum.Shield:				
				if(!ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.Friend)){
					break;
				}
				if(playerId == CacheManager.role.getPlayerId()){
					Tip.showTip("不能将自己列入黑名单");
					return;
				}
				if(!EntityUtil.isCrossPlayer(this.playerData.miniPlayer.entityId)){ //非跨服玩家才能加入黑名单
					EventManager.dispatch(LocalEventEnum.FriendAddToBlackList, playerId);
				}				
				if(CopyUtils.isInCrossChat()){ //跨服场景 临时黑名单
					EventManager.dispatch(LocalEventEnum.FriendCrossShield, playerId);
				}
				break;
			case MenuOperationEnum.Friend:
				let name: string = this.playerData.miniPlayer.name_S;
				if(name == CacheManager.role.player.name_S){
					Tip.showTip("不能添加自己为好友");
					return;
				}else if(CacheManager.friend.isMaxFriend()){
					Tip.showTip("你的好友数量已达上限");
					return;
				}
				ProxyManager.friend.friendApply(name);
				break;
			case MenuOperationEnum.Chat:				
				this.playerData.miniPlayer.career_SH = this.realCareer;
				if(playerId == CacheManager.role.getPlayerId()){
					Tip.showTip("不能与自己私聊");
					return;
				}
				if(CacheManager.friend.isMyFriend(playerId)){
					let arg:any = {player:this.playerData.miniPlayer,talkDt:0};
					EventManager.dispatch(LocalEventEnum.FriendAddPrivateChat,arg);
					HomeUtil.open(ModuleEnum.Friend,false,{tabType:PanelTabType.FriendContact});
				}else{
					Tip.showTip("只有好友才能私聊");
				}				
				break;
			default:
				Tip.showTip("功能暂未开放");
		}
		this.hide();
	}
}