/**
 * 移动特效
 * @author Chris
 */
class MoveEffect extends egret.DisplayObjectContainer
{
    public static TYPE_NORMAL:number = 0;
    public static TYPE_ARROW:number = 1;
    public static TYPE_PARABOLA:number = 2;

    /*** 使用池*/
    private static POOL:Array<MoveEffect> = [];

    private effectId:number;

    private effect:Effect;

    private effPlayRet:boolean;

    private priority:number;

    private speed:number;

    private moveType:number;

    private shadowFreq:number;

    private shadowAlpha:number;

    private shadowDuration:number;

    private acceleration:number;

    private moveDis:number;

    private toPoint:egret.Point;

    private toObj:RpgGameObject;

    private terminated:boolean;

    private overFunc:Function;

    private updateFunc:Function;

    private updateFreq:number = 1;

    private overEffectId:number;
    /** 特效高度*/
    private effectHeight:number;
    /** 方向偏移角度*/
    private offAngle:number;
    /** 开始缩放系数*/
    private scaleFrom:number;
    /** 目标缩放系数*/
    private scaleTo:number;
    /** 缩放频率x帧/次*/
    private scaleFreq:number;
    /** 缩放增量*/
    private scaleIncre:number;
    /** 飞行拖尾[特效id, 特效类型(0不旋转角度1旋转), 拖尾间隔]*/
    private tailVo:number[];
    /** 飞行拖尾播放索引*/
    private tailPlayIdx:number=0;

    private effectTargetVo:EffectTargetVo;

    public constructor()
    {
        super();
    }

    private create(effectId:number):void
    {
        this.terminated = false;
        this.effectId = effectId;
        if (MoveEffect.POOL.indexOf(this) == -1)
        {
            MoveEffect.POOL.push(this);
        }
    }

    /**
     * 飞行点到点.
     * **/
    public movePointToPoint(effectId:number, fromPoint:egret.Point, toPoint:egret.Point, toObj:RpgGameObject, layer:number = -1, priority:number = 0
                            , moveVo:any, updateFunc:Function = null, overFun:Function = null):void
    {
        let self = this;
        self.create(effectId);
        self.priority = priority;
        self.speed = moveVo.speed || 500;
        self.moveType = moveVo.type || MoveEffect.TYPE_NORMAL;
        self.shadowFreq = moveVo.shadowFreq || 0;
        self.shadowAlpha = moveVo.shadowAlpha ? moveVo.shadowAlpha/1000 : 1;
        self.shadowDuration = moveVo.shadowDuration || 0;
        self.acceleration = moveVo.acceleration ? moveVo.acceleration/1000 : 0;
        self.moveDis = moveVo.moveDis || 0;
        self.overEffectId = moveVo.endEffectId || 0;
        self.effectHeight = moveVo.height || 0;
        self.offAngle = moveVo.offAngle || 0;
        let scaleList:number[] = moveVo.scale;
        if (scaleList) {
            self.scaleFrom = scaleList[0]/1000;
            self.scaleTo = scaleList[1]/1000;
            self.scaleFreq = scaleList[2];
            self.scaleIncre = scaleList[3]/1000;
        }
        self.tailVo = moveVo.tail;
        self.toPoint = toPoint;
        self.toObj = toObj as RpgGameObject;
        self.updateFunc = updateFunc;
        self.overFunc = overFun;

        if (CacheManager.effect.canPlayEffect(self.effectTargetVo) == false)
        {
            self.terminate();
            return;
        }

        if (!self.toPoint)
        {
            self.terminate();
            return;
        }

        //起点位置
        self.x = fromPoint.x;
        self.y = fromPoint.y;
        // if (fromPoint.x == CacheManager.king.kingEntity.x) 
        //     self.ct = true;
        // else 
        //     self.ct = false;
        // Log.trace(1, "effectId=", effectId, fromPoint.x, fromPoint.y, "->", toPoint.x, toPoint.y, "moveOff=", toPoint.x - fromPoint.x, toPoint.y - fromPoint.y);
        let parent:egret.DisplayObjectContainer = Effect.getParent(toObj, layer);
        parent.addChild(self);
        self.move(parent);
    }
	//private static ct:number = 0;private cct:number;
    private stepX:number;
    private stepY:number;
    private tempX:number;
    private tempY:number;
    private moveTime:number;
    private beginTime:number;
    private lastTime:number;
    private stepCount:number=0;
    private ehStepX:number=0;
    private ehStepY:number=0;

