/**
 * fairygui工具类
 */
class FuiUtil {
    public constructor() {
    }

    /**
     * 动态创建创建组件
     * @param pkgName 包名
     * @param resName 组件名称
     * @param userClass 组件对应的自定义类名
     * @returns 包未加载或组件不存在，返回null
     */
    public static createObject(pkgName: string, resName: string, userClass?: any): fairygui.GObject {
        if (!ResourceManager.isPackageLoaded(pkgName)) {
            Log.trace(Log.FATAL, `资源包需要提前加载：${pkgName}`);
        }
        let object: fairygui.GObject = fairygui.UIPackage.createObject(pkgName, resName, userClass);
        return object;
    }

    /**
     * 动态创建创建组件
     * @param pkgName 包名
     * @param resName 组件名称
     * @param userClass 组件对应的自定义类名
     * @returns 包未加载或组件不存在，返回null
     */
    public static createComponent(pkgName: string, resName: string, userClass?: any): fairygui.GComponent {
        let object: fairygui.GObject = FuiUtil.createObject(pkgName, resName, userClass);
        if (object != null) {
            return object.asCom;
        }
        return null;
    }

    /**
     * 创建动画
     */
    public static createMc(mcName: string, packageName: string = PackNameEnum.MCStrengthen, userClass?: any): fairygui.GMovieClip {
        let object: fairygui.GObject = FuiUtil.createObject(packageName, mcName, userClass);
        if (object != null) {
            object.touchable = false;
            return object.asMovieClip;
        }
        return null;
    }

    /**
     * 获取红色等阶字体
     *
     *  */
    public static getStageStr(stage: number): string {
        if (stage < 100) {
            let str: string = "";
            let d1: number = Math.floor(stage / 10); //十位
            let d2: number = Math.floor(stage % 10); //个位
            if (d1 > 0) {
                str = (d1 == 1 ? "" : d1) + "十" + (d2 == 0 ? "" : d2);
            } else {
                str = "" + d2;
            }
            return str;
        }
        else {
            let str: string = "";
            let d1: number = Math.floor(stage / 100); //百位
            let d2: number = Math.floor((stage - d1 * 100) / 10); //十位
            let d3: number = Math.floor(stage % 10);//个位
            if (d2 == 0 && d3 == 0) {
                str = d1 + "百";
            }
            if (d2 == 0 && d3 > 0) {
                str = d1 + "百0" + d3;
            }
            else if (d2 > 0 && d3 > 0) {
                str = d1 + "百" + d2 + "十" + d3;
            }
            return str;
        }

    }

    /**
     * 数字转汉字
     */
    public static numToHanzi(num: number): string {
        if (num < 100) {
            let str: string = "";
            let d1: number = Math.floor(num / 10); //十位
            let d2: number = Math.floor(num % 10); //个位
            if (d1 > 0) {
                str = (d1 == 1 ? "" : GameDef.NumberName[d1]) + "十" + (d2 == 0 ? "" : GameDef.NumberName[d1]);
            } else {
                str = "" + GameDef.NumberName[d2];
            }
            return str;
        }
        else {
            let str: string = "";
            let d1: number = Math.floor(num / 100); //百位
            let d2: number = Math.floor((num - d1 * 100) / 10); //十位
            let d3: number = Math.floor(num % 10);//个位
            if (d2 == 0 && d3 == 0) {
                str = d1 + "百";
            }
            if (d2 == 0 && d3 > 0) {
                str = GameDef.NumberName[d1] + "百零" + GameDef.NumberName[d3];
            }
            else if (d2 > 0 && d3 > 0) {
                str = GameDef.NumberName[d1] + "百" + GameDef.NumberName[d2] + "十" + GameDef.NumberName[d3];
            }
            return str;
        }
    }

    /**获取一个购买GM组件(debug状态下才有) */
    public static addDebugBuy(parent: fairygui.GComponent): ToolTipDebugBuy {
        let debugBuy: ToolTipDebugBuy;
        if (App.GlobalData.IsDebug) {
            debugBuy = new ToolTipDebugBuy();
            parent.addChild(debugBuy);
            debugBuy.x = parent.width;
            debugBuy.y = (parent.height - debugBuy.height) / 2;
        }
        return debugBuy;
    }

