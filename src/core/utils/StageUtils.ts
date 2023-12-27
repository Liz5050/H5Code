/**
 * Stage相关工具类
 */
class StageUtils extends BaseClass {
    //UIStage单例
    // private static _uiStage:eui.UILayer;
    private isLock:boolean;
    private lockAlpha:number;
    private graph:fairygui.GGraph;

    /**
     * 构造函数
     */
    public constructor() {
        super();

        // if (StageUtils._uiStage == null) {
        //     StageUtils._uiStage = new eui.UILayer();
        //     StageUtils._uiStage.percentHeight = 100;
        //     StageUtils._uiStage.percentWidth = 100;
        //     StageUtils._uiStage.touchEnabled = false;
        //     this.getStage().addChild(StageUtils._uiStage);
        // }
    }

    /**
     * 获取游戏的高度
     * @returns {number}
     */
    public getHeight():number {
        return this.getStage().stageHeight;
    }

    /**
     * 获取游戏宽度
     * @returns {number}
     */
    public getWidth():number {
        return this.getStage().stageWidth;
    }

    /**
     * 指定此对象的子项以及子孙项是否接收鼠标/触摸事件
     * @param value
     */
    public setTouchChildren(value:boolean):void {
        this.getStage().touchChildren = value;
    }

    /**
     * 设置同时可触发几个点击事件，默认为2
     * @param value
     */
    public setMaxTouches(value:number):void {
        this.getStage().maxTouches = value;
    }

    /**
     * 设置帧频
     * @param value
     */
    public setFrameRate(value:number):void {
        this.getStage().frameRate = value;
    }

    /**
     * 设置适配方式
     * @param value
     */
    public setScaleMode(value:string):void {
        this.getStage().scaleMode = value;
    }

    /**
     * 获取游戏Stage对象
     * @returns {egret.MainContext}
     */
    public getStage():egret.Stage {
        return egret.MainContext.instance.stage;
    }

    /**
     * 获取唯一UIStage
     * @returns {eui.UILayer}
     */
    // public getUIStage():eui.UILayer {
    //     return StageUtils._uiStage;
    // }

    /**
     * 开启全屏适配方案
     */
    private designWidth: number;
    private designHeight: number;
    private resizeCallback: Function;

    public startFullscreenAdaptation(designWidth: number, designHeight: number, resizeCallback: Function): void {
        this.designWidth = designWidth;
        this.designHeight = designHeight;
        this.resizeCallback = resizeCallback;
        this.stageOnResize();
    }

    private stageOnResize(): void {
        this.getStage().removeEventListener(egret.Event.RESIZE, this.stageOnResize, this);

        var designWidth: number = this.designWidth;
        var designHeight: number = this.designHeight;
        var clientWidth: number = document.body.clientWidth;
        var clientHeight: number = document.body.clientHeight;

        // 增加横屏适配
        if (window["orientation"]) {
            // if (!Sdk.IsOnlineVersion && this.getStage().orientation == egret.OrientationMode.PORTRAIT && (window.orientation == 90 || window.orientation == -90)) {
            if (this.getStage().orientation == egret.OrientationMode.PORTRAIT && (window.orientation == 90 || window.orientation == -90)) {
                clientWidth = document.body.clientHeight;
                clientHeight = document.body.clientWidth;
            }
        }
        // console.log("=======================", this.getStage().orientation, window.orientation)

        var a: number = clientWidth / clientHeight;
        var b: number = designWidth / designHeight;
        var c: number = a / b;
        if (a > b) {
            var c1 = c;
            var c2 = c;
            designWidth = Math.floor(designWidth * c1);
            designHeight = Math.floor(designHeight * c2);
        }
        this.getStage().setContentSize(designWidth, designHeight);
        
        // console.log(a, b, c);
        // console.log(designWidth, designHeight);

        this.resizeCallback && this.resizeCallback();

        this.getStage().addEventListener(egret.Event.RESIZE, this.stageOnResize, this);
    }

    public lock(value:boolean, alpha:number = 0):void {
        if (this.isLock != value) {
            this.isLock = value;
            this.lockAlpha = alpha;console.log("lock:", value);
            if (value) {
                let lockLayer = LayerManager.UI_Lock;
                if (lockLayer.parent == null) {
                    fairygui.GRoot.inst.addChild(lockLayer);
                    this.drawLockShape(lockLayer, alpha);
                }
            } else if (LayerManager.UI_Lock.parent) {
                LayerManager.UI_Lock.parent.removeChild(LayerManager.UI_Lock);
            }
        }
    }

    private drawLockShape(parent:fairygui.GComponent, alpha:number):void {
        if (!this.graph) this.graph = new fairygui.GGraph();
        this.graph.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
        this.graph.drawRect(0, 0, 0, 0, alpha);
        this.graph.addRelation(parent, fairygui.RelationType.Size);
        parent.addChild(this.graph);
    }
}
