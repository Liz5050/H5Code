class BitmapFrame {
    private gSource: egret.SpriteSheet;
    private gFrameTexture: egret.Texture;
    private cusName: string;
    private gX:number;
    private gY:number;
    private gWidth:number;
    private gHeight:number;
    private gOffX:number;
    private gOffY:number;
    /**
     * 统计此张位图上次使用时间,和释放相关
     */
    public lastUseTime: number;
    public isDraw:boolean = false;
    public constructor(cusTexture: egret.SpriteSheet,cusName:string, cusX: number, cusY: number,cusWidth:number,cusHeight:number,cusOffX:number,cusOffY) {
        this.gSource = cusTexture;
        this.cusName = cusName;
        this.gX = cusX;
        this.gY = cusY;
        this.gWidth = cusWidth;
        this.gHeight = cusHeight;
        this.gOffX = cusOffX;
        this.gOffY = cusOffY;
    }

    public create(): void {
        if (this.gFrameTexture == null && this.gSource != null) {
            this.gFrameTexture = this.gSource.getTexture(this.cusName);
            this.isDraw = true;
        }
    }

    public get texture():egret.Texture {
        return this.gFrameTexture;
    }

    public get width():number {
        return this.gWidth;
    }

    public get height():number {
        return this.gHeight;
    }

    public get offX():number {
        return this.gOffX;
    }

    public get offY():number {
        return this.gOffY;
    }

    public dispose(): void {
        this.gSource = null;
        this.cusName = "";
        this.gX = 0;
        this.gY = 0;
        this.gWidth = 0;
        this.gHeight = 0;
        this.gOffX = 0;
        this.gOffY = 0;
        this.isDraw = false;
        if (this.gFrameTexture) {
            this.gFrameTexture.dispose();
            this.gFrameTexture = null;
        }
    }
}