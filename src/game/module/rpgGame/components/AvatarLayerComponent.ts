/**只提供层级管理，不需要update */
class AvatarLayerComponent extends Component
{
	private gMainLayer: egret.DisplayObjectContainer;
    /** 特效下层*/
    private gEffectDownLayer:egret.DisplayObjectContainer;

    /**混元装备特效 */
    private gAncientLayer:egret.DisplayObjectContainer;

    // /**坐骑层 */
    private gMountDownLayer:egret.DisplayObjectContainer;
    /**人物层 主体、翅膀、武器等需要切换层级显示*/
    private gBodyLayer:egret.DisplayObjectContainer;
    protected wingLayer:egret.DisplayObjectContainer;
    protected weaponLayer:egret.DisplayObjectContainer;
    /**人物UI层 （名字、血条、VIP图标等）*/
    private gBodyUILayer:egret.DisplayObjectContainer;
    /**实体说话层 */
    private gBodyTalkLayer:egret.DisplayObjectContainer;
    /**人物主体+人物UI 父容器*/
    private gBodyAllLayer:egret.DisplayObjectContainer;
    // //**坐骑遮罩层 */
    private gMountUpLayer:egret.DisplayObjectContainer;
    /**法宝 */
    private gFaBaoLayer:egret.DisplayObjectContainer;
    // /**小精灵 */
    // private gSpriteLayer:egret.DisplayObjectContainer;
    // /**龙魂 */
    // private gSoulLayer:egret.DisplayObjectContainer;
    /** 剑池 */
    private gSwordPoolLayer : egret.DisplayObjectContainer;

    /** 特效上层*/
    private gEffectUpLayer:egret.DisplayObjectContainer;
    /** 放到场景特效上层*/
    private gSceneEffectUpLayer:egret.DisplayObjectContainer;

    private shakeCtl:IShakeCtrl;

    /**模型是否显示 */
    private _isShow:boolean;
	public constructor()
	{
		super();
	}

	public start(): void 
	{
        super.start();
		this.initLayer();
		this.initUI();

		this.setPos();
	}

	protected initUI():void
	{
	}

	private initLayer():void
    {
        this.gMainLayer = ObjectPool.pop("egret.DisplayObjectContainer");        
        this.gEffectDownLayer = ObjectPool.pop("egret.DisplayObjectContainer");
        this.gAncientLayer = ObjectPool.pop("egret.DisplayObjectContainer");
        this.gMountDownLayer = ObjectPool.pop("egret.DisplayObjectContainer");

        this.gBodyLayer = ObjectPool.pop("egret.DisplayObjectContainer");
        this.wingLayer = ObjectPool.pop("egret.DisplayObjectContainer");
        this.weaponLayer = ObjectPool.pop("egret.DisplayObjectContainer");

        this.gBodyUILayer = ObjectPool.pop("egret.DisplayObjectContainer");
        this.gBodyTalkLayer = ObjectPool.pop("egret.DisplayObjectContainer");
        this.gBodyAllLayer = ObjectPool.pop("egret.DisplayObjectContainer");

        this.gMountUpLayer = ObjectPool.pop("egret.DisplayObjectContainer");

        this.gFaBaoLayer = ObjectPool.pop("egret.DisplayObjectContainer");
        // this.gSpriteLayer = ObjectPool.pop("egret.DisplayObjectContainer");
        // this.gSoulLayer = ObjectPool.pop("egret.DisplayObjectContainer");
        this.gSwordPoolLayer = ObjectPool.pop("egret.DisplayObjectContainer");

        this.gEffectUpLayer = ObjectPool.pop("egret.DisplayObjectContainer");
        this.gSceneEffectUpLayer = ObjectPool.pop("egret.DisplayObjectContainer");

        this.addToStage();
        this._isShow = true;

        if (EntityUtil.isSortObj(this.entity))
            this.entity.gameView.getGameObjcetLayer().addChild(this.gMainLayer);
        else
            this.entity.gameView.getGameGroundLayer().addChild(this.gMainLayer);

        // if(this.entity.objType == RpgObjectType.Monster && !EntityUtil.isSpecificBossType(this.entity.entityInfo))
        // {
        //     this.updateModelIsShow(LocalEventEnum.HideMonster);
        // }
        // else if(this.entity.objType == RpgObjectType.OtherPlayer)
        // {
        //     this.updateModelIsShow(LocalEventEnum.HideOther);
        // }
    }

