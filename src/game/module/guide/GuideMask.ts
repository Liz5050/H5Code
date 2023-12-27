/**
 * 指引遮罩层
 */
class GuideMask extends egret.DisplayObjectContainer {
    private bgSprite: egret.Sprite;
    private eraseSprite: egret.Sprite;
    private bgAlpha: number = 0.7;
    private bgColor: number = 0x000000;
    private hitArea: egret.Rectangle;
    private clickCallBack: Function;
    private clickCalller: Function;

    public constructor() {
        super();
        this.cacheAsBitmap = true;
        this.touchEnabled = true;
        this.touchChildren = false;

        // this.bgSprite = new egret.Sprite();
        // this.bgSprite.touchEnabled = false;
        // this.addChild(this.bgSprite);

        this.eraseSprite = new egret.Sprite();
        this.eraseSprite.blendMode = egret.BlendMode.ERASE;
        this.eraseSprite.touchEnabled = true;
        this.addChild(this.eraseSprite);
    }

    public setClickCallBack(callBack: Function, caller: any): void {
        this.clickCallBack = callBack;
        this.clickCalller = caller;
    }

    public drawRect(x: number, y: number, width: number, height: number): void {
        this.hitArea = new egret.Rectangle(x, y, width, height);
        // this.drawBg();

        this.eraseSprite.graphics.clear();
        this.eraseSprite.graphics.beginFill(0xff0000);
        this.eraseSprite.graphics.drawRect(x, y, width, height);
        this.eraseSprite.graphics.endFill();
    }

    public drawCircle(x: number, y: number, radius: number): void {
        this.hitArea = new GuideCircle(x, y, radius);
        // this.drawBg();

        this.eraseSprite.graphics.clear();
        this.eraseSprite.graphics.beginFill(0xff0000);
        this.eraseSprite.graphics.drawCircle(x, y, radius);
        this.eraseSprite.graphics.endFill();
    }

    /**
     * 覆盖像素点击测试，用来处理点击穿透
     * @returns null表示可穿透
     */
    public $hitTest(stageX: number, stageY: number): egret.DisplayObject {
        //微信小游戏并且是iPhoneX系列的处理
        if (App.DeviceUtils.IsWXGame && App.DeviceUtils.IsIPhoneX) {
            stageY -= UIExtensionManager.WXIPhoneXtop;
        }
        if (this.hitArea && this.hitArea.contains(stageX, stageY)) {
            return null;
        }
        return this;
    }

    public onShowMask(isShow: boolean): void {
        if (isShow) {
            App.StageUtils.getStage().addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
        } else {
            App.StageUtils.getStage().removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
        }
    }

    private drawBg(): void {
        this.bgSprite.graphics.clear();
        this.bgSprite.graphics.beginFill(this.bgColor, this.bgAlpha);
        this.bgSprite.graphics.drawRect(0, 0, fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
        this.bgSprite.graphics.endFill();
    }

    private onClick(e: egret.TouchEvent): void {
        let tempStageY: number = e.stageY;
        //微信小游戏并且是iPhoneX系列的处理
        if (App.DeviceUtils.IsWXGame && App.DeviceUtils.IsIPhoneX) {
            tempStageY -= UIExtensionManager.WXIPhoneXtop;
        }
        if (this.hitArea && this.hitArea.contains(e.stageX, tempStageY)) {
            EventManager.dispatch(UIEventEnum.GuideNextStep);
        } else {
            if (this.clickCallBack && this.clickCalller) {
                this.clickCallBack.call(this.clickCalller);
            }
            EventManager.dispatch(UIEventEnum.GuideMaskClick);
        }
    }
}