/**
 * 特效播放类，直接调特效id播放
 * @author Chris
 */
class Effect extends MovieClip
{
    /*** 使用池*/
    private static POOL:Array<Effect> = [];

    private hasReset:boolean;

    private effectId:number;

    /** 特效vo：见t_effect.json*/
    private vo:any;

    /** 特效路径*/
    private src:string;

    /** 特效播放时间*/
    private customPlayTime:number;

    /** 特效目标*/
    private effectTargetVo:EffectTargetVo;
    /** 特效淡入淡出：[[类型：0淡出1淡入,作用时间点,作用时长,作用目标值(千分比)], ...]*/
    private fadeList: any[];
    private stepBeginTime: number;

    public constructor()
    {
        super();
    }

    /**
     * 特效播放
     * @param {string} urlPrefix
     * @param {number} playCount
     * @param {() => void} compFun
     * @param {boolean} remove
     * @returns {boolean}
     */
    public playEffect(urlPrefix: string,
                    playCount: number = 1,
                    compFun: () => void = null): boolean {

        this.hasReset = false;
        this.time = egret.getTimer();

        this._compFun = compFun;
        this.playCount = playCount;

        if (CacheManager.effect.canPlayEffect(this.effectTargetVo) == false)
        {
            this.playComp();
            return false;
        }

        if (urlPrefix && this._refMovieClipData && this._refMovieClipData.mcName == urlPrefix) {
            this.createBody();
            return true;
        }

        if (Effect.POOL.indexOf(this) == -1)
        {
            Effect.POOL.push(this);
        }

        this.urlPrefix = urlPrefix;
        // Log.trace("playEff=" + this.time, this.urlPrefix);
        let playTime:number = this.vo.playTime || 0;
        let mcData:RefMovieClipData;
        if (playTime >= 0) 
            mcData = App.LoaderManager.getModelResByUrl(this.urlPrefix);
        else
            mcData = App.LoaderManager.getModelResByUrl(this.urlPrefix, this.loadEffectComp, this, ELoaderPriority.DEFAULT, [urlPrefix]);
        if (mcData)
        {
            this.setRefMovieClipData(mcData);
            this.createBody();
            if (playTime > 0)
            {
                App.TimerManager.doTimer(this.customPlayTime, 1, this.playComp, this);
            }
        }
        else if (playTime >= 0)
        {
            this.playComp();
            return false;
        }
        return true;
    }

    private loadEffectComp(urlPrefix:string)
    {
        if (this.urlPrefix == urlPrefix && this.hasReset == false && this.vo.playTime < 0)
        {
            let mcData:RefMovieClipData = App.LoaderManager.getModelResByUrl(urlPrefix);
            this.setRefMovieClipData(mcData);
            this.createBody();
        }
    }

    protected createBody(): void 
    {
        super.createBody();
        // Log.trace("createBody=" + egret.getTimer(), this.urlPrefix);
    }

    protected createVo(effectId:number):boolean
    {
        this.vo = ConfigManager.effect.getVo(effectId);
        if (this.vo == null)
        {
            //Log.trace("没有找到特效id" + effectId + "的配置");
            this.playComp();
            return false;
        }
        this.src = this.vo.src;
        this.customPlayTime = this.vo.playTime;
        this.scaleX = this.vo.scaleX/1000;
        this.scaleY = this.vo.scaleY/1000;
        this.rotation = this.vo.rotation || 0;
        this.alpha = (this.vo.alpha || 0) / 1000;
        this.playCount = this.vo.playTime > 0 || this.vo.playTime < 0 ? -1 : 1;
        this.blendMode = this.vo.blendmode == 1 ? egret.BlendMode.ADD : egret.BlendMode.NORMAL;
        let fadeCf = this.vo.fade ? JSON.parse(this.vo.fade) : null;
        if (fadeCf) {
            if (typeof fadeCf[0] == 'number') {//单个
                this.fadeList = [fadeCf];
            } else {//多个
                this.fadeList = fadeCf;
            }
        }
        return true;
    }

    protected setRefMovieClipData(refMovieClipData:RefMovieClipData):void
    {
        super.setRefMovieClipData(refMovieClipData);
        if (this.vo.framerate)
        {
            this.frameRate = this.vo.framerate;
        }
    }