    private addToStage():void
    {
        let flag:boolean = this.entity.objType == RpgObjectType.MainPlayer || this.entity.objType == RpgObjectType.OtherPlayer;
        let effectFlag:boolean = flag || this.entity.objType == RpgObjectType.Monster;
        //底层特效
        if(effectFlag) this.gMainLayer.addChild(this.gEffectDownLayer);
        //坐骑固定底层
        if(flag) this.gMainLayer.addChild(this.gMountDownLayer);
        //人物层
        if(flag) {
            this.gBodyLayer.addChild(this.wingLayer);
            this.gBodyLayer.addChild(this.weaponLayer);
        }
        this.gBodyAllLayer.addChild(this.gBodyLayer);
        this.gBodyAllLayer.addChild(this.gBodyUILayer);        
        this.gBodyAllLayer.addChild(this.gBodyTalkLayer);
        this.gMainLayer.addChild(this.gBodyAllLayer); //人物模型层
        if(flag) {
            this.gMainLayer.addChild(this.gAncientLayer);
            this.gMainLayer.addChild(this.gMountUpLayer);
            this.gMainLayer.addChild(this.gFaBaoLayer);
        }
        // //精灵
        // if(flag) this.gMainLayer.addChild(this.gSpriteLayer);
        // //龙魂
        // if(flag) this.gMainLayer.addChild(this.gSoulLayer);
        //剑池
        if(flag) this.gMainLayer.addChild(this.gSwordPoolLayer);
        //上层特效
        if(effectFlag) this.gMainLayer.addChild(this.gEffectUpLayer);
    }

	protected setPos(): void 
	{
        if(this.gMainLayer.parent == this.entity.gameView.getGameTweenLayer()) return;
        let ex:number = this.entity.x;
        if (this.gMainLayer.x != ex) {
            this.gMainLayer.x = ex;
        }
        let ey:number = this.entity.y;
        if (this.gMainLayer.y != ey) {
            this.gMainLayer.y = ey;
        }
        if (this.gSceneEffectUpLayer.numChildren) {
            if (this.gSceneEffectUpLayer.x != ex) this.gSceneEffectUpLayer.x = ex;
            if (this.gSceneEffectUpLayer.y != ey) this.gSceneEffectUpLayer.y = ey;
            if (this.gBodyLayer.parent && this.gSceneEffectUpLayer.parent == null) this.entity.gameView.getGameEffectUpLayer().addChild(this.gSceneEffectUpLayer);
        }
    }

    protected handleGotoAction(): void 
    {
    }

    public updateModelIsShow(setEvtType:LocalEventEnum):void
    {
        let _key:string = LocalEventEnum[setEvtType];
        if(!_key || _key == "") return;
        
        let isOtherPet:boolean = false;
        if(this.entity.objType == RpgObjectType.Pet) {
            isOtherPet = !EntityUtil.isBelongToMine(this.entity);//是否是其他玩家的宠物
        }
        let mainPlayer:MainPlayer = CacheManager.king.leaderEntity;
        let isBattleObj:boolean = mainPlayer && mainPlayer.battleObj == this.entity;//是否是正在攻击的目标

        let playerFull:boolean = CacheManager.map.playerFull && (this.entity.objType == RpgObjectType.OtherPlayer || isOtherPet);
        let _isHide:boolean = CacheManager.sysSet.getValue(_key) || (playerFull && !isBattleObj);
        if(_isHide)
        {
            this.hide();
            this._isShow = false;
        }
        else 
        {
            this.show();   
            this._isShow = true;
        }
    }

    public setSelect(isSelect: boolean, selectType: number = 0): void {
    }

