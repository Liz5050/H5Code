class BossOwnerView extends BaseView {
	public static ATTACK_OWNER:string = "ATTACK_OWNER";

	private loader:GLoader;
	private nameTxt:fairygui.GRichTextField;
	private txt_guildName:fairygui.GRichTextField;
	private attackBtn:fairygui.GButton;
	private lifeBar:UIProgressBar;
    private attackState: OwnerAttackBtnState;
    private ownerIsRole:boolean;
    private attackBtnCtl: fairygui.Controller;
	public constructor(component:fairygui.GComponent) {
		super(component);
	}

	public initOptUI():void {
		this.loader = this.getGObject("loader") as GLoader;
		this.nameTxt = this.getGObject("txt_name").asRichTextField;
		this.txt_guildName = this.getGObject("txt_guildName").asRichTextField;
		this.attackBtn = this.getGObject("btn_seize").asButton;
		this.attackBtn.addClickListener(this.onAttackHandler,this);
		this.attackBtnCtl = this.getController('c1');
		this.lifeBar = this.getGObject("bar_blood") as UIProgressBar;
		this.lifeBar.setStyle(URLManager.getPackResUrl(PackNameEnum.Copy,"ownerLiftBar"),"",0,0,0,0,UIProgressBarType.Mask);
	}

	public updateOwner():void {
		let ownerInfo:any = CacheManager.bossNew.ownerInfo;
		let entity:RpgGameObject;
		if(EntityUtil.isMainPlayer(ownerInfo.entityId)) {
			//归属者为自己
			entity = CacheManager.king.kingEntity;
			this.ownerIsRole = true;			
		}
		else {
			let ownerId:string = EntityUtil.getEntityId(ownerInfo.entityId);
			entity = CacheManager.map.getEntity(ownerId);
			if(CacheManager.copy.isInCopyByType(ECopyType.ECopyMgCrossGuildBossIntruder)){ //神兽入侵 同仙盟就是归属者了
				this.ownerIsRole = CacheManager.guildNew.isMyGuild(ownerInfo.guildId_I);
			}else{
				this.ownerIsRole = false;
			}
            
		}
		this.updateOwnerLife(entity);

		this.nameTxt.text = HtmlUtil.colorSubstitude(LangBoss.L29,ownerInfo.name_S);
		if(!ownerInfo.guildName_S) {
			this.txt_guildName.text = HtmlUtil.colorSubstitude(LangBoss.L31);
		}
		else {
			this.txt_guildName.text = HtmlUtil.colorSubstitude(LangBoss.L30,ownerInfo.guildName_S);
		}
		this.loader.load(URLManager.getPlayerHead(CareerUtil.getBaseCareer(ownerInfo.career_SH)));
		this.setAttackBtnState(OwnerAttackBtnState.ROB);
		this.view.visible = true;
	}	

	public updateOwnerLife(entity:RpgGameObject):void {
		if(entity && entity.entityInfo != null) {
			let _life: number = Number(entity.entityInfo.life_L64);
			if (_life <= 0) _life = 0;
			let _maxLife: number = Number(entity.entityInfo.maxLife_L64);
			let list:RpgGameObject[] = CacheManager.map.getOtherPlayers(entity.entityInfo.entityId);
			for(let i:number = 0; i < list.length; i++) {
				if(list[i].entityInfo) {
					_life += Number(list[i].entityInfo.life_L64);
					_maxLife += Number(list[i].entityInfo.maxLife_L64);
				}
			}	
			// Log.trace(Log.TEST,"归属者血量更新----->>>>主角色最大血量：",Number(entity.entityInfo.maxLife_L64),"剩余：",Number(entity.entityInfo.life_L64));
			// Log.trace(Log.TEST,"归属者血量更新----->>>>多角色总血量：",_maxLife,"剩余：",_life,"多角色数量：",list.length);
			this.lifeBar.setValue(_life, _maxLife, true, true);
		}
		else {
			this.lifeBar.setValue(1, 1);
		}
	}

	public updateAll():void {

	}

	private onAttackHandler():void {
		if (this.attackState == OwnerAttackBtnState.CANCL && this.ownerIsRole) {
			EventManager.dispatch(LocalEventEnum.CrossBossCanclOwn);
		} else if(CacheManager.bossNew.hasOwner) {
			this.view.dispatchEvent(new egret.Event(BossOwnerView.ATTACK_OWNER));
		}
	}

	public setAttackBtnState(state:OwnerAttackBtnState):void {
        this.attackState = state;
        if (state == OwnerAttackBtnState.ROB) {
            this.attackBtn.visible = !this.ownerIsRole;
            this.attackBtnCtl.selectedIndex = 0;
        } else {			
			this.attackBtn.visible = true;
            //修改attackBtn的状态
            this.attackBtnCtl.selectedIndex = this.ownerIsRole ? 1 : 0;
        }
	}

	public reset():void {
		this.view.visible = false;
		this.lifeBar.setValue(0,1);
		this.nameTxt.text = "";
		this.loader.clear();
	}
}

enum OwnerAttackBtnState {
	ROB, //抢夺归属
	CANCL //取消归属
}