    private move(parent:egret.DisplayObjectContainer):void
    {
        let self = this;
        if (self.effect)
        {
            self.effect.destroy();
            console.log("problem???has effect before move");
        }
		//if (!self.cct) self.cct = ++MoveEffect.ct;
        let startPos:egret.Point = new egret.Point(0, 0);
        let endPos:egret.Point = new egret.Point(self.toPoint.x - self.x, self.toPoint.y - self.y);
        let angle:number = Math.atan2((self.toPoint.y - self.y), (self.toPoint.x - self.x));
        if (self.offAngle != 0)
        {
            angle += MathUtils.PIDIVIDE_180 * self.offAngle;
        }
        let xVec:number = Math.cos(angle);
        let yVec:number = Math.sin(angle);
        if (self.moveDis > 0)
        {
            self.toPoint = new egret.Point(self.x + self.moveDis * xVec, self.y + self.moveDis * yVec);
        }
        self.effect = ObjectPool.pop("Effect");
        self.effPlayRet = self.effect.playNormalEffect(self.effectId, startPos, endPos, self, 0, 0, EffectLayerEnum.LayerSpecified);
        if (self.effPlayRet)
        {
            if (self.scaleFrom > 0) self.effect.setScale(self.scaleFrom);
        }
        else
        {
            self.effect = null;
        }
        //Log.trace(1,`EffectPos=cct=${self.cct}-${self.x},${self.y}->${self.toPoint.x},${self.toPoint.y},dis=${egret.Point.distance(self.toPoint, new egret.Point(self.x, self.y))}`);

        //计算飞行轨迹时间.
        let dis:number = App.MathUtils.getDistance(self.x,self.y,self.toPoint.x,self.toPoint.y);
        let totalTime:number = Math.round((dis / (self.speed / 1000)));
        let avaSpeed:number = (dis / totalTime);
        self.stepX = avaSpeed * xVec;
        self.stepY = avaSpeed * yVec;
        self.moveTime = totalTime;//Log.trace("move=", "(" + self.toPoint.x + "," + self.toPoint.y + ")" + dis, totalTime, avaSpeed, self.stepX, self.stepY)
        if (self.effectHeight > 0) {
            self.ehStepX = self.effectHeight * xVec;
            self.ehStepY = self.effectHeight * yVec;
        }

        self.adjustOffset();

        if (self.moveTime <=10)
        {
            self.terminate();
            return;
        }
        self.tempX = self.x;
        self.tempY = self.y;

        self.beginTime = egret.getTimer();
        self.lastTime = self.beginTime;
        App.TimerManager.doFrame(1, 0, self.step, self);
    }

    private adjustOffset():void
    {
        /*if (this.moveType == MoveEffect.TYPE_PARABOLA)
        {
            gOffsetCtrl.Jump(gMoveTime, 0.003, 0, 0, -250);
        }
        else*/ if (this.moveType == MoveEffect.TYPE_ARROW)
        {
            this.rotation = (Math.atan2((this.toPoint.y - this.y), (this.toPoint.x - this.x)) * MathUtils.PIDIVIDED_BY_180) + 90;
        }
    }

    private terminate():void
    {
        if (this.terminated)
        {
            return;
        }
        this.terminated = true;
        this.onOver();
        let idx:number = MoveEffect.POOL.indexOf(this);
        if (idx != -1)
        {
            MoveEffect.POOL.splice(idx, 1);
        }
        App.DisplayUtils.removeFromParent(this);
        App.TimerManager.remove(this.step, this);
        this.clear();

        ObjectPool.push(this);
    }

