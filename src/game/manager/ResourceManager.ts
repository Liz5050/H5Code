/**
 * 资源加载管理。
 * 主要包括UI资源文件、资源包
 */
class ResourceManager {
    private static resLoaded: any = {};
    private static packageLoaded: any = {};
    /**包依赖关系 */
    private static packageDependenceDict: any = {
        [PackNameEnum.Test]: [PackNameEnum.BlueSkin],
        [PackNameEnum.Common]: [PackNameEnum.Num],
        [PackNameEnum.Chat]: [PackNameEnum.ChatFace],
        [PackNameEnum.HomeChat]: [PackNameEnum.ChatFace],
        [PackNameEnum.RpgTeam]: [PackNameEnum.Copy],
        [PackNameEnum.Peak]: [PackNameEnum.PeakCD],
        [PackNameEnum.Team2]: [PackNameEnum.CopyLengend],
        [PackNameEnum.PetChange]: [PackNameEnum.Shape],
        [PackNameEnum.Mount]: [PackNameEnum.Shape],
        [PackNameEnum.MountChange]: [PackNameEnum.Shape],
        [PackNameEnum.MagicWingChange]: [PackNameEnum.Shape],
        [PackNameEnum.SwordPool]: [PackNameEnum.Shape],
        [PackNameEnum.SwordPoolChange]: [PackNameEnum.Shape],
        [PackNameEnum.MagicWeaponStrengthen]: [PackNameEnum.Shape],
        [PackNameEnum.MagicWeaponChange]: [PackNameEnum.Shape],
        [PackNameEnum.MagicArray]: [PackNameEnum.Shape],
        [PackNameEnum.MagicArrayChange]: [PackNameEnum.Shape],
        [PackNameEnum.ShapeBattle]: [PackNameEnum.Shape],
        [PackNameEnum.ShapeBattleChange]: [PackNameEnum.Shape],
        [PackNameEnum.ForgeStrengthen]: [PackNameEnum.Forge],
        [PackNameEnum.ForgeRefine]: [PackNameEnum.Forge],
        [PackNameEnum.ForgeCasting]: [PackNameEnum.Forge],
        [PackNameEnum.ForgeImmortals]: [PackNameEnum.Forge],
        [PackNameEnum.BossHome]: [PackNameEnum.Boss],
    };
    private static costDict: { [name: string]: number } = {};
    private static callBackDict: { [name: string]: Array<CallBack> } = {};
    private static packageDict: { [packageName: string]: PackageResVo } = {};

    /**
     * 按等级加载资源
     * TODO 划分更细点
     */
    public static loadByRoleLevel(level: number): void {
        /*if (level >= 10) {
            this.load(PackNameEnum.MovieClip, 2);
        }*/
    }

    /**
     * 加载资源包
     */
    public static addPackage(packageName: string) {
        if (!ResourceManager.packageLoaded[packageName]) {
            fairygui.UIPackage.addPackage(packageName);
            //注册保内自定义组件
            UIExtensionManager.register(packageName);
            ResourceManager.packageLoaded[packageName] = true;
            EventManager.dispatch(UIEventEnum.PackageLoaded, packageName);
        }
    }

    public static removePackage(packageName: string) {
        if (ResourceManager.packageLoaded[packageName]) {
            // fairygui.UIPackage.removePackage(packageName);
            delete ResourceManager.packageLoaded[packageName];
            delete ResourceManager.resLoaded[packageName];
        }
    }

    /**
     * 销毁资源包
     */
    public static destroyPackage(packageName: string): void {
        ResourceManager.removePackage(packageName);
        App.LoaderManager.destroyRes(packageName);
        let pkgResNum: number = UIManager.getPackNum(packageName);
        let resName: string;
        for (let i: number = 0; i < pkgResNum - 1; i++) {
            if (i == 0) {
                resName = `${packageName}_atlas0`;
            } else {
                resName = `${packageName}_atlas0_${i}`
            }
            App.LoaderManager.destroyRes(resName);
        }
    }

    /**
     * 所有依赖包都加载完成了才算已加载
     */
    public static isPackageLoaded(packageName: string): boolean {
        let dependences: Array<any> = ResourceManager.packageDependenceDict[packageName];
        if (dependences) {
            for (let name of dependences) {
                if (!ResourceManager.packageLoaded[name]) {
                    return false;
                }
            }
        }
        return ResourceManager.packageLoaded[packageName] == true;
    }

    public static isHasDependence(packageName: string): boolean {
        let dependences: Array<any> = ResourceManager.packageDependenceDict[packageName];
        return dependences != null && dependences.length > 0;
    }