    /**
     * 简单播放
     * @param {number} effectId
     * @param startObj
     * @param {Function} compFunc
     * @returns {boolean}
     */
    public playSimpleEffect(effectId:number, startObj:any, compFunc: () => void = null):boolean
    {
        let effectVo:any = ConfigManager.effect.getVo(effectId);
        this._compFun = compFunc;
        if (effectVo)
        {
            return this.playNormalEffect(effectVo.effectId, RpgGameUtils.ZERO_POS, RpgGameUtils.ZERO_POS, startObj, 0, 0, effectVo.layer, EffectPosEnum.PosStart);
        }
        this.playComp();
        return false;
    }

    /**
     * 播放普通特效
     * @param {number} effectId
     * @param {egret.Point} startPoint
     * @param {egret.Point} targetPoint
     * @param startObj
     * @param {number} x
     * @param {number} y
     * @param {number} layer
     * @param {number} posType
     * @param {number} offsetType:偏移类型（暂时没用）
     * @param {number} childIndex:0默认>1层
     * @returns {boolean}
     */
    public playNormalEffect(effectId:number, startPoint:egret.Point, targetPoint:egret.Point, startObj:any, x:number, y:number, layer:number = -1, posType:number = 1, offsetType:number = 0, childIndex:number = 0):boolean
    {
        if (this.createVo(effectId))
        {
            let playSucc:boolean =  this.playEffect(this.src, this.playCount);
            if (playSucc)
            {
                if (layer == -1) layer = this.vo.layer || 0;
                if (Effect.isSceneLayer(layer))
                {
                    let basePos:egret.Point = posType == EffectPosEnum.PosStart ? startPoint : targetPoint;
                    this.x = x + basePos.x;
                    this.y = y + basePos.y;
                }
                else if (Effect.isUILayer(layer))
                {
                    this.x = fairygui.GRoot.inst.width / 2 + x;
                    this.y = RpgGameUtils.MIDDLE_HEIGHT * fairygui.GRoot.inst.height + y;
                }
                else
                {
                    this.x = x;
                    this.y = y;
                }
                let parent:egret.DisplayObjectContainer = Effect.getParent(startObj, layer);
                if (parent)
                {
                    if (childIndex == 0)
                        parent.addChild(this);
                    else
                        parent.addChildAt(this, childIndex);
                    this.addStep(true);
                }
                else
                {
                    this.playComp();
                    return false;
                }
            }
            return playSucc;
        }
        return false;
    }

    public playPoint2PointEffect(effectId:number, startPoint:egret.Point, targetPoint:egret.Point, startObj:any, x:number = 0, y:number = 0, layer:number = -1, targetOffX:number = 0, targetOffY:number = 0, toAngle:number = 0, layerSet?:any):boolean
    {
        if (this.createVo(effectId))
        {
            //Log.trace("playPoint2PointEffect", effectId, startPoint, targetPoint, startObj, x, y, layer);
            let playSucc:boolean = this.playEffect(this.src, this.playCount);
            if (playSucc)
            {
                if (layer == -1) layer = this.vo.layer || 0;
                if (layerSet) {
                    if (layerSet.rule == EEffectLayerSetRule.SEMI_CIRCLE) {
                        layer = toAngle > Math.PI && toAngle < 2 * Math.PI ? layerSet.data[0] : layerSet.data[1];
                    }
                }

                let isSceneLayer:boolean = Effect.isSceneLayer(layer);
                this.x = isSceneLayer ? startPoint.x + x : x;
                this.y = isSceneLayer ? startPoint.y + y : y;

                let lx:number = this.x;
                let ly:number = this.y;

                let tx:number;
                let ty:number;
                tx = isSceneLayer ? targetPoint.x + targetOffX : targetPoint.x - startPoint.x + targetOffX;
                ty = isSceneLayer ? targetPoint.y + targetOffY : targetPoint.y - startPoint.y + targetOffY;

                let parent:egret.DisplayObjectContainer = Effect.getParent(startObj, layer);
                if (parent)
                {
                    parent.addChild(this);
                    this.addStep(true);
                }
                else
                {
                    this.playComp();
                    return false;
                }

                let sourceRot:number = this.rotation;
                if (sourceRot == 0)
                {
                    this.rotation = (Math.atan2((ty - ly), (tx - lx)) * MathUtils.PIDIVIDED_BY_180) + 90;
                }
                else
                {
                    this.rotation = toAngle * MathUtils.PIDIVIDED_BY_180 + 90 + sourceRot;
                }
                if (this.rotation > 180 || this.rotation < 0)
                {
                    this.scaleX = -1 * this.scaleX;
                }
            }
            return playSucc;
        }
        return false;
    }