    public hide():void
    {
        App.DisplayUtils.removeFromParent(this.gBodyLayer);
        if(this.entity.objType == RpgObjectType.OtherPlayer)
        {
            App.DisplayUtils.removeFromParent(this.gEffectDownLayer);
            App.DisplayUtils.removeFromParent(this.gAncientLayer);
            App.DisplayUtils.removeFromParent(this.gMountDownLayer);
            App.DisplayUtils.removeFromParent(this.gMountUpLayer);
            App.DisplayUtils.removeFromParent(this.gFaBaoLayer);
            // App.DisplayUtils.removeFromParent(this.gSpriteLayer);
            // App.DisplayUtils.removeFromParent(this.gSoulLayer);
            App.DisplayUtils.removeFromParent(this.gSwordPoolLayer);
            App.DisplayUtils.removeFromParent(this.gEffectUpLayer);
            App.DisplayUtils.removeFromParent(this.gSceneEffectUpLayer);
        }
        else if(this.entity.objType == RpgObjectType.Pet) {
            App.DisplayUtils.removeFromParent(this.gMainLayer);
        }
        this.cleanShake();
    }

    public show():void
    {
        if(!this.gBodyLayer.parent)
        {
            this.entity.action = Action.Stand;
            if(this.entity.objType == RpgObjectType.OtherPlayer)
            {
                this.addToStage();
            }
            else
            {
                this.gBodyAllLayer.addChildAt(this.gBodyLayer,0);
                if(this.entity.objType == RpgObjectType.Pet) {
                   this.entity.gameView.getGameGroundLayer().addChild(this.gMainLayer); 
                }
            }
        }
        this.handleGotoAction();
    }

	public stop(): void 
	{
		super.stop();
        this._isShow = false;
        egret.Tween.removeTweens(this.gMainLayer);
		App.DisplayUtils.removeFromParent(this.gMainLayer);
        this.gMainLayer.x = this.gMainLayer.y = 0;
        this.gMainLayer.scaleX = this.gMainLayer.scaleY = 1;
        this.gMainLayer.alpha = 1;
        egret.Tween.removeTweens(this.gBodyAllLayer);
        this.gBodyAllLayer.x = this.gBodyAllLayer.y = 0;
        this.gBodyAllLayer.scaleX = this.gBodyAllLayer.scaleY = 1;
        this.gBodyAllLayer.visible = true;
        this.gBodyAllLayer.alpha = 1;
        this.gBodyAllLayer.filters = null;

        egret.Tween.removeTweens(this.gMountDownLayer);
        this.gMountDownLayer.y = 0;

        this.gBodyLayer.scaleX = this.gBodyLayer.scaleY = 1;

        this.gEffectDownLayer.removeChildren();
        this.gMountDownLayer.removeChildren();
        this.wingLayer.removeChildren();
        this.weaponLayer.removeChildren();
        this.gBodyLayer.removeChildren();
        this.gBodyUILayer.removeChildren();
        this.gBodyTalkLayer.removeChildren();
        this.gBodyAllLayer.removeChildren();
        this.gMountUpLayer.removeChildren();
        this.gFaBaoLayer.removeChildren();
        // this.gSpriteLayer.removeChildren();
        // this.gSoulLayer.removeChildren();
        this.gSwordPoolLayer.removeChildren();
        this.gEffectUpLayer.removeChildren();
        this.gSceneEffectUpLayer.x = this.gSceneEffectUpLayer.y = 0;
        this.gSceneEffectUpLayer.removeChildren();
        App.DisplayUtils.removeFromParent(this.gSceneEffectUpLayer);
        this.gMainLayer.removeChildren();

        ObjectPool.push(this.gEffectDownLayer);
        ObjectPool.push(this.gMountDownLayer);
        ObjectPool.push(this.wingLayer);
        ObjectPool.push(this.weaponLayer);
        ObjectPool.push(this.gBodyLayer);
        ObjectPool.push(this.gBodyUILayer);
        ObjectPool.push(this.gBodyTalkLayer);
        ObjectPool.push(this.gBodyAllLayer);
        ObjectPool.push(this.gMountUpLayer);
        ObjectPool.push(this.gFaBaoLayer);
        // ObjectPool.push(this.gSpriteLayer);
        // ObjectPool.push(this.gSoulLayer);
        ObjectPool.push(this.gSwordPoolLayer);
        ObjectPool.push(this.gEffectUpLayer);
        ObjectPool.push(this.gSceneEffectUpLayer);
        ObjectPool.push(this.gMainLayer);

        this.gEffectDownLayer = null;
        this.gMountDownLayer = null;
        this.wingLayer = null;
        this.weaponLayer = null;
        this.gBodyLayer = null;
        this.gBodyUILayer = null;
        this.gBodyTalkLayer = null;
        this.gBodyAllLayer = null;
        // this.gSoulLayer = null;
        this.gSwordPoolLayer = null;
        this.gFaBaoLayer = null;
        // this.gSpriteLayer = null;
        // this.gMountUpLayer = null;
        this.gEffectUpLayer = null;
        this.gSceneEffectUpLayer = null;
        this.gMainLayer = null;
        this.cleanShake();
	}