    private onOver() : void
    {
        if (this.overFunc != null)
        {
            this.overFunc();
            this.overFunc = null;
        }
        if (this.overEffectId != 0)
        {
            let overEffect:Effect = ObjectPool.pop("Effect");
            let heartPos:egret.Point = this.toObj ? this.toObj.bodyHeartPos : this.toPoint;
            let eLayer:EffectLayerEnum = this.toObj ? EffectLayerEnum.LayerObjUp : EffectLayerEnum.LayerSceneUp;
            overEffect.playNormalEffect(this.overEffectId, RpgGameUtils.ZERO_POS, RpgGameUtils.ZERO_POS, this.toObj, heartPos.x, heartPos.y, eLayer);
        }
    }

    private onUpdate() : void
    {
        if (this.updateFunc != null)
        {
            this.updateFunc();
        }
    }

    /**
     * 帧循环.
     * **/
    private step():void
    {
        let self = this;
        self.stepCount++;
        let nowTime:number = egret.getTimer();
        let dTime:number = nowTime - self.lastTime;
        self.lastTime = nowTime;

        let accfactor:number = 1 + self.acceleration * self.stepCount;
        if (accfactor < 0) accfactor = 0.1;
        self.moveTime = self.moveTime - dTime * accfactor;//Log.trace("step=", self.stepX * dTime, self.stepY * dTime)
        self.tempX = self.tempX + self.stepX * dTime * accfactor;
        self.tempY = self.tempY + self.stepY * dTime * accfactor;
        self.updatePosition();
        let preX:number = self.x + self.ehStepX;
        let preY:number = self.y + self.ehStepY;

        let endX:number = self.toPoint.x;
        let endY:number = self.toPoint.y;
        if (self.moveTime <= 10 || //飞行结束判断
            ((self.stepX > 0 && preX - endX > 0) || (self.stepX < 0 && preX - endX < 0) ||
            (self.stepY > 0 && preY - endY > 0) || (self.stepY < 0 && preY - endY < 0))
            )
        {
            self.x = endX;
            self.y = endY;
            self.terminate();
            return;
        }

        // gOffsetCtrl.update();
        if (self.stepCount % self.updateFreq == 0)
        {
            self.onUpdate();
        }
        //飞行残影
        if (self.shadowFreq != 0 && self.stepCount % self.shadowFreq == 0)
        {
            self.createShadow(self.shadowDuration);
        }
        //飞行缩放
        if (self.effPlayRet
            && self.scaleIncre
            && self.stepCount % self.scaleFreq == 0
            && (self.scaleIncre > 0 ? self.effect.scaleX < self.scaleTo : self.effect.scaleX > self.scaleTo))
        {
            self.effect.setScale(self.effect.scaleX + self.scaleIncre);
        }
        //飞行拖尾
        if (self.tailVo) {
            let movePastTime:number = nowTime - self.beginTime;
            let tailDelay:number = self.tailVo[2];
            let tailPlayIdx:number = self.tailPlayIdx;
            if (tailDelay > 0 && (movePastTime / tailDelay >> 0) > tailPlayIdx) {
                let tailEffect:Effect = ObjectPool.pop("Effect");
                let pos:egret.Point = RpgGameUtils.point.setTo(this.x, this.y);
                if (self.tailVo[1] == 1) {
                    tailEffect.playPoint2PointEffect(self.tailVo[0], pos, this.toPoint, this.toObj, 0, 0);
                } else {
                    tailEffect.playNormalEffect(self.tailVo[0], pos, this.toPoint, this.toObj, 0, 0);
                }
                self.tailPlayIdx++;
            }
        }
    }

    /** 当前残影集合 */
    private shadowList: Array<any> = [];

    private createShadow(tweenTime:number):void
    {
        let _shadow:egret.Bitmap = this.createBitmap(this.effect);
        if (null == _shadow)
            return;
        if (!this.shadowList)
            this.shadowList = [];
        this.shadowList.push(_shadow);//Log.trace(this.name, this.shadowList.length);

        CacheManager.king.kingEntity.gameView.getGameEffectUpLayer().addChild(_shadow);
        if (tweenTime > 0) egret.Tween.get(_shadow).to({ alpha: 0 }, tweenTime).call(this.onShadowPlayComplete, this, [_shadow]);
    }

