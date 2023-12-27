/**
 * url路径管理器
 * @author Chris
 */
class URLManager {
    public static ROOT_PATH: string = "resource/assets";
    public static PACKAGE_PATH: string = "resource/fui/module";

    /**图标类型 */
    public static SKIL_ICON: string = "skill";
    public static BUFF_ICON: string = "buff";
    public static ITEM_ICON: string = "item";
    public static AVATAR_ICON: string = "avatar";
    public static GUILD_VEIN_ICON: string = "guildVein";
    public static COPY_BLOOD_ICON: string = "copy/bloodMatrix";
    public static REALM_ICON: string = "realm";
    public static GODWP_PIECE: string = "godWeaponPiece";
    public static GOD_WEAPON: string = "godWeapon";
    public static Shape_Change_Icon: string = "shapeChange";

    public static getCommonIcon(name: string): string {
        return "ui://Common/" + name;
    }

    public static getSceneIcon(name: string): string {
        return "ui://Scene/" + name;
    }

    /**获取某个包中的导出资源 */
    public static getPackResUrl(packName: string, urlName: string): string {
        return "ui://" + packName + "/" + urlName;
    }
    
    /**获取公共资源 */
    public static getComonRes(resName:string):string{
        return URLManager.getPackResUrl(PackNameEnum.Common,resName);
    }

    /**
     * 获取数字字体
     */
    public static getNumFont(fontName:string,pkgName:string=null):string{
        if(!pkgName){
            pkgName = PackNameEnum.Num;
        }
        return `ui://${pkgName}/${fontName}`;
    }
    
    /**获取图标url */
    public static getIconUrl(id: any, type: string): string {
        return `${URLManager.ROOT_PATH}/icon/${type}/${id}.png`
    }

    public static getBossHeadIcon(bossCode:number):string{
        let bossConfig:any = ConfigManager.boss.getByPk(bossCode);
		let url:string = URLManager.getIconUrl(bossConfig.avatarId + "",URLManager.AVATAR_ICON);
        return url;
    }

    // /**获取模块外部资源 */
    // public static getModuleAssetUrl(moduleId:ModuleEnum,namePath:string):string {
    //     return URLManager.ROOT_PATH + "/module/" + ModuleEnum[moduleId] + "/" + namePath;
    // }

    /**根据职业获取玩家头像 */
    public static getPlayerHead(career: number): string {
        return URLManager.ROOT_PATH + "/avatar/" + CareerUtil.getBaseCareer(career).toString() + ".png"
    }

    /**根据职业获取玩家职业名称 */
    public static getPlayerHeadName(career: number): string {
        return URLManager.ROOT_PATH + "/avatar/name" + career.toString() + ".png"
    }

    /**
     * 获取模块动态加载的图片
     */
    public static getModuleImgUrl(imgName: string, packName: string): string {
        return URLManager.ROOT_PATH + "/module/" + packName + "/" + imgName;
    }
    
    /**
     * 获取标题
     */
    public static getTitleUrl(imgName:string,fix:string=".png"):string{
        let url:string = URLManager.getModuleImgUrl(`title/${imgName}${fix}`,PackNameEnum.Common);
        return url;
    }

    /**获取物品颜色框 */
    public static getItemColorUrl(imgName:string,fix:string=".png"):string{
        let url:string = URLManager.getModuleImgUrl(`itemColor/${imgName}${fix}`,PackNameEnum.Common);
        return url;
    } 

    /**
     * 获取任务半身像
     */
    public static getTaskHead(name: string): string {
        return URLManager.ROOT_PATH + "/avatar/task/" + name + ".png"
    }

    public static getNobilityIco(stage:number):string{
        let url:string = URLManager.getModuleImgUrl(`nobility/stageIco/stage_${stage}.png`,PackNameEnum.Train);
        return url;
    }
    public static getNobilityName(stage:number,isFix:boolean):string{
        let url:string = "";
        if(!isFix){
            url = URLManager.getModuleImgUrl(`nobility/stageName/stage_name_${stage}.png`,PackNameEnum.Train)
        }else{
            url = URLManager.getModuleImgUrl(`nobility/stageName/stage_name_fix_${stage}.png`,PackNameEnum.Train)
        }
        return url;
    }
    
    public static getRechargeFirstBg():string{
        return URLManager.getModuleImgUrl("bg.png",PackNameEnum.RechargeFirst);
    }


}