	/** 是否点击中了 */
    public isHit(x: number, y: number): boolean 
	{
        return this.bodyAll.hitTestPoint(x, y) ? true : false;
        // return this.bodyMc.hitTestPoint(x, y) ? true : false;
    }

    public shakeBody(shakeIndex:number):void
    {
        this.cleanShake();
        if (shakeIndex > 0)
        {
            if (!this.shakeCtl)
                this.shakeCtl = App.ShakeUtils.shakeNormal(this.body, ShakeConst.TYPE_DIR_SHAKE, shakeIndex);
            else {
                let quakeData:any = ShakeConst["SHAKE_DATA_" + shakeIndex];
                let king:MainPlayer = CacheManager.king.leaderEntity;
                let angle:number = 0;
                if(king) {
                    angle = MathUtils.getPositiveAngle(Math.atan2((this.entity.y - king.y), (this.entity.x - king.x)));
                }
                this.shakeCtl.setData(this.body, quakeData, angle, null);
                this.shakeCtl.startShake();
            }
        }
    }

    public cleanShake():void
    {
        if (this.shakeCtl)
        {
            this.shakeCtl.stopShake();
        }
    }

	public get mountDown():egret.DisplayObjectContainer
    {
        return this.gMountDownLayer;
    }

    public get mountUp():egret.DisplayObjectContainer
    {
        return this.gMountUpLayer;
    }

    public get body():egret.DisplayObjectContainer
    {
        return this.gBodyLayer;
    }

    public get bodyWing():egret.DisplayObjectContainer {
        return this.wingLayer;
    }

    public get bodyWeapon():egret.DisplayObjectContainer {
        return this.weaponLayer;
    }

    public get bodyUI():egret.DisplayObjectContainer
    {
        return this.gBodyUILayer;
    }

    public get bodyTalkLayer():egret.DisplayObjectContainer
    {
        return this.gBodyTalkLayer;
    }

    public get bodyAll():egret.DisplayObjectContainer
    {
        return this.gBodyAllLayer;
    }

    public get effectDownLayer():egret.DisplayObjectContainer
    {
        return this.gEffectDownLayer;
    }

    public get faBaoLayer():egret.DisplayObjectContainer
    {
        return this.gFaBaoLayer;
    }

    public get spriteLayer():egret.DisplayObjectContainer
    {
        return null;//this.gSpriteLayer;
    }

    public get soulLayer():egret.DisplayObjectContainer
    {
        return null;//this.gSoulLayer;
    }

    public get swordLayer() : egret.DisplayObjectContainer 
    {
        return this.gSwordPoolLayer;
    }

    public get effectUpLayer():egret.DisplayObjectContainer
    {
        return this.gEffectUpLayer;
    }

    public get mainLayer():egret.DisplayObjectContainer
    {
        return this.gMainLayer;
    }

    public get sceneEffectUpLayer():egret.DisplayObjectContainer
    {
        return this.gSceneEffectUpLayer;
    }

    public get ancientLayer():egret.DisplayObjectContainer
    {
        return this.gAncientLayer;
    }

    public get isShow():boolean {
        return this._isShow;
    }
}