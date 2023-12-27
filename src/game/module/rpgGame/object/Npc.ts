class Npc extends RpgGameObject {
    private gStateMc:MovieClip;
    private gState:TaskNpcStatus;
    public constructor() {
        super();
        this.objType = RpgObjectType.Npc;
    }

    public init(data: NpcInfo): void {
        super.init(data);

        this.addComponent(ComponentType.Aoi);
        this.npcState = CacheManager.map.getNpcTaskState(Number(this.entityInfo.id));
        this._hasInit = true;
    }

    public setInCamera(value: boolean):void {
        super.setInCamera(value);
        if (value) {
            this.addComponent(ComponentType.AvatarMc);
            this.addComponent(ComponentType.Head);
            this.updateTitle();
            this.updateStateMc();
        }
        else {
            this.removeComponent(ComponentType.AvatarMc);
            this.removeComponent(ComponentType.Head);
        }
    }

    public updateTitle():void {
        let head:HeadComponent = this.getComponent(ComponentType.Head) as HeadComponent;
        if(head) head.updateTitle();
    }

    public get titlePath():string {
        if(!this.entityInfo) {
            return ""
        }
        let npcCfg:any = ConfigManager.npc.getByPk(Number(this.entityInfo.id));
        if(!npcCfg || !npcCfg.title) return "";
        return ResourcePathUtils.getRPGGame() + "title/" + npcCfg.title;
    } 

    public destory(): void {
        this.npcState = TaskNpcStatus.None;
        super.destory();
    }

    public get entityInfo(): NpcInfo {
        return this._entityInfo as NpcInfo;
    }

    public onClick(...params): void {
        let npcId:number = Number(this.entityInfo.id);// this.propertyData.npcInfo.npcId;
        CacheManager.king.selectedNpcId = npcId;
        let npcCfg:any = this.entityInfo.npcCfg;
        if(npcCfg && npcCfg.operation) {
            let npcOperation:string[] = npcCfg.operation.split("#");
            if(npcOperation.length > 0) {
                let opts:string[] = npcOperation[0].split(",");
                let operationType:NpcOperationEnum = Number(opts[0]);
                switch(operationType) {
                    case NpcOperationEnum.OpenModule:
                        let moduleId:ModuleEnum = ModuleEnum[opts[1]];
                        if(moduleId) {
                            EventManager.dispatch(UIEventEnum.ModuleOpen,moduleId);
                        }
                        break;
                    case NpcOperationEnum.GamePlay:
                        let gamePlayCfg:any = ConfigManager.gamePlay.getByPk(Number(opts[1]));
                        if(gamePlayCfg) {
                            EventManager.dispatch(LocalEventEnum.GamePlayWindowOpen,gamePlayCfg);
                        }
                        break;
                }
            }
        }
        else {
            EventManager.dispatch(UIEventEnum.SceneClickNpc, npcId);
        }
    }

    public npcDialogue():void
    {
        let npcId:number = Number(this.entityInfo.id);//this.propertyData.npcInfo.npcId;
        EventManager.dispatch(LocalEventEnum.AIStart, {"type": AIType.MoveToNpc, "data": {"npcId": npcId}});
    }

    public set npcState(value:TaskNpcStatus)
    {
        if(this.gState == value) return;
        this.gState = value;
        this.updateStateMc();
    }

    private updateStateMc():void
    {
        let _url:string = "";
        switch(this.gState)
        {
            case TaskNpcStatus.None:
                this.hideStateMc();
                return;
            case TaskNpcStatus.QuestionMark:
                _url = "npcTaskState_1";
                break;
            case TaskNpcStatus.ExclamationMark:
                _url = "npcTaskState_2";
                break;
        }
        if(_url != "")
        {
            let _avatarCom:AvatarLayerComponent = this.getComponent(ComponentType.Avatar) as AvatarLayerComponent;
            if(!_avatarCom) return;

            if(!this.gStateMc) this.gStateMc = ObjectPool.pop("MovieClip");
            this.updateModelHeight();
            // _avatarCom.bodyUI.addChild(this.gStateMc);
            ControllerManager.rpgGame.view.getGameObjectUILayer().addChild(this.gStateMc);
            this.gStateMc.playFile(ResourcePathUtils.getRPGGameCommon() + _url,-1, ELoaderPriority.UI_EFFECT);
        }
    }

    public updateModelHeight():void
    {
        if(!this.gStateMc) return;

        let _posY:number = -180;
        let _head:HeadComponent = this.getComponent(ComponentType.Head) as HeadComponent;
        if(_head) _posY = _head.namePosY - 40;
        this.gStateMc.y = _posY;
    }

    private hideStateMc():void
    {
        if(this.gStateMc)
        {
            this.gStateMc.destroy();
            this.gStateMc = null;
        }
    }

    public get mcName():string
    {
        return ConfigManager.npc.getModelId(parseInt(this.entityInfo.id));
    }
}