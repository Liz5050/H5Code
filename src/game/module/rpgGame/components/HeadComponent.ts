
class HeadComponent extends Component {
    private nameTxt: egret.TextField;
    /**仙盟名字 */
    private guildTxt: egret.TextField; 
    private lifeBar: UIProgressBar;
    /**实体模型高度 */
    private gModelHeight: number = 140;
    private titleMc:MovieClip;
    private passImgTitle:PassPointImgTitle;
    public constructor() {
        super();
    }

    public start(): void {
        super.start();

        let avatarComponent: AvatarComponent = <AvatarComponent>this.entity.getComponent(ComponentType.Avatar);
        if (!avatarComponent) return;        
        this.createNameTxt();
        this.createGuildNameTxt();
        if(this.entity.entityInfo && this.entity.entityInfo.selfIndex != -1) {
            this.showNormalLifeBar();
        }

        if (this.entity.objType == RpgObjectType.Npc || this.entity.objType == RpgObjectType.Monster) {
            if (avatarComponent.bodyMc.refMovieClipData) {
                let _height: number = avatarComponent.bodyMc.movieClipData.getTextureByFrame(1).textureHeight;
                this.updatePos(_height);
            }
            else {
                avatarComponent.bodyMc.addEventListener(MovieClip.RES_READY_COMPLETE, this.onMcLoadCompleteHandler, this);
            }
        }
        else {
            //人物上下坐骑状态模型高度不同，需要统一
            this.updatePos(140);
        }
        if (CacheManager.king.leaderEntity && CacheManager.king.leaderEntity.battleObj == this.entity) {
            avatarComponent.setSelect(true);
            this.showSelect(true);
        }
        this.updatePassPointImgTitle(avatarComponent.bodyUI);
    }
    
    private onMcLoadCompleteHandler(evt: egret.Event): void {
        let _mc: MovieClip = evt.currentTarget as MovieClip;
        _mc.removeEventListener(MovieClip.RES_READY_COMPLETE, this.onMcLoadCompleteHandler, this);
        let _height: number = 140;
        if (_mc.movieClipData) {
            _height = _mc.movieClipData.getTextureByFrame(1).textureHeight;
        }
        this.updatePos(_height);
    }

    private updatePos(height: number): void {
        this.gModelHeight = height;
        if(this.entity) {
            if(this.entity.objType == RpgObjectType.Monster && this.entity.entityInfo) {
                let bossCfg:any = ConfigManager.boss.getByPk(this.entity.entityInfo.code_I);
                if(bossCfg) {
                    if(bossCfg.modelScale && bossCfg.modelScale != 100) {
                        this.gModelHeight = height * (bossCfg.modelScale / 100);
                    }
                    if(!!bossCfg.offsetY) {
                        this.gModelHeight += bossCfg.offsetY;
                    }
                }
            }
            this.entity.updateModelHeight();
            this.updateUIPos();
        }
    }

    private createNameTxt(): void {
        this.nameTxt = new egret.TextField();
        this.nameTxt.size = 18;
        //this.nameTxt.width = 200;        
        this.nameTxt.height = 20;
        this.nameTxt.textAlign = egret.HorizontalAlign.CENTER;
        this.nameTxt.strokeColor = 0x000000;
        this.nameTxt.stroke = 1.6;
        this.updateNameText(this.entity.entityInfo.name_S);

        if(this.entity.objType == RpgObjectType.Npc) {
            this.nameTxt.size = 22;
            this.nameTxt.textColor = 0xf2e1c0;
        }
        else if(this.entity.objType == RpgObjectType.OtherPlayer){
            this.nameTxt.textColor = 0xF3f232;
        }
        else if(this.entity.objType == RpgObjectType.Monster) {
            this.nameTxt.textColor = 0x00ffff;
        }
        else {
            this.nameTxt.textColor = 0xffffff;
        }
        if (EntityUtil.isBoss(this.entity.entityInfo) && !EntityUtil.isCheckPointBoss(this.entity.entityInfo)) {
            this.nameTxt.textColor = 0xdf22e7;
            this.nameTxt.strokeColor = 0x170a07;
        }
        if(MapUtil.isCampBattleMap()) {
            if(EntityUtil.isEnemyCamp(this.entity)) {
                this.nameTxt.textColor = 0xff0000;
            }
        }
        if (this.entity.objType == RpgObjectType.Monster) return;
        this.txtParent.addChild(this.nameTxt);
    }

    private createGuildNameTxt(): void {
        if (this.entity.objType == RpgObjectType.MainPlayer || this.entity.objType==RpgObjectType.OtherPlayer){
            if(!this.guildTxt) {
                this.guildTxt = new egret.TextField();
                this.guildTxt.size = 18;
                this.guildTxt.textColor = this.entity.objType == RpgObjectType.MainPlayer ? 0x4afe7d : 0x61d3e8;
                this.guildTxt.height = 20;
                this.guildTxt.textAlign = egret.HorizontalAlign.CENTER;
                this.guildTxt.strokeColor = 0x000000;
                this.guildTxt.stroke = 1;
                this.txtParent.addChild(this.guildTxt);
            }
            if(MapUtil.isCampBattleMap()) {
                if(EntityUtil.isEnemyCamp(this.entity)) {
                    this.guildTxt.textColor = 0xff0000;
                }
            }
            this.updateGuildNameText(this.entity.entityInfo.guildName_S);            
        }
        
    }

