/**
 * 模块数据缓存
 * @author zhh
 * @time 2018-08-08 17:33:32
 */
class GodWingCache implements ICache
{   
    private static MAX_LEVEL:number = 5;

    private _godWingTypeOrder:number[];
    
    public constructor(){
        this._godWingTypeOrder = [
            EWingAccessoryType.EWingAccessoryTypeOne,
        EWingAccessoryType.EWingAccessoryTypeTow,
        EWingAccessoryType.EWingAccessoryTypeThree,
        EWingAccessoryType.EWingAccessoryTypeFour
        ];
    }
    
    /**是否红点 */
    public checkTip():boolean{
        let flag:boolean = this.isCanEquip() || this.isCanQickSmelt();
        return flag;
    }
    /**判断某个角色是否有红点 */
    public checkRoleTip(roleIndex:number):boolean{
        return this.isRoleHasEquipGodWing(roleIndex) || this.isRoleHasSmelt(roleIndex);
    }

    /**是否有可装备的神羽 */
    public isCanEquip():boolean{
        let flag:boolean = false;
        for(let i:number=0;i<this._godWingTypeOrder.length;i++){
            let type:number = this._godWingTypeOrder[i];
            let isHas:boolean = false;
            for(let j:number=0;j<CacheManager.role.roles.length;j++){
                let role:any = CacheManager.role.roles[j];
                let roleIndex:number = role.index_I?role.index_I:j;
                let item:ItemData = this.getPackEquipGodWing(roleIndex,type);  
                if(item){
                    isHas = true;
                    break;
                }   
            }
            if(isHas){
                flag = true;
                break;
            }
        }

        return flag;
    }
   
    /**
     * 是否有可快速合成的 
     * @param roleIndex -1表示只要找到就返回true，否则返回特定角色是否可以快速合成
     */
    private isCanQickSmelt():boolean{
        let flag:boolean = false;
        let roles:any[] = CacheManager.role.roles;        
        for(let j:number =0;j<roles.length;j++){
            let role:any = roles[j];
            let roleIdx:number = role.index_I?role.index_I:j;
            flag = this.isRoleHasSmelt(roleIdx);           
            if(flag){                
                break;
            }
            
        }
        return flag;
    }
    /**判断某个角色是否有可快速合成的神羽 */
    private isRoleHasSmelt(roleIndex:number):boolean{
        let flag:boolean = false;
        for(let i:number=0;i<this._godWingTypeOrder.length;i++){
            let type:number = this._godWingTypeOrder[i];
            flag = this.isTypeCanSmelt(roleIndex,type);
            if(flag){
                break;
            }

        }
        return flag;
    }

    /**判断某个角色某个神羽类型是否可以合成 */
    public isTypeCanSmelt(roleIndex,type):boolean{
        let flag:boolean = false;
        let lv:number = this.getRoleGodWingLevel(roleIndex,type);
        let isEquiped: boolean = lv > 0; //当前已经装备了神羽
        if(this.isMax(lv)){ //身上的已满阶
            return false;
        }
        
        lv++; //快速合成是相对身上的下一阶
        lv = Math.min(lv,GodWingCache.MAX_LEVEL); //最高阶        
        let cfg:any = ConfigManager.mgStrengthenExAccessory.getInfoBy(EStrengthenExType.EStrengthenExTypeWing,type,lv);
        if(!this.isSmeltMaterialOk(cfg, isEquiped)){ //材料不足
            return false;
        }
        if(this.isGodWingCanEquip(cfg,roleIndex)){ //判断特定角色 是否可装备(翅膀等级不足)
            flag = true;            
        }
        return flag;
    }

    /**获取背包中所有的神羽 */
    public getPackGodWings():ItemData[]{
        let godWingItems:ItemData[] = CacheManager.pack.propCache.getByCT(ECategory.ECategoryProp,EProp.EPropStrengthenExAccessory);
        return godWingItems;
    }
  