    public playPoint2PointEffect2(effectId:number, startPoint:egret.Point, targetPoint:egret.Point, startObj:any, x:number = 0, y:number = 0, layer:number = -1, toAngle:number = 0, layerSet?:any):boolean
    {
        if (this.createVo(effectId))
        {
            //Log.trace("playPoint2PointEffect2", effectId, startPoint, targetPoint, startObj, x, y, layer);
            let playSucc:boolean = this.playEffect(this.src, this.playCount);
            if (playSucc)
            {
                if (layer == -1) layer = this.vo.layer || 0;
                if (layerSet) {
                    if (layerSet.rule == EEffectLayerSetRule.SEMI_CIRCLE) {
                        layer = toAngle > Math.PI && toAngle < 2 * Math.PI ? layerSet.data[0] : layerSet.data[1];
                    }
                }

                let dis:number = Math.sqrt(x*x+y*y);
                let offX:number = dis * Math.cos(toAngle);
                let offY:number = dis * Math.sin(toAngle);
                let isSceneLayer:boolean = Effect.isSceneLayer(layer);
                this.x = isSceneLayer ? startPoint.x + offX : offX;
                this.y = isSceneLayer ? startPoint.y + offY : offY;

                let lx:number = this.x;
                let ly:number = this.y;

                let tx:number;
                let ty:number;
                tx = isSceneLayer ? targetPoint.x : targetPoint.x - startPoint.x;
                ty = isSceneLayer ? targetPoint.y : targetPoint.y - startPoint.y;

                let parent:egret.DisplayObjectContainer = Effect.getParent(startObj, layer);
                if (parent)
                {
                    parent.addChild(this);
                    this.addStep(true);
                }
                else
                {
                    this.playComp();
                    return false;
                }

                let sourceRot:number = this.rotation;
                if (sourceRot == 0)
                {
                    this.rotation = toAngle * MathUtils.PIDIVIDED_BY_180 + 90;
                }
                else
                {
                    this.rotation = toAngle * MathUtils.PIDIVIDED_BY_180 + 90 + sourceRot;
                }
                if (this.rotation > 180 || this.rotation < 0)
                {
                    this.scaleX = -1 * this.scaleX;
                }
            }
            return playSucc;
        }
        return false;
    }

    /**
     * 播放拉伸特效
     * @param {number} effectId
     * @param {egret.Point} startPoint
     * @param {egret.Point} targetPoint
     * @param startObj
     * @param {number} layer
     * @returns {boolean}
     */
    public playStretchEffect(effectId:number, startPoint:egret.Point, targetPoint:egret.Point, startObj:any, layer:number = -1):boolean
    {
        let playSucc: boolean = this.playNormalEffect(effectId, startPoint, targetPoint, startObj, 0, 0, layer);
        if (playSucc)
        {
            let dis:number = egret.Point.distance(startPoint, targetPoint);
            this.scaleY = dis / this.height;
            this.rotation = Math.atan2((targetPoint.y - startPoint.y), (targetPoint.x - startPoint.x)) * MathUtils.PIDIVIDED_BY_180 + 90;
        }
        return playSucc;
    }

    public static getParent(gameObj: any, layer:number):egret.DisplayObjectContainer
    {
        let parent:egret.DisplayObjectContainer;
        let king:RpgGameObject;
        let avComp:AvatarComponent;
        switch (layer)
        {
            case EffectLayerEnum.LayerSceneUp:
                parent = ControllerManager.rpgGame.view.getGameEffectUpLayer();
                break;
            case EffectLayerEnum.LayerSceneDown:
                parent = ControllerManager.rpgGame.view.getGameEffectDownLayer();
                break;
            case EffectLayerEnum.LayerObjUp:
                if ((king = gameObj as RpgGameObject) && (avComp = <AvatarComponent>king.getComponent(ComponentType.Avatar)))
                    parent = avComp.effectUpLayer;
                break;
            case EffectLayerEnum.LayerObjDown:
                if ((king = gameObj as RpgGameObject) && (avComp = <AvatarComponent>king.getComponent(ComponentType.Avatar)))
                    parent = avComp.effectDownLayer;
                break;
            case EffectLayerEnum.LayerSpecified:
                parent = gameObj as egret.DisplayObjectContainer;
                break;
            case EffectLayerEnum.LayerObjUp2:
                if ((king = gameObj as RpgGameObject) && (avComp = <AvatarComponent>king.getComponent(ComponentType.Avatar)))
                    parent = avComp.sceneEffectUpLayer;
                break;
            case EffectLayerEnum.LayerSceneUpBottom:
                parent = ControllerManager.rpgGame.view.getGameEffectUpBottomLayer();
                break;
            case EffectLayerEnum.LayerUIXPSkillDown:
                parent = LayerManager.UI_XP_SKILL_DOWN.displayListContainer;
                break;
            case EffectLayerEnum.LayerUIXPSkillUp:
                parent = LayerManager.UI_XP_SKILL_UP.displayListContainer;
                break;
        }
        return parent;
    }

