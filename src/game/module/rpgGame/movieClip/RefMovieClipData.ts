/**
 * 引用计数的动画内容
 * @author Chris
 */
import MovieClipData = egret.MovieClipData;

class RefMovieClipData
{
    /**
     * 记录此RefMovieClipData类型对象创建的个数.
     * **/
    public static count:number = 0;
    /**
     * 上一次使用时间,毫秒数.
     * **/
    public lastTime:number = 0;
    /**
     * 记录此RefMovieClipData正在使用的次数,在此movieClipData被引用的时候会++
     * 而删除引用的时候会--.
     * **/
    public useTime:number = 0;
    /**
     * 位图数据来源，目前的渲染机制是来自于一个movieClip.
     * **/
    public movieClipSource:MovieClipData;
    /**
     * 位图数据源.
     * **/
    public mcDataSet:any;
    /**
     * 位图数据源.
     * **/
    public mcTexture:egret.Texture;
    /**
     * mc名.
     * **/
    public mcName:string;

    public constructor()
    {
        RefMovieClipData.count++;
    }

    public setMovieClipData(value:MovieClipData, name:string):void
    {
        this.movieClipSource = value;
        this.mcName = name;
    }

    public setMovieClipDataSource(mcDataSet:any, mcTexture:any, mcName:string):void
    {
        this.mcDataSet = mcDataSet;
        this.mcTexture = mcTexture;
        this.mcName = mcName;
    }

    public getMovieClipData():MovieClipData
    {
        return this.movieClipSource;//new egret.MovieClipDataFactory(this.mcDataSet, this.mcTexture).generateMovieClipData(this.mcName);
    }

    /**
     * 释放当前数据.
     * **/
    public dispose():void
    {
        RefMovieClipData.count--;
        App.LoaderManager.destroyRes(this.mcName + ".json");
        let ret:boolean = App.LoaderManager.destroyRes(this.mcName + ".png");
        // Log.trace(Log.CLEANUP, ">>>ModelDispose:" + this.mcName, "ret->" + ret);
        let clipData = this.movieClipSource;
        if (clipData) {
            clipData.mcData = null;
            clipData.numFrames = 0;
            clipData.frameRate = 0;
            clipData.textureData = null;
            if (clipData.spriteSheet) {
                clipData.spriteSheet.dispose();
                clipData.spriteSheet = null;
            }
            if (clipData.frames) clipData.frames.length = 0;
            if (clipData.labels) clipData.labels.length = 0;
            if (clipData.events) clipData.events.length = 0;
        }
        this.movieClipSource = null;
        this.mcDataSet = null;
        if (this.mcTexture) {
            this.mcTexture.dispose();
            this.mcTexture = null;
        }
        this.mcName = null;
        this.useTime = 0;
        this.lastTime = 0;
        ObjectPool.push(this);
    }
}