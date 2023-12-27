/**
 * 通用模型展示
 */
class ModelShow extends egret.DisplayObjectContainer {
	protected showType: EShape;
	protected resID: number;
	protected mc: MovieClip;
	private rightWing:RpgMovieClip;

	public isShapeChangeMc:boolean = false;//动态改变外形类型 重新创建mc

	public constructor(showType: EShape) {
		super();
		this.showType = showType;
		this.createMcByShape(showType);		
		this.mc.x = this.mc.y = 0;
		this.addChild(this.mc);

		if(showType == EShape.EShapeWing || showType == EShape.EDragonScale) {
			this.rightWing = ObjectPool.pop("RpgMovieClip");
			this.rightWing.x = this.rightWing.y = 0;
			this.addChild(this.rightWing);
		}
	}

	private createMcByShape(showType:EShape):void{
		if(showType == EShape.EShapeTitle || 
		showType == EShape.EAncient || showType == EShape.EAncientEquip )
		{
			this.mc = ObjectPool.pop("MovieClip");	
		}
		else {
			this.mc = ObjectPool.pop("RpgMovieClip");
		}
	}

	public setData(resID: number): void {
		if (resID == this.resID) return;

		this.resID = resID;
		//衣服时装内部不做转换处理，外部传参时请调用getPlayerFashionId直接传正确的值进来 2018年5月5日10:00:05 lizhi
		// if(this.showType == EShape.ECustomPlayer) {
		// 	this.resID = ConfigManager.client.getPlayerFashionId(resID,CacheManager.role.getBaseCareer());
		// }
		if(!this.resID) {
			this.reset();
			return;
		}
		if(!this.mc.parent) {
			this.addChild(this.mc);
		}
        if(this.showType == EShape.EShapeWing || this.showType == EShape.EDragonScale) {
		    if(this.rightWing == null){
                this.rightWing = ObjectPool.pop("RpgMovieClip");
                this.rightWing.x = this.rightWing.y = 0;
                this.addChild(this.rightWing);
            }
        }else{
            if(this.rightWing != null) {
                this.rightWing.destroy();
                this.rightWing = null;
            }
        }
		if(this.rightWing && !this.rightWing.parent) {
			this.addChild(this.rightWing);
		}
		if(this.showType == EShape.EShapeTitle) {
			this.mc.playFile(ResourcePathUtils.getRPGGame() + "title/" + this.resID,-1, ELoaderPriority.UI_EFFECT);
		}else if(this.showType == EShape.EAncient || this.showType == EShape.EAncientEquip){
			this.mc.playFile(this.getRootPath() + this.resID,-1, ELoaderPriority.UI_EFFECT);
		}else {
			(this.mc as RpgMovieClip).setData(this.getRootPath(), this.resID + "", AvatarType.Player, ELoaderPriority.UI_EFFECT);
			(this.mc as RpgMovieClip).gotoAction(Action.Stand, Dir.Bottom);
		}

		if(this.rightWing) {
			this.rightWing.setData(this.getRootPath(), this.resID + "", AvatarType.Player, ELoaderPriority.UI_EFFECT);
			this.rightWing.gotoAction(Action.Stand, Dir.Bottom);
			this.rightWing.scaleX = -1;
		}
        this.x = 0;
        this.y = 0;
	}

	public setShowType(showType: EShape): void {
		this.showType = showType;
		if(this.isShapeChangeMc){
			if(this.mc){
				this.mc.destroy();
				this.mc = null;
			}
			this.createMcByShape(showType);			
		}
	}

	public setMcGrayed(flag:boolean):void{
		if(!this.mc){
			return;
		}
		if(flag){
			this.mc.filters = EFilters.GRAYS;
		}else{
			this.mc.filters = null;
		}		
	}

	private onMcLoadCompleteHandler(evt:egret.Event):void {
        let mc:MovieClip = evt.currentTarget as MovieClip;
        mc.visible = true;
    }

	public reset():void {
		this.mc.reset();
		if(this.rightWing) {
			this.rightWing.reset();
		}
		this.resID = -1;
	}

	public destroy(): void {

		this.mc.destroy();
		this.mc = null;

		if(this.rightWing) {
			this.rightWing.destroy();
			this.rightWing = null;
		}

		App.DisplayUtils.removeFromParent(this);
	}

	//resource/assets/rpgGame/player/
	private getRootPath(): string {
		switch (this.showType) {
			case EShape.ECustomPlayer://人物
				return ResourcePathUtils.getRPGGameShow() + "player/";
			case EShape.EShapeWing:
				return ResourcePathUtils.getRPGGameShow() + "wing/";
			case EShape.EShapeSpirit:
				return ResourcePathUtils.getRPGGameShow() + "spirit/";
			case EShape.EShapeMagic:
				return ResourcePathUtils.getRPGGameShow() + "weapon/";
			case EShape.EShapePet:
				return ResourcePathUtils.getRPGGameShow() + "pet/";
			case EShape.EShapeMount:
				return ResourcePathUtils.getRPGGameShow() + "mount/";
			case EShape.EShapeCloak:
				return ResourcePathUtils.getRPGGameShow() + "cloak/";
			case EShape.EShapeSoul:
				return ResourcePathUtils.getRPGGameShow() + "soul/";
			case EShape.EMagicweapon:
				return ResourcePathUtils.getRPGGameShow() + "magicweapon/";
			case EShape.EAncient:
				return ResourcePathUtils.getRPGGameShow() + "ancient/";
			case EShape.EAncientEquip:
				return ResourcePathUtils.getRPGGameShow() + "ancientequip/";
			case EShape.EDragonScale:
				return ResourcePathUtils.getRPGGameShow() + "dragonScale/";
			case EShape.EHeartMethod:
				return ResourcePathUtils.getRPGGameShow() + "heartmethod/";
			case EShape.EShapeLaw:
                return ResourcePathUtils.getRPGGameShow() + "law/";
			case EShape.EShapeBattle:
				return ResourcePathUtils.getRPGGameShow() + "shapeBattle/";
			case EShape.EShapeSwordPool:
				return ResourcePathUtils.getRPGGameShow() + "swordPool/";
			case EShape.EInnerPower:
				return ResourcePathUtils.getRPGGameShow() + "innerPower/";
			case EShape.ECrossTeam:
				return ResourcePathUtils.getRPGGameShow() + "crossteam/";
			case EShape.EMinning:
				return ResourcePathUtils.getRPGGameShow() + "minning/";
			case EShape.EATkSkill:
				return ResourcePathUtils.getRPGGameShow() + "atkskill/";
			case EShape.EKingBattle:
				return ResourcePathUtils.getRPGGameShow() + "kingbattle/";
			case EShape.ELimitTask:
				return ResourcePathUtils.getRPGGameShow() + "limittask/";
			case EShape.ETowerCopy:
				return ResourcePathUtils.getRPGGameShow() + "towercopy/";
			case EShape.ERoleStatu:
				return ResourcePathUtils.getRPGGameShow() + "rolestatu/";
			default:
				return ResourcePathUtils.getRPGGamePlayer();
		}
	}
}