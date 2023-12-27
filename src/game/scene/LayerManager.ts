/**
 * 游戏层级类
 */
class LayerManager {

    /**
     * 加载页层
     * @type {BaseEuiLayer}
     */
    public static Loading: fairygui.GComponent = new fairygui.GComponent();

    /**
     * 游戏背景层
     * @type {BaseSpriteLayer}
     */
    public static Game_Bg: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();

    /**
     * 主游戏层
     * @type {BaseSpriteLayer}
     */
    public static Game_Main: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();

    /**
    * 主界面层
    */
    public static UI_Home: fairygui.GComponent = new fairygui.GComponent();
    /**切地图的淡入层 (不可点击)*/
    public static UI_SecenEffect: fairygui.GComponent = new fairygui.GComponent();

    /**
     * UI主模块
     */
    public static UI_Main: fairygui.GComponent = new fairygui.GComponent();

    /**
     * 场景遮罩
     */
    public static Game_Mask: fairygui.GComponent = new fairygui.GComponent();

    /**
     * UI培养层
     */
    public static UI_Cultivate: fairygui.GComponent = new fairygui.GComponent();

    /**
     * 全屏技能下层
     */
    public static UI_XP_SKILL_DOWN: fairygui.GComponent = new fairygui.GComponent();
    /**
     * 全屏技能上层
     */
    public static UI_XP_SKILL_UP: fairygui.GComponent = new fairygui.GComponent();

    /**
     * UI弹出框层
     */
    public static UI_Popup: fairygui.GComponent = new fairygui.GComponent();

    /**
     * UI警告消息层
     */
    public static UI_Message: fairygui.GComponent = new fairygui.GComponent();

    /**
     * UITips层
     */
    public static UI_Tips: fairygui.GComponent = new fairygui.GComponent();

    /**
     * UI引导层
     */
    public static UI_Guide: fairygui.GComponent = new fairygui.GComponent();

    public static UI_Lock: fairygui.GComponent = new fairygui.GComponent();
    public static UI_DEMO: fairygui.GComponent = new fairygui.GComponent();

    public static init(): void {
        LayerManager.UI_Main.name = "UI_Main";
        LayerManager.UI_Popup.name = "UI_Popup";
        LayerManager.Loading.touchable = false;
        LayerManager.Game_Bg.touchEnabled = false;
        LayerManager.Game_Main.touchEnabled = false;
        LayerManager.Game_Mask.touchable = false;
        LayerManager.UI_XP_SKILL_DOWN.touchable = false;
        LayerManager.UI_XP_SKILL_UP.touchable = false;

        let stage: egret.Stage = App.StageUtils.getStage();
        stage.addChild(LayerManager.Game_Bg);
        stage.addChild(LayerManager.Game_Main);

        //fairygui
        fairygui.UIConfig.defaultFont = "Microsoft YaHei";
        fairygui.UIConfig.buttonSound = URLManager.getPackResUrl(PackNameEnum.Sound, "dianjianniu");
        stage.addChild(fairygui.GRoot.inst.displayObject);

        fairygui.GRoot.inst.addChild(LayerManager.Loading);
        fairygui.GRoot.inst.addChild(LayerManager.Game_Mask);
        fairygui.GRoot.inst.addChild(LayerManager.UI_Home);
        fairygui.GRoot.inst.addChild(LayerManager.UI_SecenEffect);
        LayerManager.UI_SecenEffect.touchable = false;
        fairygui.GRoot.inst.addChild(LayerManager.UI_Main);
        fairygui.GRoot.inst.addChild(LayerManager.UI_Cultivate);

        fairygui.GRoot.inst.addChild(LayerManager.UI_XP_SKILL_DOWN);
        fairygui.GRoot.inst.addChild(LayerManager.UI_XP_SKILL_UP);
        fairygui.GRoot.inst.addChild(LayerManager.UI_Popup);
        fairygui.GRoot.inst.addChild(LayerManager.UI_Message);
        fairygui.GRoot.inst.addChild(LayerManager.UI_Tips);
        fairygui.GRoot.inst.addChild(LayerManager.UI_Guide);

        fairygui.GRoot.inst.addChild(LayerManager.UI_DEMO);

        if(DEBUG){
            //debug编译 方便本地测试UI的drawCall
            if(DebugUtils.isDebugDC()){
                LayerManager.Game_Bg.visible = false;
                LayerManager.Game_Main.visible = false;     
                //LayerManager.UI_Cultivate.visible = false;
                //LayerManager.UI_Main.visible = false;
                //LayerManager.UI_Popup.visible = false;
                LayerManager.UI_Guide.visible = false;
                LayerManager.UI_Message.visible = false;
                LayerManager.UI_Tips.visible = false;
                LayerManager.UI_Home.visible = false;
            }
        }
        
        
        
    }
}