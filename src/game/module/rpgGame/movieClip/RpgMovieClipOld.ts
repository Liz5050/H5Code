// enum Dir {
//     Top,
//     TopRight,
//     Right,
//     BottomRight,
//     Bottom,
//     BottomLeft,
//     Left,
//     TopLeft
// }

// class Action {
//     public static Prepare: string = "prepare";
//     public static Attack: string = "attack";
//     public static Attacked: string = "attacked";
//     public static Die: string = "die";
//     public static Move: string = "move";
//     public static Stand: string = "stand";
// }

/**
 * 原生白鹭MovieClip
 */
class RpgMovieClipOld extends egret.MovieClip {
    //测试，先不读表
    private static OFFSET_IDS: number[] = [9101001, 9101002, 9101003, 9101004, 9101005];
    private static OFFSET_NUM: number[] = [1150, 820, 760, 650, 650];
    // private McFrameTime: number = 1000 / 8;
    private DESIGN_CENTER: number = 385; //770*770

    // private mcData: egret.MovieClipData;
    private currAction: string;
    private currDir: Dir;
    // private currFrame: number;
    // private startFrame: number;
    // private endFrame: number;
    // private currFrameTime: number;
    // private totalPlayNum: number;
    // private currPlayNum: number;
    private complateAction: Function;
    private complateActionObj: any;

    // private defaultBitmap: egret.Bitmap;
    private avatarResName: number;

    public constructor() {
        super();

        // this.defaultBitmap = new egret.Bitmap();
    }

    private setBitmap(texture: egret.Texture, scaleX: number): void {
        // this.defaultBitmap.texture = texture;
        this.scaleX = scaleX;
        AnchorUtil.setAnchorX(this, 0.5);
        AnchorUtil.setAnchorY(this, 1);
    }

    public setDefault(resName: string): void {
        this.setBitmap(RES.getRes(resName), 1);
    }

    public setMcData(mcData: egret.MovieClipData, avatarResName: string): void {
        // this.mcData = mcData;

        this.movieClipData = mcData;
        this.avatarResName = parseInt(avatarResName);
        // Log.trace("this.avatarResName：：：" + this.avatarResName);
        // if (this.mcData && 12 == this.mcData.frameRate)
        //     this.McFrameTime = 1000 / this.mcData.frameRate;
        // // Log.trace("mcData 设置帧率: " + this.McFrameTime);

        if (null == this.movieClipData && null == this.movieClipData.mcData) {
            Log.trace(Log.RPG, "不存在指定资源：" + avatarResName);
            return;
        }
        // this.x = this.y = -this.DESIGN_CENTER;


        // AnchorUtil.setAnchorX(this, 0.5);
        // AnchorUtil.setAnchorY(this, 1);
        // this.anchorOffsetX = -this.DESIGN_CENTER;
        // this.anchorOffsetY = -this.DESIGN_CENTER;

        // this.movieClipData.
    }

    // public runAction(advancedTime: number): void {
    //     if (!this.mcData) {
    //         return;
    //     }

    //     this.currFrameTime += advancedTime;
    //     if (this.currFrameTime >= this.McFrameTime) {
    //         this.currFrameTime = 0;
    //         this.currFrame++;
    //         if (this.currFrame > this.endFrame) {
    //             this.currFrame = this.startFrame;
    //             this.currPlayNum++;
    //         }
    //         if (this.totalPlayNum && this.currPlayNum >= this.totalPlayNum) {
    //             this.complateAction && this.complateAction.apply(this.complateActionObj);
    //         } else {
    //             var bitmapTexture: egret.Texture = this.mcData.getTextureByFrame(this.currFrame);
    //             this.setBitmap(bitmapTexture, this.scaleX);
    //         }
    //     }
    // }

    public gotoAction(gotoAction: string, gotoDir: Dir, cover: boolean = false): void {
        if (!this.movieClipData || !this.movieClipData.mcData) {
            return;
        }

        if (!cover) {
            if (this.currAction == gotoAction && this.currDir == gotoDir) {
                return;
            }
        }

        let totalPlayNum: number = -1;
        // if (gotoAction == Action.Attack
        //     || gotoAction == Action.Attacked
        //     || gotoAction == Action.Die) {
        //     totalPlayNum = 1;
        // }
        // if (gotoAction == Action.Attack) {
        //     totalPlayNum = 1;
        // }

        //0上 1右上 2右 3右下 4下
        let dir: number;
        let scaleX: number;
        if (gotoDir == Dir.Top) {
            dir = 0;
            scaleX = 1;
        } else if (gotoDir == Dir.TopRight) {
            dir = 1;
            scaleX = 1;
        } else if (gotoDir == Dir.Right) {
            dir = 2;
            scaleX = 1;
        } else if (gotoDir == Dir.BottomRight) {
            dir = 3;
            scaleX = 1;
        } else if (gotoDir == Dir.Bottom) {
            dir = 4;
            scaleX = 1;
        } else if (gotoDir == Dir.BottomLeft) {
            dir = 3;
            scaleX = -1;
        } else if (gotoDir == Dir.Left) {
            dir = 2;
            scaleX = -1;
        } else if (gotoDir == Dir.TopLeft) {
            dir = 1;
            scaleX = -1;
        }

        var actionName: string = gotoAction + "_" + dir;
        this.gotoAndPlay(actionName, totalPlayNum);
        // try {
        //     this.gotoAndPlay(actionName, totalPlayNum);
        // } catch (e) {
        //     egret.$warn(1017, actionName);
        // }
        // this.gotoAndPlay(actionName, -1);

        this.currAction = gotoAction;
        this.currDir = gotoDir;

        this.scaleX = scaleX;

        let offsetNum: number = this.DESIGN_CENTER;
        let offsetIndex: number = RpgMovieClipOld.OFFSET_IDS.indexOf(this.avatarResName);
        if (offsetIndex != -1) {
            offsetNum = RpgMovieClipOld.OFFSET_NUM[offsetIndex] / 2;
        }

        // this.setBitmap(bitmapTexture, scaleX);
        if (scaleX > 0) {
            this.x = this.y = -offsetNum;
        } else {
            this.x = offsetNum;
            this.y = -offsetNum;
        }
    }

    public setComplateAction(complateAction: Function, complateActionObj: any): void {
        this.complateAction = complateAction;
        this.complateActionObj = complateActionObj;
    }

    public destroy(): void {
        App.DisplayUtils.removeFromParent(this);
        ObjectPool.push(this);

        // this.defaultBitmap.texture = null;
        // this.defaultBitmap = null;

        // this.mcData = null;
        this.currAction = null;
        this.currDir = null;
        this.complateAction = null;
        this.complateActionObj = null;
    }

    public getCurrAction(): string {
        return this.currAction;
    }

    public getCurrDir(): Dir {
        return this.currDir;
    }
}