    private updateNameText(text:string):void{
        if(App.GlobalData.IsDebug) {
            if (this.entity.entityInfo.selfIndex != -1) text += "##" + this.entity.entityInfo.selfIndex;
            if (this.entity.entityInfo.type == EEntityType.EEntityTypePlayerMirror) {
                text += "##R";
            }
        }
        let serverStr:string = "";
        if(EntityUtil.isCrossPlayer(this.entity.entityInfo.entityId)) {
            serverStr = EntityUtil.getServerNameStr(this.entity.entityInfo.entityId.typeEx_SH);
        }
        if(EntityUtil.isOnlyPlayer(this.entity.entityInfo.entityId) && this.entity.entityInfo.lordLevel_I>-1){ //已激活爵位
            let htmlLord:string = CacheManager.nobility.getNameByLv(this.entity.entityInfo.lordLevel_I,true,true);
            text += htmlLord; 
            this.nameTxt.textFlow = HtmlUtil.parser(serverStr + text);
        }else{
            this.nameTxt.text = serverStr + text;
        }        
        this.updateNamePos();
    }

    private updateGuildNameText(text:string):void{
        if(this.guildTxt){
            if(text){
                this.guildTxt.visible = true;
                this.guildTxt.text = `[盟]${text}`;
                this.updateGuildNamePos();
            }else{
                this.guildTxt.visible = false;
            }
            
        }        
    }
    
    private createLifeBar(): void {
        if (this.entity.objType == RpgObjectType.Monster || EntityUtil.isPlayer(this.entity.entityInfo.entityId)) {
            let _barAsset: string = URLManager.getCommonIcon("progressBar_2");//其他玩家
            if (this.entity.objType == RpgObjectType.Monster) {
                if (EntityUtil.isBoss(this.entity.entityInfo) && !EntityUtil.isCheckPointBoss(this.entity.entityInfo)) return;
                _barAsset = URLManager.getCommonIcon("progressBar_1");//怪物血条
            }
            this.lifeBar = fairygui.UIPackage.createObject(PackNameEnum.Common, "UIProgressBar") as UIProgressBar;
            this.lifeBar.setStyle(_barAsset, URLManager.getCommonIcon("bg_1"), 100, 10, 2, 2,UIProgressBarType.Normal,true);
            this.updateLifeBarPos();
        }
    }

    /**设置仙盟名字 */
    public setGuildName():void{
        if(this.entity){
            this.updateGuildNameText(this.entity.entityInfo.guildName_S);
        }        
    }

    public showSelect(isShow: boolean): void {
        if (!this.entity.entityInfo || this.entity.entityInfo.selfIndex != -1) return;

        let avatarComponent: AvatarComponent = <AvatarComponent>this.entity.getComponent(ComponentType.Avatar);
        if (!avatarComponent) return;
        if(this.nameTxt) this.nameTxt.strokeColor = 0x000000;
        if (isShow) {
            this.showNormalLifeBar();
        }
        else {
           
            //普通野怪切换目标才移除血条，死亡走死亡逻辑移除相关视图
            // if (this.lifeBar && !this.entity.entityInfo.isOnlyHpDied) App.DisplayUtils.removeFromParent(this.lifeBar.displayObject);
            if(this.entity.objType == RpgObjectType.OtherPlayer)
            {
                // this.nameTxt.textColor = 0xF3F232;   
                //原来需求选中和非选中的名称颜色显示会动态改变，现在不会             
                // this.updateNameText(this.entity.entityInfo.name_S);
            }
            //仅野怪（包括boss） 非选中移除名字显示
            // if (this.entity.objType == RpgObjectType.Monster && !this.entity.entityInfo.isOnlyHpDied) App.DisplayUtils.removeFromParent(this.nameTxt);
        }
    }

    public updateLife(): void {
        if(!this.lifeBar) {
            if(this.entity.objType != RpgObjectType.Monster) return;
            this.showNormalLifeBar();
        }
        if (this.lifeBar && this.lifeBar.displayObject.parent) {
            let _life: number = Number(this.entity.entityInfo.life_L64);
            if (_life <= 0) _life = 0;
            let _maxLife: number = Number(this.entity.entityInfo.maxLife_L64);
            this.lifeBar.setValue(_life, _maxLife, false, false);
        }
    }

    public updateName(): void {
        this.updateNameText(this.entity.entityInfo.name_S);
    }

    public updateForce():void {
        let objType:RpgObjectType = this.entity.objType;
        if(objType == RpgObjectType.Monster || objType == RpgObjectType.OtherPlayer) {
            if(MapUtil.isCampBattleMap()) {
                if(EntityUtil.isEnemyCamp(this.entity)) {
                    this.nameTxt.textColor = 0xff0000;
                    if(this.guildTxt) this.guildTxt.textColor = 0xff0000;
                }
                else {
                    this.nameTxt.textColor = 0xF3f232;
                    if(this.guildTxt) this.guildTxt.textColor = 0x61d3e8;
                }
            }
        }
    }