    public static isSceneLayer(layer:EffectLayerEnum):boolean {
        return layer < EffectLayerEnum.LayerObjUp || layer == EffectLayerEnum.LayerSceneUpBottom;
    }

    public static isUILayer(layer:EffectLayerEnum):boolean {
        return layer == EffectLayerEnum.LayerUIXPSkillDown || layer == EffectLayerEnum.LayerUIXPSkillUp;
    }

    public playComp():void
    {
        this.destroy();//Log.trace("playComp=" + egret.getTimer(), this.vo.effectId);
    }

    /**
     * 添加特效目标-用于播放管理,在play前调用
     * @param {EffectTargetVo} effectTargetVo
     */
    public setEffectTarget(effectTargetVo:EffectTargetVo):void
    {
        this.effectTargetVo = effectTargetVo;
        this.effectTargetVo.play();
    }

    private addStep(isStep:boolean):void {
        if (isStep && this.fadeList) {//增加定时判断
            this.stepBeginTime = egret.getTimer();
            App.TimerManager.doFrame(1, 0, this.step, this);
        } else {
            App.TimerManager.remove(this.step, this);
        }
    }

    private step():void {
        if (this.hasReset || !this.parent) {
            this.addStep(false);
        }
        if (this.fadeList) {
            let curTime:number = egret.getTimer();
            let pastTime:number = curTime - this.stepBeginTime;
            let fadeVo:any;
            for (let i=0;i < this.fadeList.length; i++) {
                fadeVo = this.fadeList[i];
                let activateTime:number = fadeVo[1];
                if (pastTime >= activateTime) {
                    let type:number = fadeVo[0];
                    let targetAlpha:number = fadeVo[3];
                    let workTime:number = fadeVo[2];
                    let timeRat:number = (pastTime - activateTime) / workTime;
                    if (timeRat > 1) timeRat = 1;
                    if (timeRat < 0) timeRat =0;
                    let curAlpha:number;
                    if (type == 0) {//淡出
                        curAlpha = 1 - (timeRat * ((1000 - targetAlpha) / 1000));
                        if (curAlpha <= targetAlpha / 1000) {
                            curAlpha = targetAlpha / 1000;
                            this.fadeList.splice(i, 1);
                        }
                    } else {//淡入
                        curAlpha = timeRat * ((targetAlpha) / 1000);
                        if (curAlpha >= targetAlpha / 1000) {
                            curAlpha = targetAlpha / 1000;
                            this.fadeList.splice(i, 1);
                        }
                    }
                    this.alpha = curAlpha;
                    //console.log("Effect_step:", this.fadeList, fadeVo, this.stepBeginTime, pastTime, timeRat, this.alpha);
                }
            }
        }
    }

    protected resetMovieClip()
    {
        App.LoaderManager.removeCallback(this.urlPrefix, this.loadEffectComp, this);
        super.resetMovieClip();
        this.effectId = 0;
        this.vo = null;
        this.src = null;
        this.customPlayTime = 0;
        this.addStep(false);
        this.fadeList = null;
    }

    public destroy():void
    {
        if (this.hasReset)
        {
            return;
        }
        if (this.effectTargetVo)
        {
            this.effectTargetVo.playComp();
            this.effectTargetVo = null;
        }
        this.hasReset = true;
        let idx:number = Effect.POOL.indexOf(this);
        if (idx != -1)
        {
            Effect.POOL.splice(idx, 1);
        }
        super.destroy();
    }

    public static disposeAll():void
    {
        while (Effect.POOL.length > 0)
        {
            Effect.POOL.pop().destroy();
        }
    }

}