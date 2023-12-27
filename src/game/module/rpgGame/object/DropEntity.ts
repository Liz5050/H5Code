/**
 * 掉落实体
 * @author Chris
 */
class DropEntity extends DropPublicEntity
{
    private isInBoss:boolean = false;//是否在世界boss副本中
    public constructor()
    {
        super();
        this.objType = RpgObjectType.Drop;
    }

    public init(data: DropPrivateInfo): void
    {
        this.isInBoss = CacheManager.copy.isInCopyByType(ECopyType.ECopyWorldBoss);
        this.isCheckPoint = CacheManager.copy.isInCopyByType(ECopyType.ECopyCheckPoint);
        super.init(data);
        this.addComponent(ComponentType.Aoi);
        this._hasInit = true;
        let inCamera: boolean = RpgGameUtils.inCamera(this.x, this.y);
        this.setInCamera(inCamera);
    }

    public setInCamera(value: boolean) {
        super.setInCamera(value);
        if (!value && !this.isInBoss) {
            this.destory();
        }
    }

    protected initData():void
    {
        this.itemInfo = ConfigManager.item.getByPk(Number(this.entityInfo.sItemData.itemCode_I));
        let _col:number = this.entityInfo.startX;
        let _row:number = this.entityInfo.startY;
        this.startPt = RpgGameUtils.convertCellToXY(_col, _row, this.startPt);
        this.count = Number(this.entityInfo.sItemData.itemAmount_I);
    }

    protected initComponent():void
    {
        this.addComponent(ComponentType.AvatarLayer);
        this.createBody();
    }

    protected setTimeOut():void
    {
        let _king:MainPlayer = CacheManager.king.leaderEntity;
        if (!_king) {
            return;
        }
        // let _dis:number = App.MathUtils.getDistance(this.x,this.y,_king.x,_king.y);
        let _dis:number = App.MathUtils.getDistance(this.col,this.row,_king.col,_king.row);
        
        let _hasSprite:boolean = _king.hasSprite;
        let _time:number = this.showDelay + 1000;//消失时间 = 延迟出现时间 + 掉落动画时间 + 200毫秒
        this.isAutoPickUp = true;
        if(CacheManager.map.isPickUpAll()) {
            if(this.isCheckPoint) {
                this.showCheckPointPickUp();
            }
            else {
                this.showPickUpAllEffect();
            }
        }
        else {
            if(!_hasSprite) 
            {
                //无小助手，超出拾取距离，30秒后自动消失
                if(_dis > 0 || this.isInBoss) //ConfigManager.const.getConstValue("PickUpDropItemDistance")
                {
                    this.isAutoPickUp = false;
                    _time = 30000;
                }
            }
            this.timeOutIndex = egret.setTimeout(function(){
                if(_time < 30000) this.pickUpDestory();//有小助手主动拾取
                else this.destory();//自动消失
            },this,_time);
        }
    }

    private showPickUpAllEffect():void {
        let _avatarCom:AvatarLayerComponent = this.getComponent(ComponentType.Avatar) as AvatarLayerComponent;
        if(!_avatarCom) return;
        let layer:egret.DisplayObjectContainer = ControllerManager.rpgGame.view.getGameEffectUpLayer();
        let king:RpgGameObject;
        if(!this.entityInfo.ownerId || EntityUtil.isMainPlayerOther(this.entityInfo.ownerId) >= 0) {
            king = CacheManager.king.leaderEntity;
        }
        else {
            king = CacheManager.map.getEntity(this.entityInfo.ownerId);
        }
        if(!king) {
            this.destory();
            return;
        }
        let posX:number;
        let posY:number;
        let updateX:number;
        let updateY:number;
        egret.Tween.get(_avatarCom.mainLayer).wait(2500).call(function(){
            if(king) {
                updateX = posX = king.x;
                updateY = posY = king.y - 60;
                if(_avatarCom) {
                    layer.addChild(_avatarCom.mainLayer);
                    egret.Tween.get(_avatarCom.mainLayer,{onChange:onChangeHandler,onChangeObj:_avatarCom.mainLayer}).to({x:posX,y:posY},1000,egret.Ease.circOut)
                    .call(function(){
                        this.pickUpDestory();
                    },this);
                }
            }
            else {
                this.destory();
            }
        },this);
        function onChangeHandler():void {
            if(!king) return;
            if(_avatarCom && _avatarCom.mainLayer) {
                let changeX:number = king.x - updateX;
                let changeY:number = king.y - 60 - updateY;
                _avatarCom.mainLayer.x += changeX;
                _avatarCom.mainLayer.y += changeY;
                // updateX = king.x;
                // updateY = king.y - 60;
            }
        }
    }

    private showCheckPointPickUp():void {
        let _avatarCom:AvatarLayerComponent = this.getComponent(ComponentType.Avatar) as AvatarLayerComponent;
        if(!_avatarCom) return;
        // egret.Tween.get(_avatarCom.mainLayer).wait(2000).to({alpha:0},800).call(this.pickUpDestory,this);
        let centerPos:egret.Point = RpgGameUtils.convertCellToXY(this.entityInfo.startX,this.entityInfo.startY);
        egret.Tween.get(_avatarCom.mainLayer).wait(2000).to({x:centerPos.x,y:centerPos.y},500,egret.Ease.circInOut).call(this.pickUpDestory,this);
    }

    public get entityInfo():DropPrivateInfo
    {
        return this._entityInfo as DropPrivateInfo;
    }

    public get canPickUp():boolean
    {
        // if(CacheManager.copy.isInCopyByType(ECopyType.ECopyCheckPoint)) {
        //     //关卡副本中，拾取判断要多一关，掉落创建时，通关数还没更新，不会聚拢拾取。
        //     //等触发AI后，通关数已经更新，被判断为聚拢拾取，不会移动过去一个个捡
        //     if(CacheManager.checkPoint.passPointNum > 14){
        //         return true;
        //     }
        // }else 
        if(CacheManager.map.isPickUpAll()) {
            return true;
        }
        let _king:MainPlayer = CacheManager.king.leaderEntity;
        let _dis:number = App.MathUtils.getDistance(this.col,this.row,_king.col,_king.row);
		// let _pickUpDis:number = ConfigManager.const.getConstValue("PickUpDropItemDistance");
        // if(_king.hasSprite) _pickUpDis = ConfigManager.const.getConstValue("PickUpDropItemAssistDistance");
		// let _dis:number = App.MathUtils.getDistance(this.x,this.y,_king.x,_king.y);

        return _dis <= 0;
    }

    public get autoPickUp():boolean
    {
        return this.isAutoPickUp;
    }
    
    public destory():void
    {
        this.isCheckPoint = false;
        if(this.entityInfo && (!this.entityInfo.ownerId || EntityUtil.isMainPlayerOther(this.entityInfo.ownerId) >= 0)) {
            this.gameView.removePrivateDrop(this.entityInfo.id);
            let itemData: ItemData = new ItemData(this.entityInfo.sItemData);
            if (ItemsUtil.isOnlyShowItem(itemData)) {
                EventManager.dispatch(LocalEventEnum.HomeShowReceiveIcoEff, URLManager.getIconUrl(itemData.getCode(), URLManager.ITEM_ICON), App.StringUtils.substitude(LangPack.L4, itemData.getName())); 
            }
        }
        super.destory();
        
    }
}