    /**
     * packageName1是否依赖packageName2
     */
    public static isDependence(packageName1: string, packageName2: string): boolean {
        let dependences: Array<any> = ResourceManager.packageDependenceDict[packageName1];
        return dependences != null && dependences.indexOf(packageName2) != -1;
    }


    public static getDependences(packageName): Array<string> {
        return ResourceManager.packageDependenceDict[packageName];
    }

    /**
     * 根据资源项加载包
     */
    public static addPackageByResourceItems(resourceItems: Array<RES.ResourceItem>): void {
        let packageName: string;
        for (let resourceItem of resourceItems) {
            packageName = ResourceManager.getPackageNameByResource(resourceItem.name);
            ResourceManager.addPackage(packageName);
            ResourceManager.resLoaded[packageName] = true;
        }
    }

    /**
     * 加载资源
     * @param pkgResNum 资源包对应的资源个数，第一个为fui，后面为png
     * @param 加载完成回调
     */
    public static load(packageName: string, pkgResNum: number = -1, callBack: CallBack = null): void {
        let caller: any;
        let callFunc: any;
        let callParams: any[];
        if (callBack) {
            caller = callBack.caller;
            callFunc = callBack.fun;
            callParams = [callBack.param];
        }
        App.LoaderManager.getPackageByGroup(packageName, callFunc, caller, ELoaderPriority.UI_PACKAGE, callParams);
        /*return;

        if (callBack != null) {
            if (ResourceManager.callBackDict[packageName] == null) {
                ResourceManager.callBackDict[packageName] = [];
            }
            ResourceManager.callBackDict[packageName].push(callBack);
        }
        if (ResourceManager.resLoaded[packageName]) {
            ResourceManager.doCallBack(packageName);
            return;
        }
        if (pkgResNum == -1) {
            pkgResNum = UIManager.getPackNum(packageName);
        }
        let resources: Array<string> = ResourceManager.genResourcesInclueDependence(packageName, pkgResNum);
        if (resources.length > 0) {
            let packageNames: Array<string> = ResourceManager.parsePackagesFromResources(resources);

            let onComplete = function (): void {
                for (let packageName of packageNames) {
                    Log.trace(Log.CLEANUP, `加载资源包：${packageName}`);
                    ResourceManager.addPackage(packageName);
                    ResourceManager.resLoaded[packageName] = true;
                }
                ResourceManager.doCallBack(packageName);
            };
            ResourceManager.costDict[packageName] = Date.now();
            App.ResourceUtils.loadResource(resources, [], onComplete, null, this, packageName);
        } else {
            ResourceManager.doCallBack(packageName);
        }*/
    }

    /**
     * 执行回调
     */
    private static doCallBack(packageName: string): void {
        let callBacks: Array<CallBack> = ResourceManager.callBackDict[packageName];
        if (callBacks != null) {
            let cb: CallBack;
            while (callBacks.length > 0) {
                cb = callBacks.shift();
                cb.fun.call(cb.caller, cb.param);
            }
        }
    }

    public static checkAndLoad(packageName: string): void {
        if (!ResourceManager.isPackageLoaded(packageName)) {
            ResourceManager.load(packageName);
        }
    }

    /**
     * 获取资源，包含依赖包
     */
    public static genResourcesInclueDependence(packageName: string, resNum: number): Array<string> {
        let resources: Array<string> = [];
        let dependences: Array<any> = ResourceManager.packageDependenceDict[packageName];
        if (dependences != null) {
            for (let pkgName of dependences) {
                pkgName = name;
                if (!ResourceManager.isPackageLoaded(pkgName)) {//依赖包未加载完成，才加入
                    resources = resources.concat(ResourceManager.genResources(pkgName, UIManager.getPackNum(pkgName)));
                }
            }
        }
        let resKeys: Array<string> = ResourceManager.genResources(packageName, resNum);
        resources = resources.concat(resKeys);
        return resources;
    }

    /**
     * 获取资源，包含依赖包
     */
    public static genResourcesInclueDependence2(packageName: string, resNum: number): Array<PackageResVo> {
        let resources: Array<PackageResVo> = [];
        let dependences: Array<any> = ResourceManager.packageDependenceDict[packageName];
        if (dependences != null) {
            for (let dePkgName of dependences) {
                if (!ResourceManager.isPackageLoaded(dePkgName)) {//依赖包未加载完成，才加入
                    resources.push(ResourceManager.genResources2(dePkgName, UIManager.getPackNum(dePkgName)));
                }
            }
        }
        if (!ResourceManager.isPackageLoaded(packageName)) {//未加载完成，才加入
            resources.push(ResourceManager.genResources2(packageName, resNum));
        }
        return resources;
    }

