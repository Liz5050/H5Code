/**
 * 全局通用tips
 */
class Tips extends egret.DisplayObjectContainer {
    /** centertips_bg */
    public static init(cont: any): void {
        this._cont = cont as egret.DisplayObjectContainer;
    }

    /** 显示纯文字提示 */
    public static show(msg: string): void {
        if (this._cont) {
            var toast: Tips = new Tips(msg, App.StageUtils.getWidth(), App.StageUtils.getHeight());
            this._cont.addChild(toast);
        }
    }

    private static _cont: egret.DisplayObjectContainer;

    constructor(msg: string, w: number, h: number) {
        super();

        var tx: egret.TextField = new egret.TextField;
        tx.multiline = true;
        tx.size = 20;
        tx.bold = true;
        tx.textColor = 0xFFFFFF;
        tx.stroke = 2;
        tx.strokeColor = 0;
        tx.text = msg;
        tx.fontFamily = "微软雅黑";
        tx.textAlign = egret.HorizontalAlign.CENTER;
        tx.width = w * .84;
        tx.x = (720 - tx.width) / 2;
        tx.y = 4;
        this.addChild(tx);

        this.anchorOffsetX = this.width * .5;
        this.anchorOffsetY = this.height * .5;
        this.x = w * .5;
        this.y = h * .318;

        this.alpha = 0;

        egret.Tween.get(this)
            .to({ alpha: 1 }, 800, egret.Ease.quintOut)
            //.to( { scaleX: 1.2, scaleY: 1.2 }, 100, egret.Ease.quintOut )
            //.call( ()=>{ console.log( "tween tween tween" ); } ) 
            //.to( { scaleX: 1.0, scaleY: 1.0 }, 300, egret.Ease.quintIn )
            .wait(1600)
            .to({ alpha: 0 }, 1200, egret.Ease.quintIn).call(() => {      /*  y: this.y - 50, */
                if (this.parent) {
                    this.parent.removeChild(this);
                }
            });
    }
}