    /**获取某个角色身上的神羽 */
    public getRoleGodWing(roleIndex:number):any[]{
        let items:any[] = [];        
        for (let i = 0; i < this._godWingTypeOrder.length; i++) {
            let type:number = this._godWingTypeOrder[i];
            let code:number = this.getRoleGodWingCode(roleIndex,type); //得到的是物品code
            let info:any = {type:type,roleIndex:roleIndex};
            if(code){
                info.item = new ItemData(code);
            }
            items.push(info);
            
        }
        return items;
    }
    /**获取角色某个类型的神羽code */
    public getRoleGodWingCode(roleIndex:number,type:number):number{
        let code:number = 0;
        let strengthenInfo:any = CacheManager.role.getPlayerStrengthenExtInfo(EStrengthenExType.EStrengthenExTypeWing,roleIndex);
        if(strengthenInfo && strengthenInfo.accessoryDict){
            let accessoryDict:any  = ObjectUtil.dictToJsObj(strengthenInfo.accessoryDict)
            code = accessoryDict[type]?accessoryDict[type]:0;
        }
        return code;
    }
    /**获取角色身上某个神羽的等级 */
    public getRoleGodWingLevel(roleIndex:number,type:number):number{
        let level:number = 0;
        let code:number = this.getRoleGodWingCode(roleIndex,type);
        if(code){
            let cfg:any =ConfigManager.mgStrengthenExAccessory.getByPk(code);
            level = cfg.level; 
        }
        return level;
    }

    /**判断某个角色是否有可穿戴的神羽 */
    public isRoleHasEquipGodWing(roleIndex:number):boolean{
        let flag:boolean = false;
        for (let i = 0; i < this._godWingTypeOrder.length; i++) {
            let type:number = this._godWingTypeOrder[i];
            let item:ItemData = this.getPackEquipGodWing(roleIndex,type);
            if(item){
                flag = true;
                break;
            }
        }
        return flag;
    }

    /**根据类型获取背包中可穿戴的神羽 */
    public getPackEquipGodWing(roleIndex:number,type:number):ItemData{
        let retItem:ItemData;
        let godWings:ItemData[] = CacheManager.pack.propCache.getGodWingItems(type);
        let curLv:number = 0; //当前筛选的最高等级
        for(let i:number = 0;i<godWings.length;i++){
            let item:ItemData = godWings[i];
            let cfg:any = ConfigManager.mgStrengthenExAccessory.getByPk(item.getCode());
            if(cfg.type==type){
                let code:number = this.getRoleGodWingCode(roleIndex,type); //身上的神羽         
                let equipLv:number = 0;       
                if(code){
                    let info:any = ConfigManager.mgStrengthenExAccessory.getByPk(code);
                    equipLv = info.level; 
                }
                if(cfg.level>equipLv && cfg.level>curLv && this.isGodWingCanEquip(cfg,roleIndex)){ //等级大于身上穿戴的并且大于当前筛选的
                    retItem = item;
                }
            }
            
        }
        return retItem;
    }
    /**判断某个神羽的翅膀条件是否可穿戴 */
    public isGodWingCanEquip(godWingInfo:any,roleIndex:number):boolean{
        let flag:boolean = true;
        if(typeof(godWingInfo)=="number"){
            godWingInfo = ConfigManager.mgStrengthenExAccessory.getByPk(godWingInfo);
        }

        let limits:string[] = godWingInfo.limits.split("#");
        let wingInfo:any = CacheManager.role.getPlayerStrengthenExtInfo(EStrengthenExType.EStrengthenExTypeWing,roleIndex);
        let wingLv:number = wingInfo?wingInfo.level:0;
        let wingCfg:any = ConfigManager.mgStrengthenEx.getByPk(`${EStrengthenExType.EStrengthenExTypeWing},${wingLv}`);
        let wingStage:number = wingCfg && wingCfg.stage?wingCfg.stage:0;
        let wingStar:number = wingCfg && wingCfg.star?wingCfg.star:0;
        for(let i:number=0;i<limits.length;i++){            
            if(limits[i]){
                let b:boolean = false;
                let arr:string[] = limits[i].split(",");
                let value:number = Number(arr[1]);
                switch(Number(arr[0])){ //限制类型 1 等级，2阶级3星级
                    case 1:
                        b = wingLv>=value;
                        break;
                    case 2:
                        b = wingStage>=value;
                        break;
                    case 3:
                        b = wingStar>=value;
                        break;
                }
                if(!b){
                    flag = b; //条件不满足
                    break;
                }
            }
            
        }
        return flag;
    }