    public updateTitle():void {
        let titlePath:string = this.entity.titlePath;
        if(!titlePath || titlePath == "") {
            if(this.titleMc) {
                this.titleMc.destroy();
                this.titleMc = null;
            }
            return;
        }
        let avatarCom:AvatarLayerComponent = this.entity.getComponent(ComponentType.Avatar) as AvatarLayerComponent;
        if(!avatarCom) return;
        if(!this.titleMc) {
            this.titleMc = ObjectPool.pop("MovieClip");
        }
        this.updateTitlePos();
        // avatarCom.bodyUI.addChild(this.titleMc);
        this.parentUI.addChild(this.titleMc);
        this.titleMc.playFile(this.entity.titlePath,-1, LoaderPriority.getPriority(this.entity));
    }

    /**
     * 传送阵图片称号
     */
    private updatePassPointImgTitle(parent:egret.DisplayObjectContainer):void {
        if (this.entity.objType == RpgObjectType.PassPoint
            && CacheManager.copy.isInCopyByType(ECopyType.ECopyMgMining)) {
            let floor:number = CacheManager.mining.curFloor + (this.entity.entityInfo.process==1?-1:1);
            if (!this.passImgTitle) this.passImgTitle = new PassPointImgTitle(floor);
            this.passImgTitle.x = -75;
            this.passImgTitle.y = -200;
            parent.addChild(this.passImgTitle);
        }
    }

    private showNormalLifeBar():void {
        if(!this.entity.avatar) return;
        if(!this.lifeBar) {
            this.createLifeBar();
        }
        if (this.lifeBar) {
            let _life: number = Number(this.entity.entityInfo.life_L64);
            let _maxLife: number = Number(this.entity.entityInfo.maxLife_L64);
            this.lifeBar.setValue(_life, _maxLife, false, true);
            if(!this.lifeBar.displayObject.parent) {
                this.parentUI.addChild(this.lifeBar.displayObject);
            }
        }

        if(this.nameTxt && !this.nameTxt.parent) {
            //怪物掉血就显示血条和名称
            this.txtParent.addChild(this.nameTxt);
        }
    }

    private updateGuildNamePos():void{
        if(this.guildTxt){
            this.guildTxt.x = -this.guildTxt.width/2 + this.originX;
            this.guildTxt.y = this.nameTxt.y - this.guildTxt.height - 5;
        }
    }

    private updateNamePos():void{
        if(this.nameTxt){            
            this.nameTxt.x = -this.nameTxt.width/2 + this.originX;
            this.nameTxt.y = -this.modelHeight - 40 + this.originY;
        }
    }

    private updateTitlePos():void {
        if(this.titleMc) {
            if(this.guildTxt && this.guildTxt.visible && this.guildTxt.text != "") {
                this.titleMc.y = this.guildTxt.y - 50;
            }
            else {
                this.titleMc.y = this.nameTxt.y - 50;
            }
            this.titleMc.x = this.originX;
        }
    }

    private updateLifeBarPos():void {
        if(this.lifeBar) {
            this.lifeBar.x = -50 + this.originX;
            this.lifeBar.y = -this.modelHeight - 15 + this.originY;
        }
    }

    private updateUIPos():void {
        this.updateNamePos();
        this.updateGuildNamePos();
        this.updateTitlePos();
        this.updateLifeBarPos();
    }

    public getTitleMc():MovieClip {
        return this.titleMc;
    }

    public stop(): void {
        super.stop();
        if (this.nameTxt) {
            App.DisplayUtils.removeFromParent(this.nameTxt);
            this.nameTxt = null;
        }

        if(this.titleMc) {
            this.titleMc.destroy();
            this.titleMc = null;
        }

        if(this.passImgTitle) {
            this.passImgTitle.dispose();
            this.passImgTitle = null;
        }

        if (this.lifeBar) {
            App.DisplayUtils.removeFromParent(this.lifeBar.displayObject);
            this.lifeBar = null;
        }

        if(this.guildTxt) {
            App.DisplayUtils.removeFromParent(this.guildTxt);
            this.guildTxt = null;
        }

        this.gModelHeight = 0;
    }

    public get modelHeight(): number {
        // if(this.entity.isOnMount) return this.gModelHeight + 100;
        return this.gModelHeight;
    }

    public get namePosY():number
    {
        if(!this.nameTxt) return this.originY - 170;
        return this.nameTxt.y;
    }

    private get parentUI():egret.DisplayObjectContainer {
        return ControllerManager.rpgGame.view.getGameObjectUILayer();
    }

    private get txtParent():egret.DisplayObjectContainer{
        return ControllerManager.rpgGame.view.getGameObjectTxtLayer();
    }

    private get originX():number {
        return this.entity.x + this.entity.avatar.bodyAll.x;
    }

    private get originY():number {
        return this.entity.y + this.entity.avatar.bodyAll.y;
    }

    public update(advancedTime: number): void {
        super.update(advancedTime);
        this.updateUIPos();
    }
}