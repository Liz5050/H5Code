/**
 * 显示对象工具类
 */
class DisplayUtils extends BaseClass {
    /**
     * 构造函数
     */
    public constructor() {
        super();
    }

    /**
     * 创建一个Bitmap
     * @param resName resource.json中配置的name
     * @returns {egret.Bitmap}
     */
    public createBitmap(resName: string): egret.Bitmap {
        var result: egret.Bitmap = new egret.Bitmap();
        var texture: egret.Texture = RES.getRes(resName);
        result.texture = texture;
        return result;
    }

    /**
     * 从父级移除child
     * @param child
     */
    public removeFromParent(child: egret.DisplayObject) {
        if (!child || child.parent == null)
            return;

        child.parent.removeChild(child);
    }

    /**
     * 居中显示窗口
     * @param name 窗口名称
     * @param isModal 是否模态窗口，默认true
     * @returns {fairygui.Window}
     */
    public centerShowWindow(pkgName: string, name: string, isModal: boolean = true): fairygui.Window {
        let window = new fairygui.Window();
        window.contentPane = fairygui.UIPackage.createObject(pkgName, name).asCom;
        window.modal = true;
        window.show();
        window.centerOn(fairygui.GRoot.inst, true);
        return window;
    }

    public centerObj(view: fairygui.GObject): void {
        view.x = Math.round((fairygui.GRoot.inst.width - view.width) / 2);
        view.y = Math.round((fairygui.GRoot.inst.height - view.height) / 2);
    }

    /**
     * 置灰一个按钮
     * @param btn
     * @param grayed
     * @param forbiddenEnable 是否禁用按钮
     */
    public grayButton(btn: fairygui.GButton, grayed: boolean, forbiddenEnable: boolean = true): void {
        if (btn == null) {
            return;
        }
        let colorData: Array<string> ;
        if(btn.baseUserData) {
           colorData = btn.baseUserData.split("#");//自定各种颜色
        }
        
        let strokeColor : string;
        let grayColor : string;
        let normalColor : string;
        if(colorData) {
            for(let i = 0;i <colorData.length ;i++) {
                let strs = colorData[i].split(":");
                if(strs.length > 1) {
                    switch(strs[0]) {
                        case "strokeColor":
                            strokeColor = strs[1];
                            break;
                        case "grayTitleColor":
                            grayColor = strs[1];
                            break;
                        case "TitleColor":
                            normalColor = strs[1];
                            break;
                    }
                }
            }
        }

        let obj: fairygui.GObject;
        let titleTxt: fairygui.GTextField;
        for (var i: number = 0; i < btn.numChildren; i++) {
            obj = btn.getChildAt(i);
            if (obj.name != "title") {
                obj.grayed = grayed;
            } else {
                titleTxt = obj as fairygui.GTextField;
                if (grayed) {
                    titleTxt.strokeColor = Color.ButtonTitleGrayColor;
                    if(grayColor != null) {
                        titleTxt.color = Number(grayColor);
                    }
                } else {
                    if (strokeColor != null) {
                        titleTxt.strokeColor = Number(strokeColor);
                    }
                    if(normalColor != null) {
                        titleTxt.color = Number(normalColor);
                    }
                }
            }
        }
        btn.touchable = !forbiddenEnable;

    }
    /**
     * 设置组件灰度
     * @param com
     * @param grayed
     * @param excChild 要排除的子的name列表
     */
    public grayCom(com: fairygui.GComponent, grayed: boolean, excChild: string[] = null): void {
        for (var i: number = 0; i < com.numChildren; i++) {
            var g: fairygui.GObject = com.getChildAt(i);
            if (excChild) {
                if (excChild.indexOf(g.name) == -1) {
                    g.grayed = grayed;
                }
            } else {
                g.grayed = grayed;
            }

        }
    }

    /**为按钮添加通用特效 */
    public addBtnEffect(btn:fairygui.GButton,isAdd:boolean,px:number=-3,py:number=-14,followBtnScale:boolean=true,scaleX:number=1,scaleY:number=1):void{
        let effName:string = "__btnEffect__";
        let effObj:fairygui.GObject = btn.getChild(effName);
        let mc:UIMovieClip;
        if(isAdd){            
            if(effObj){
                mc = effObj as UIMovieClip;
            }else{
                mc = UIMovieManager.get(PackNameEnum.MCCommonButton,px,py);
            }           
            mc.name = effName;
            mc.playing = true;
            mc.frame = 0;
            btn.addChildAt(mc,1);
        }else{
            if(effObj){
                mc = effObj as UIMovieClip;
                UIMovieManager.push(mc);
            }
        }
    }

}
