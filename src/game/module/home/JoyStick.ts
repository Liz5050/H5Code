enum TouchState{
    TOUCH_BEGIN,
    TOUCH_CAN_MOVE,
    TOUCH_MOVE,
    TOUCH_END
}

class JoyStick extends fairygui.GComponent {

    private ballBg:GLoader;
    private ball:GLoader;
    private _centerX:number;
    private _centerY:number;
    private circleRadius: number;
    private ballRadius: number;
    private pos:egret.Point=new egret.Point();
    private _closeTime: number;
    private _touchAngle:number;

    public constructor(){
        super();
        this.touchable = false;
        this.loadImgs();
    }

    private loadImgs() {
        this.ballBg = ObjectPool.pop("GLoader");//this.getChild("bg_joystick").asImage;
        this.ballBg.load(URLManager.getModuleImgUrl("bg_joystick.png", "Joystick"));
        this.addChild(this.ballBg);
        this.ball = ObjectPool.pop("GLoader");//this.getChild("btn_joystick").asImage;
        this.ball.x = this.ball.y = 18;
        this.ball.load(URLManager.getModuleImgUrl("btn_joystick.png", "Joystick"));
        this.addChild(this.ball);

        //获取圆环和小球半径
        this.circleRadius = 132/2;
        this.ballRadius = 96/2;
        //获取中心点
        this._centerX = this.circleRadius;
        this._centerY = this.circleRadius;
        //设置锚点
        this.displayObject.anchorOffsetX = this.circleRadius;
        this.displayObject.anchorOffsetY = this.circleRadius;
        this.ball.displayObject.anchorOffsetX = this.ballRadius;
        this.ball.displayObject.anchorOffsetY = this.ballRadius;
        this.ball.x = this._centerX;
        this.ball.y = this._centerY;
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
    }

    public touchMove(stagePos:egret.Point) {
        this.pos.x = this.x;
        this.pos.y = this.y;
        let dist:number = egret.Point.distance(this.pos, stagePos);
        let touchAngle:number = Math.atan2(stagePos.y - this.y, stagePos.x - this.x);
        this._touchAngle = touchAngle;

        if (dist <= this.circleRadius) {//手指距离在圆环范围内
            this.ball.x = this.centerX + stagePos.x - this.x;
            this.ball.y = this.centerY + stagePos.y - this.y;
        } else {//手指距离在圆环范围外
            this.ball.x = Math.cos(touchAngle)*this.circleRadius + this.centerX;
            this.ball.y = Math.sin(touchAngle)*this.circleRadius + this.centerY;
        }
    }

    public close(): void {
        this.ball.x = this._centerX;
        this.ball.y = this._centerY;
        this._closeTime = egret.getTimer();
        this._touchAngle = null;
    }

    get centerY(): number {
        return this._centerY;
    }

    get centerX(): number {
        return this._centerX;
    }

    get closeTime(): number {
        return this._closeTime;
    }

    get touchAngle(): number {
        return this._touchAngle;
    }
}