    /**
     * 动态创建资源键
     */
    public static genResources(packageName: string, resNum: number): Array<string> {
        if (packageName == "Sound") {//音效特殊处理
            App.ResourceUtils.createResource("Sound", "bin", "resource/fui/module/Sound.bin");
            App.ResourceUtils.createResource("Sound_v6h90", "sound", "resource/fui/module/Sound_v6h90.mp3");
            return ["Sound", "Sound_v6h90"];
        }
        let resources: Array<string> = [];
        let basePath: string = "resource/fui/module"
        let resKey: string;
        let resName: string;
        let resPath: string;
        let restype: string;
        for (let i: number = 0; i < resNum; i++) {
            if (i == 0) {
                restype = "bin";
                resName = `${packageName}.bin`;
            } else {
                restype = "image";
                if (i == 1) {
                    resName = `${packageName}_atlas0.png`;
                } else {
                    resName = `${packageName}_atlas0_${i - 1}.png`;
                }
            }
            if (restype == "bin") {
                resKey = packageName;
            } else {
                resKey = resName.replace(".", "_").replace("_png", "");
            }
            resPath = `${basePath}/${resName}`;

            App.ResourceUtils.createResource(resKey, restype, resPath);
            resources.push(resKey);
        }
        return resources;
    }

    /**
     * 创建包资源
     */
    public static genResources2(packageName: string, resNum: number): PackageResVo {
        if (this.packageDict[packageName]) {
            return this.packageDict[packageName];
        }
        let vo: PackageResVo = new PackageResVo();
        vo.packageName = packageName;
        if (packageName == "Sound") {//音效特殊处理
            vo.addRes(App.ResourceUtils.createResource("Sound", "bin", URLManager.PACKAGE_PATH + "/Sound.bin"));
            vo.addRes(App.ResourceUtils.createResource("Sound_v6h90", RES.ResourceItem.TYPE_SOUND, URLManager.PACKAGE_PATH + "/Sound_v6h90.mp3"));
            this.packageDict[packageName] = vo;
            return vo;
        }
        let resKey: string;
        let resName: string;
        let resPath: string;
        let resType: string;
        for (let i: number = 0; i < resNum; i++) {
            if (i == 0) {
                resType = "bin";
                resName = `${packageName}.bin`;
                resKey = packageName;
            } else {
                resType = "image";
                if (i == 1) {
                    resName = `${packageName}_atlas0.png`;
                } else {
                    resName = `${packageName}_atlas0_${i - 1}.png`;
                }
                resKey = resName.replace(".", "_").replace("_png", "");
            }
            resPath = `${URLManager.PACKAGE_PATH}/${resName}`;
            vo.addRes(App.ResourceUtils.createResource(resKey, resType, resPath));
        }
        this.packageDict[packageName] = vo;
        return vo;
    }

    private static MAP_RES_NORMAL: any[] = [
        {
            name: "data.json",
            type: "json"
        }
        , {
            name: "mini.jpg",
            type: "image"
        }
    ];

    private static MAP_RES_SPECIAL: any[] = [
        {
            name: "data.json",
            type: "json"
        }
        , {
            name: "mini.jpg",
            type: "image"
        }
        , {
            name: "special.json",
            type: "json"
        }
    ];

    /**
     * 创建地图资源
     * //暂时没用，LoaderManager加载组那边没有提供progressEvent接口
     */
    public static genResourcesMap(mapId: number, hasSpecial: boolean): any[] {
        let mapResPath: string = ResourcePathUtils.getRPGGameMap() + mapId + "/" + mapId + "_";
        let mapResList: any[] = hasSpecial ? ResourceManager.MAP_RES_SPECIAL : ResourceManager.MAP_RES_NORMAL;
        let res: any;
        let resCfgs: any[] = [];
        for (let i: number = 0; i < mapResList.length; i++) {
            res = mapResList[i];
            resCfgs.push(App.ResourceUtils.createResource("map_" + mapId + "_" + res.name, res.type, mapResPath + res.name));
        }
        return resCfgs;
    }

    /**
     * 从资源组中解析出资源包名
     */
    public static parsePackagesFromResources(resources: Array<string>): Array<string> {
        let packageNames: Array<string> = [];
        if (resources != null) {
            let packageName: string;
            for (let resKey of resources) {
                packageName = ResourceManager.getPackageNameByResource(resKey);
                if (packageNames.indexOf(packageName) == -1) {
                    packageNames.push(packageName);
                }
            }
        }
        return packageNames;
    }

    /**
     * 从资源名称中获取包名
     */
    private static getPackageNameByResource(resource: string): string {
        return resource.split("_")[0];
    }
}