    /**
     * 重新渲染组件
     * @param component 需要重新渲染的组件。必须存在_children，不能为图片等单对象
     * @param packageName 组件依赖的资源包
     */
    public static renderGComponent(component: fairygui.GComponent, packageName: string) {
        if (component && component._children) {
            for (let child of component._children) {
                if (child instanceof fairygui.GList) {//列表需要单独处理，需处理已存在的列表项，还有恢复列表的对象池中的列表项
                    let items: Array<fairygui.GComponent> = child.itemPool["_pool"][child.defaultItem];
                    if (items) {
                        let pkgName: string;
                        for (let item of items) {
                            pkgName = item.packageItem.owner.name;
                            ResourceManager.load(pkgName, -1, new CallBack(() => {
                                if (item._children && item.numChildren > 0) {
                                    this.renderGComponent(item, pkgName);
                                } else {
                                    //list的item可能是图片等单对象
                                    this.renderSingleGObject(item, packageName);
                                }
                            }, this));
                        }
                    }
                    if (child.numChildren > 0) {
                        this.renderGComponent(child, packageName);
                    }
                } else {
                    if (child instanceof fairygui.GComponent && child.numChildren > 0) {
                        this.renderGComponent(child, packageName);
                    } else {
                        this.renderSingleGObject(child, packageName);
                    }
                }
            }
        }
    }

    /**
     * 渲染单个对象，比如图片
     * @param child 单对象，比如图片。按钮属于复合对象
     */
    private static renderSingleGObject(child: fairygui.GObject, packageName: string): void {
        let childBelongPackageName: string;//子组件所属包
        if (child instanceof fairygui.GImage) {
            childBelongPackageName = child.packageItem.owner.name;//所属包
            if (childBelongPackageName == packageName || ResourceManager.isDependence(packageName, childBelongPackageName)) {
                let atlasSprite: any = child.packageItem.owner["_sprites"][child.packageItem.id];
                let atlasTexture: egret.Texture = RES.getRes(atlasSprite.atlas.file);
                if (atlasTexture) {
                    let uvRect: egret.Rectangle = atlasSprite.rect;
                    child.texture = FuiUtil.createSubTexture(atlasTexture, uvRect);
                    if (child.packageItem.scale9Grid) {
                        child["_content"].scale9Grid = child.packageItem.scale9Grid
                    }
                }
            }
        } else if (child instanceof GLoader && child.url && child.url.indexOf("ui://") != -1) {//只有使用包内资源才需要重新加载
            childBelongPackageName = FuiUtil.getPackageNameByUrl(child.url);
            if (childBelongPackageName == packageName || ResourceManager.isDependence(packageName, childBelongPackageName)) {
                child.reload();
            }
        } else if (child instanceof fairygui.GTextField && child.font && child.font.indexOf("ui://") != -1) {//使用自定义图片字体
            child["updateTextFormat"]();
        } else if (child instanceof fairygui.GMovieClip) {
            childBelongPackageName = child.packageItem.owner.name;//所属包
            if (childBelongPackageName == packageName) {//动画资源与组件在同一个包
                FuiUtil.renderGMovieClip(child);
            }
        }
    }

    private static createSubTexture(atlasTexture: egret.Texture, uvRect: egret.Rectangle): egret.Texture {
        let texture: egret.Texture = new egret.Texture();
        texture.bitmapData = atlasTexture.bitmapData;
        texture.$initData(atlasTexture["$bitmapX"] + uvRect.x, atlasTexture["$bitmapY"] + uvRect.y,
            uvRect.width, uvRect.height, 0, 0, uvRect.width, uvRect.height,
            atlasTexture["$sourceWidth"], atlasTexture["$sourceHeight"]);
        return texture;
    }

    /**
     * 根据资源url获取所属包名
     */
    public static getPackageNameByUrl(url: string): string {
        let packageName: string = "";
        if (url.split("/").length == 4) {
            packageName = url.split("/")[2];
        } else {
            let pos1 = url.indexOf("//");
            if (pos1 == -1) {
                return "";
            }
            let pos2 = url.indexOf("/", pos1 + 2);
            if (pos2 == -1) {
                if (url.length > 13) {
                    let pkgId = url.substr(5, 8);
                    let pkg = fairygui.UIPackage.getById(pkgId);
                    if (pkg != null) {
                        packageName = pkg.name;
                    }
                }
            }
        }
        return packageName;
    }

    /**
     * 重新渲染动画
     */
    public static renderGMovieClip(mc: fairygui.GMovieClip): void {
        let atlasSprite: any;
        let atlasTexture: egret.Texture;
        let uvRect: egret.Rectangle;
        let frame: fairygui.Frame;
        for (let i: number = 0; i < mc.packageItem.frames.length; i++) {
            atlasSprite = mc.packageItem.owner["_sprites"][mc.packageItem.id + "_" + i];
            uvRect = atlasSprite.rect;
            atlasTexture = RES.getRes(atlasSprite.atlas.file);
            frame = mc.packageItem.frames[i];
            frame.texture = FuiUtil.createSubTexture(atlasTexture, uvRect);
        }
    }

    /**
     * 动画资源是否被销毁
     */
    public static isGMovieClipDispose(mc: fairygui.GMovieClip): boolean {
        let innerMc: egret.MovieClip = mc["_movieClip"];
        return !(innerMc.$texture && innerMc.$texture.$bitmapData && innerMc.$texture.$bitmapData.source);
    }
}