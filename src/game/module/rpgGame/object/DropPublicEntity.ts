class DropPublicEntity extends RpgGameObject
{
    private static MC_LIST:MovieClip[] = [];
    private static getDropMc():MovieClip {
        return DropPublicEntity.MC_LIST.pop() || new MovieClip();
    }
	private dropMc:MovieClip;
    private dropImg:GBitmap;
    private itemNameTxt:egret.TextField;
    protected startPt:egret.Point;
    protected itemInfo:any;
    /**道具数量 */
    protected count:number;
    protected timeOutIndex:number = -1;

    protected showDelay:number;
    private showTimeOutIdx:number = -1;

    /**掉落时是否在主角脚下 */
    protected isAutoPickUp:boolean = false;
    protected isCheckPoint:boolean = false;
	public constructor() 
	{
		super();
		this.objType = RpgObjectType.DropPublic;
		this.startPt = new egret.Point();
	}

	public init(data: EntityInfo): void
    {
		super.init(data);
		this.initData();
        this.initComponent();
        this.setTimeOut();
        this._hasInit = true;
	}

	protected initData():void
    {
		let _pts:any[] = this.entityInfo.points;
		if(_pts.length > 1)
		{
			this.startPt = RpgGameUtils.convertCellToXY(_pts[1].x_SH, _pts[1].y_SH, this.startPt);
		}

        this.itemInfo = ConfigManager.item.getByPk(Number(this.entityInfo.code_I));
		this.count = Number(this.entityInfo.mana_I);
		// this.dropInfo.reserveJs_S//装备信息
		// this.dropInfo.mana_I//道具数量
		// this.dropInfo.life_L64//保护时间
	}

	protected initComponent():void
    {
        this.addComponent(ComponentType.AvatarLayer);
        this.createBody();
    }

	protected createBody():void
    {
        let _avatarCom:AvatarLayerComponent = this.getComponent(ComponentType.AvatarLayer) as AvatarLayerComponent;
        if(!_avatarCom) return;
        let _nameTxt:string = this.itemInfo.name;
        if(this.itemInfo.type && this.itemInfo.type == EProp.EPropGold) {
            if(!this.dropMc) {
                this.dropMc = DropPublicEntity.getDropMc();
                this.dropMc.playFile(ResourcePathUtils.getRPGGameCommon() + "drop_7",-1, LoaderPriority.getPriority(this, ComponentType.AvatarDrop));
            }
        }
        else {
            if(!this.dropImg) {
                this.dropImg = ObjectPool.pop("GBitmap");
                this.dropImg.x = -30;
                this.dropImg.y = -40;
                this.dropImg.scaleX = this.dropImg.scaleY = 0.8;
                let itemCfg:any = ConfigManager.item.getByPk(this.itemInfo.code);
                if(itemCfg) {
                    this.dropImg.url = URLManager.getIconUrl(itemCfg.icon,URLManager.ITEM_ICON);
                }
                if(this.itemInfo.type && this.itemInfo.type == EProp.EPropCoinBind) {
                    _nameTxt = this.count + this.itemInfo.name;
                }
            }
        }
        if(!this.itemNameTxt) {
            this.itemNameTxt = ObjectPool.pop("egret.TextField");
            this.itemNameTxt.y = 20;
            this.itemNameTxt.size = 18;
            this.itemNameTxt.textColor = 0xFFFFFF;
            this.itemNameTxt.strokeColor = 0x000000;
            this.itemNameTxt.stroke = 2;
            this.itemNameTxt.textFlow = HtmlUtil.color(_nameTxt,Color.ItemColor[this.itemInfo.color]);
            AnchorUtil.setAnchor(this.itemNameTxt,0.5);

            /**0-1.5秒内随机延迟显示 */
            if(this.startPt) {
                this.showDelay = 0;//Math.random()*1000;
                this.showTween();
                // this.showTimeOutIdx = egret.setTimeout(this.showTween,this,this.showDelay);
            }
        }
        if(this.dropImg) {
            _avatarCom.body.addChild(this.dropImg);
        }
        else if(this.dropMc) {
            _avatarCom.body.addChild(this.dropMc);
        }
        _avatarCom.body.addChild(this.itemNameTxt);
        // if(this.startPt) _avatarCom.bodyAll.visible = false;
    }

	protected setTimeOut():void
    {
		//公有掉落由服务端移除，超过一定时间不用客户端清除
		let _king:MainPlayer = CacheManager.king.leaderEntity;
		if(!_king || !this.canPickUp) return;

		//掉落时已经在范围内，直接拾取
		//拾取时间 = 延迟出现时间 + 掉落动画时间 + 200毫秒
        this.isAutoPickUp = true;
		let _time:number = this.showDelay + 1000;
		this.timeOutIndex = egret.setTimeout(function(){
			_king.pickUpDrop();
		},this,_time);
	}

	protected showTween():void
    {
        let _avatarCom:AvatarLayerComponent = this.getComponent(ComponentType.Avatar) as AvatarLayerComponent;
		if(!_avatarCom) {
            return;
        }
		_avatarCom.bodyAll.visible = true;
		let _x:number = this.startPt.x - this.x;
		let _y:number = this.startPt.y - this.y;
		_avatarCom.bodyAll.x = _x;
		_avatarCom.bodyAll.y = _y;
		// _avatarCom.bodyAll.scaleX = _avatarCom.bodyAll.scaleY = 0.1;
        let _cX:number = _x - 120;
        if(_x < 0) _cX = _x + 120;
        let _cY:number = _y - 600;
        // let _controllerPt: egret.Point = new egret.Point(_cX,_cY);//App.MathUtils.getMidperpendicularPoint(_x, _y, 0, 0, 500);
        // let p1:egret.Point = new egret.Point();
        // p1.x = _x;
        // p1.y = _y;
        // let p2:egret.Point = new egret.Point(0,0);

		let _time:number = egret.getTimer();
        let isComplete:boolean = false;
        egret.Tween.get(_avatarCom.bodyAll,{onChange:onChange,onChangeObj:this}).wait(600).call(function(){
            isComplete = true;
            _avatarCom.bodyAll.x = _avatarCom.bodyAll.y = 0;
        },this);

		function onChange():void
		{
            //防止缓动完成执行call回调之后还会触发onChange，导致坐标偏移
            if(isComplete) return;
			let _curTime:number = egret.getTimer() - _time;
			let _pt:number[] = App.MathUtils.getBezierCurve(_x,_y,0,0,_curTime,600,_cX,_cY);
            //App.MathUtils.getBezierCurve(p1,p2,[_controllerPt],_curTime,800);
			if(_pt && _avatarCom && _avatarCom.bodyAll)
			{
                _avatarCom.bodyAll.x = _pt[0];
                _avatarCom.bodyAll.y = _pt[1];
			}
		}
    }

    public pickUpDestory():void
    {
        let delayComplete:number = 0;
        if(this.entityInfo && (!this.entityInfo.ownerId || EntityUtil.isMainPlayerOther(this.entityInfo.ownerId) >= 0)) {
            if(this.itemInfo) {
                let _code:number = this.itemInfo.code;
                if(this.isCheckPoint) {
                    let gameLayer:egret.DisplayObjectContainer = this.gameView.getGameLayer();
                    let startPt:egret.Point = RpgGameUtils.convertCellToXY(this.entityInfo.startX,this.entityInfo.startY);
                    let stageX:number = startPt.x + gameLayer.x;
                    let stageY:number = startPt.y + gameLayer.y;
                    MoveMotionUtil.itemMoveToBagFromPos([_code],stageX,stageY);
                    delayComplete = 1000;
                }
                else {
                    if(!CacheManager.map.isMapInstanceType(EMapInstanceType.EMapInstanceTypeCheckPoint)) {
                        //关卡地图拾取掉落后不播飞背包动画
                        MoveMotionUtil.itemMoveToBag([_code]);
                    }
                }
                this.showPropTips();
            }
        }
        this.destory();
        if(!CacheManager.map.hasPublicDrops && !CacheManager.map.hasPrivateDrops) {
            if(delayComplete > 0) {
                egret.setTimeout(function(){
                    EventManager.dispatch(LocalEventEnum.AIPickUpComplete)
                },this,delayComplete)
            }
            else {
                EventManager.dispatch(LocalEventEnum.AIPickUpComplete);
            }
        }
    }

    /**
     * 不在副本中逐个拾取时，拾取一个飘一次获得道具提示
     * 副本中全部吸取在RpgGameController中监听AIPickUpComplete后统一飘字
     */
    private showPropTips():void {
        if(!CacheManager.copy.isInCopy || this.objType == RpgObjectType.DropPublic) {
            if(this.itemInfo && this.count) {
                if(this.itemInfo.code == 41240002) {
                    this.count = 20;
                }
                let itemData: ItemData = new ItemData(this.itemInfo.code);
                if (ItemsUtil.isEquipItem(itemData)) {
                    if(!CacheManager.pack.backPackCache.isFull) {
                        EventManager.dispatch(NetEventEnum.packBackAddItem, itemData, this.count);
                    }
                }
                else {
                    EventManager.dispatch(NetEventEnum.packBackAddItem, itemData, this.count);
                }
            }
        }
    }

	// /** 实体信息，结构：message SEntityInfo */
    // public get entityInfo(): EntityInfo 
	// {
    //     return this._entityInfo as EntityInfo;
    // }

	public get canPickUp():boolean
	{
		if(!this.entityInfo) return false;
        let _king:MainPlayer = CacheManager.king.leaderEntity;
        let _dis:number = App.MathUtils.getDistance(this.col,this.row,_king.col,_king.row);
		// let _pickUpDis:number = ConfigManager.const.getConstValue("PickUpDropItemDistance");
        // if(_king.hasSprite) _pickUpDis = ConfigManager.const.getConstValue("PickUpDropItemAssistDistance");
		// let _dis:number = App.MathUtils.getDistance(this.x,this.y,_king.x,_king.y);
		if(_dis > 0) return false;//超出拾取距离
		return this.entityInfo.canPickUp;
	}

    public get autoPickUp():boolean
    {
        return this.isAutoPickUp;
    }

	public destory(): void
    {
        if(this.dropMc) {
            egret.Tween.removeTweens(this.dropMc);
            this.dropMc.reset();
            App.DisplayUtils.removeFromParent(this.dropMc);
            DropPublicEntity.MC_LIST.push(this.dropMc);
            this.dropMc = null; 
        }
        if(this.dropImg) {
            this.dropImg.destroy();
            this.dropImg = null;
        }
        if(this.itemNameTxt) {
            App.DisplayUtils.removeFromParent(this.itemNameTxt);
            this.itemNameTxt.textFlow = null;
            AnchorUtil.setAnchor(this.itemNameTxt, 0);
            this.itemNameTxt.size = null;
            this.itemNameTxt.textColor = 0x000000;
            this.itemNameTxt.strokeColor = 0x000000;
            this.itemNameTxt.stroke = 0;
            this.itemNameTxt.x = this.itemNameTxt.y = 0;
            ObjectPool.push(this.itemNameTxt);
            this.itemNameTxt = null;
        }
        if(this.timeOutIndex != -1)
        {
            egret.clearTimeout(this.timeOutIndex);
            this.timeOutIndex = -1;
        }
        if(this.showTimeOutIdx != -1)
        {
            egret.clearTimeout(this.showTimeOutIdx);
            this.showTimeOutIdx = -1;
        }
        this.showDelay = 0;
        this.itemInfo = null;
        this.count = 1;
        super.destory();
    }
}