    /**判断某个神羽合成材料是否足够
     * @param godWingCfgInfo  物品code 或者mgStrengthenExAccessory配置
     * @param isEquiped  是否已装备
     */
    public isSmeltMaterialOk(godWingCfgInfo:any, isEquiped: boolean):boolean{
        let flag:boolean = false;
        if(typeof(godWingCfgInfo)=="number"){
            godWingCfgInfo = ConfigManager.mgStrengthenExAccessory.getByPk(godWingCfgInfo);
        }
        let smeltPlanInfo:any = ConfigManager.smeltPlan.getByPk(godWingCfgInfo.smeltPlanCode);
        let item:ItemData = CommonUtils.configStrToArr(smeltPlanInfo.smeltMaterialList)[0];
        let needNum:number = item.getItemAmount();
        let count:number = CacheManager.pack.propCache.getItemCountByCode2(item.getCode());
        if (isEquiped) { //已装备的 数量+1 因为身上的可以用于合成消耗
            count += 1;
        }
        flag = count>=needNum;
        return flag;
    }

    /**
     * 判断是否满阶
     */
    public isMax(level:number):boolean{
        return level>=GodWingCache.MAX_LEVEL;
    }
    /**获取类型 */
    public getTypeByIdx(idx:number):number{
        return this._godWingTypeOrder[idx];
    }
    /**获取套装等级 */
    public getSuitLevel(roleIndex:number):number{
        let levels:number[] = [];
        for(let i:number=0;i<this._godWingTypeOrder.length;i++){
            let type:number = this._godWingTypeOrder[i];
            let level:number = this.getRoleGodWingLevel(roleIndex,type);
            if(level){
                levels.push(level);
            }else{
                levels.push(0);
                break;
            }            
        }
        levels.sort();
        return levels[0]; //以最小的 为激活的 0级表示还没激活任何套装
    }
    /**获取已经装备的某类型神羽的件数 */
    public getSuitLevelNum(roleIndex:number,level:number):number{
        let n:number = 0;
        let levels:number[] = [];
        for(let i:number=0;i<this._godWingTypeOrder.length;i++){
            let type:number = this._godWingTypeOrder[i];
            let code:number = this.getRoleGodWingCode(roleIndex,type);
            if(code){
                let cfg:any =ConfigManager.mgStrengthenExAccessory.getByPk(code);
                if(cfg.level>=level){
                    n++;
                }
            }       
        }
        return n;
    }
    /**获取某个角色的神羽战力 */
    public getRoleFight(roleIndex:number):number{
        let fight:number = 0;
        let totalAttr:any = {};
        for(let i:number=0;i<this._godWingTypeOrder.length;i++){
            let type:number = this._godWingTypeOrder[i];
            let code:number = this.getRoleGodWingCode(roleIndex,type);
            if(code){
                let cfg:any =ConfigManager.mgStrengthenExAccessory.getByPk(code);
                ObjectUtil.mergeObj(totalAttr,WeaponUtil.getAttrDict(cfg.attrList),true);
            }       
        }
        fight = WeaponUtil.getCombat(totalAttr);
        return fight;
    }

    public get godWingTypeOrder():number[]{
        return this._godWingTypeOrder;
    }

    public clear(): void{    

    }
}