class QualifyingLogo extends fairygui.GComponent {
    private scoreTxt: fairygui.GTextField;
    private stageTxt: fairygui.GRichTextField;
    private circleImg: fairygui.GComponent;
    private shapeMask: egret.Shape;
    private startAngle:number = 90;
    private c1: fairygui.Controller;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.c1 = this.getController('c1');
        this.scoreTxt = this.getChild('txt_score').asTextField;
        this.stageTxt = this.getChild('txt_stage').asRichTextField;
        this.circleImg = this.getChild('img_circle').asCom;
        this.shapeMask = new egret.Shape();
        this.shapeMask.x = 12;
        this.displayListContainer.addChild(this.shapeMask);
        this.circleImg.mask = this.shapeMask;
    }

    public update(data: simple.SQualifyingInfo): void {
        this.c1.selectedIndex = QualifyingCache.getLevelBig(data.level_I) - 1;
        let nextScore:number = ConfigManager.qualifying.getNextScore(data.level_I);
        this.scoreTxt.text = data.score_I + '/' + nextScore;
        this.stageTxt.text = QualifyingCache.getLevelStr(data.level_I);
        let curScore:number = ConfigManager.qualifying.getCurScore(data.level_I);
        this.setValue(data.score_I - curScore, nextScore - curScore);
    }

    private setValue(value:number,max:number):void {
        value = Math.min(value,max);
        let angle:number = value / max * (360 - 55*2) + this.startAngle + 55;
        this.changeGraphics(angle);
    }

    private changeGraphics(angle: number) {
        let r: number = 100;
        this.shapeMask.graphics.clear();
        this.shapeMask.graphics.moveTo(85, 85);
        this.shapeMask.graphics.beginFill(0x00ffff, 1);
        this.shapeMask.graphics.lineTo(r, 2*r);
        this.shapeMask.graphics.drawArc(85, 85, r, this.startAngle * Math.PI / 180, angle * Math.PI / 180, false);
        this.shapeMask.graphics.lineTo(85, 85);
        this.shapeMask.graphics.endFill();
    }
}