    /**
     * 进行快照
     * **/
    private createBitmap(cusSource: MovieClip): egret.Bitmap 
    {
        let _bitmap: egret.Bitmap = ObjectPool.pop("egret.Bitmap");
        if (cusSource == null || cusSource.movieClipData == null || cusSource.movieClipData.mcData == null || cusSource.movieClipData.numFrames < 1) 
        {
            return null;
        }

        let frame:any = cusSource.movieClipData.frames[cusSource.currentFrame - 1];
        if (!frame) return null;

        _bitmap.texture = cusSource.movieClipData.getTextureByFrame(cusSource.currentFrame);
        _bitmap.scaleX = cusSource.scaleX;
        _bitmap.scaleY = cusSource.scaleY;

        AnchorUtil.setAnchorX(_bitmap, 0);
        AnchorUtil.setAnchorY(_bitmap, 0);

        _bitmap.x = this.x + frame.x;
        _bitmap.y = this.y + frame.y;//Log.trace("frame=", this.effectId, this.x, this.y, frame.x, frame.y, _bitmap.x, _bitmap.y);
        _bitmap.alpha = this.shadowAlpha;
        return _bitmap;
    }

    /**
     * 单独影子生命周期到了，alpha减少为0了.
     * **/
    private onShadowPlayComplete(copyShadow: egret.Bitmap): void 
    {
        this.removeShadow(copyShadow);
    }

    /**
     * 释放影子，存放到对象池.
     */
    private removeShadow(copyShadow: egret.Bitmap): void 
    {
        if (!copyShadow) return;

        App.DisplayUtils.removeFromParent(copyShadow);
        copyShadow.x = 0;
        copyShadow.y = 0;
        copyShadow.scaleX = 1;
        copyShadow.scaleY = 1;
        copyShadow.filters = null;
        copyShadow.alpha = 1;
        copyShadow.texture = null;
        copyShadow.$bitmapData = null;
        egret.Tween.removeTweens(copyShadow);
        if (this.shadowList)
            App.ArrayUtils.remove(this.shadowList, copyShadow);
        ObjectPool.push(copyShadow);
    }

    /**
     * 释放当前所有影子
     */
    private removeAllShadow(): void 
    {
        if (this.shadowList && this.shadowList.length ) 
        {
            while (this.shadowList.length > 0)
            {//let b:egret.Bitmap = this.shadowList.pop();Log.trace("end=", this.effectId, b.x, b.y)
                this.removeShadow(this.shadowList.pop());
            }
        }
        this.shadowList = null;
    }

    /**
     * 更新位置.
     * **/
    private updatePosition():void
    {
        this.x = (this.tempX + 0.5) >> 0;
        this.y = (this.tempY + 0.5) >> 0;//Log.trace(1, "updatePosition=", this.x, this.y)
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

    private clear():void
    {
        let self = this;
        if (self.effect)
        {
            if (self.effPlayRet)
                self.effect.destroy();
            self.effect = null;
        }
        self.x = self.y = 0;
        self.alpha = 1;
        self.scaleX = 1;
        self.scaleY = 1;
        self.overFunc = null;
        self.updateFunc = null;
        self.speed = 0;
        self.toPoint = null;
        self.toObj = null;
        self.stepX = 0;
        self.stepY = 0;
        self.ehStepX = 0;
        self.ehStepY = 0;
        self.stepCount = 0;
        self.moveTime = 0;
        self.tempX = 0;
        self.tempY = 0;
        self.lastTime = 0;
        self.rotation = 0;
        self.moveType = 0;
        self.effPlayRet = true;
        self.updateFreq = 1;
        self.effectId = 0;
        self.priority = 0;
        self.shadowFreq = 0;
        self.shadowAlpha = 1;
        self.shadowDuration = 0;
        self.acceleration = 0;
        self.overEffectId = 0;
        self.effectHeight = 0;
        self.tailVo = null;
        self.tailPlayIdx = 0;
        if (self.effectTargetVo)
        {
            self.effectTargetVo.playComp();
            self.effectTargetVo = null;
        }
        if (self.scaleFrom)
        {
            self.scaleFrom = self.scaleTo = self.scaleFreq = self.scaleIncre = 0;
        }
        self.removeAllShadow();
    }

    /**
     * 释放所有特效.
     * **/
    public static disposeAll():void
    {
        while (MoveEffect.POOL.length > 0)
        {
            MoveEffect.POOL.pop().terminate();
        }
    }
}