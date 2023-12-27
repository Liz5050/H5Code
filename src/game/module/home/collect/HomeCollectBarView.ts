class HomeCollectBarView extends fairygui.GComponent {
    private c1: fairygui.Controller;
    private c2: fairygui.Controller;//0显示图片内容1显示文字内容
    private collectBar:UIProgressBar;

    private gStartCollect:boolean = false;
    private contentTxt: fairygui.GRichTextField;
    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.collectBar = this.getChild("progressBar") as UIProgressBar;
        this.collectBar.setStyle(URLManager.getSceneIcon("progressBar_3"), URLManager.getSceneIcon("bg_2"), 246, 38, 22, 12.5,UIProgressBarType.Mask);
        this.collectBar.showEffect(URLManager.getSceneIcon("barEffect_1"),27);
        this.collectBar.setValue(0,1);
        this.contentTxt = this.getChild('txt_content').asRichTextField;
        this.c1 = this.getController("c1");
        this.c2 = this.getController("c2");
    }

    public startCollect(data:any):void {
        let past: number = data.past;
        let total: number = data.total;

        let content:string = data.content;
        if (content) {
            this.c2.selectedIndex = 1;
            this.contentTxt.text = content;
        } else {
            this.c2.selectedIndex = 0;
        }

        if(!this.gStartCollect) {
            this.gStartCollect = true;
            this.collectBar.setValue(past,total);
            this.collectBar.addEventListener(UIProgressBar.PROPGRESS_COMPLETE,this.onCompleteHandler,this);
            this.collectBar.setValue(total,total,true,true,total-past);
        }
        this.visible = true;
    }

    /**终止采集 */
    public stopCollect():void {
        this.collectEnd();
    }

    /**采集完成 */
    private onCompleteHandler(evt:egret.Event):void {
        this.collectEnd();
    }

    /**结束采集 */
    private collectEnd():void {
        this.collectBar.removeEventListener(UIProgressBar.PROPGRESS_COMPLETE,this.onCompleteHandler,this);
        this.collectBar.setValue(0,1);
        this.gStartCollect = false;
        // this.hide();
        this.visible = false;
    }

    public get isCollecting():boolean {
        return this.gStartCollect;
    }

    public hide():void {
        App.DisplayUtils.removeFromParent(this.displayObject);
    }
}