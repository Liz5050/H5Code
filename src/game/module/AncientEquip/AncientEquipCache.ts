/**
 * 模块数据缓存
 * @author zhh
 * @time 2018-08-24 11:31:46
 */
class AncientEquipCache implements ICache
{   
    private _posItems:any[];
    private _dressEquipsType:number[];
    public constructor(){        
        this._dressEquipsType = [EEquip.EEquipWeapon, EEquip.EEquipWristlet, 
			EEquip.EEquipShoulder, EEquip.EEquipHelmet, EEquip.EEquipGloves, 
			EEquip.EEquipClothes, EEquip.EEquipBelt, EEquip.EEquipShoes];
        

    }

    /**传世装备是否红点 */
    public checkTips():boolean{
        return false;
        let flag:boolean = false;
        if(!ConfigManager.mgOpen.isOpenedByKey(ModuleEnum[ModuleEnum.AncientEquip],false)){
            return flag; 
        }
        let roles:any[] = CacheManager.role.roles;
        for(let i:number = 0;i<roles.length;i++){
            let role:any = roles[i];
            let idx:number = role.index_I!=null?role.index_I:i;
            if(this.checkRoleTips(idx)){
                flag = true;
                break;
            }
        }
        return flag;
    }
    
    /**某个角色是否有红点 */
    public checkRoleTips(roleIndex:number):boolean{
        let flag:boolean = false;
        for(let pos of this.dressEquipsType){
            if(this.isPosCanUp(roleIndex,pos)){ //是否可激活/升级
                return true;
            }
            if(this.isPosCanTransfer(roleIndex,pos)){ //判断是否有可合成
                return true;
            }
            if(this.isPosCanTransfer(roleIndex,pos,true)){ //判断是否有可分解
                return true;
            }
        }
        return flag;
    }

    /**
     * 某个部位是否可升级
     */
    public isPosCanUp(roleIndex:number,pos:number):boolean{        
        if(this.isPosMax(roleIndex,pos)){
            return false;
        }

        let flag:boolean = false;
        let posLv:number = this.getPosLevel(roleIndex,pos);
        let cfg:any = ConfigManager.cultivate.getByPk(`${ECultivateType.ECultivateTypeForeverEquip},${pos},${posLv+1}`);
        if(cfg){
            let hasNum:number = CacheManager.pack.propCache.getItemCountByCode2(cfg.itemCode);
            flag = hasNum>=cfg.itemNum;
        }
        return flag;
    }

    public isPosMax(roleIndex:number,pos:number):boolean{
        let lv:number = this.getPosLevel(roleIndex,pos);
        let culCfg:any = ConfigManager.cultivate.getByPk(`${ECultivateType.ECultivateTypeForeverEquip},${pos},${lv+1}`);
        return culCfg==null;
    }
    /**
     * 判断某个角色是有可合成或者分解
     * @param roleIndex
     * @param checkType  判断类型;0合成和分解都判断;1只判断合成,2只判断分解
     *  */
    public isRoleCanTransfer(roleIndex:number,checkType:number = 0):boolean{
        let flag:boolean = false;
        for(let pos of this.dressEquipsType){     
            if(checkType==0){
                if(this.isPosCanTransfer(roleIndex,pos)){ //判断是否有可合成
                    return true;
                }
                if(this.isPosCanTransfer(roleIndex,pos,true)){ //判断是否有可分解
                    return true;
                }
            }else if(checkType==1 && this.isPosCanTransfer(roleIndex,pos)){
                return true;
            }else if(checkType==2 && this.isPosCanTransfer(roleIndex,pos,true)){
                return true;
            }
            
        }
        return flag;
    }

    /**
     * 判断某个角色是否可合成或分解
     * @param
     * @param
     * @param isSmelt 是否分解
     */
    public isPosCanTransfer(roleIndex:number,pos:number,isSmelt:boolean=false):boolean{
        let flag:boolean = false;
        let posItemDatas:any[] = this.getPosItemInfo();
        let isAct:boolean = this.isPosAct(roleIndex,pos);

        if(isSmelt){
            if(!isAct){
                return false;//未激活的 肯定不能分解
            }
        }else{
            if(isAct){
                return false; //已激活的不判断合成红点
            }
            if(this.isPosMax(roleIndex,pos)){ //满级也不判断合成红点
                return false;
            }
        }       
        for(let info of posItemDatas){
            if(info.type==pos){                
                let item:ItemData = info.item;
                let code:number = item.getCode();
                let transCfg:any = ConfigManager.itemTransfer.getByPk(code);
                let hasNum:number = 0;
                let needNum:number = 0;
                if(!isSmelt){  //合成
                    if(transCfg && !ConfigManager.itemTransfer.isOnlySmelt(transCfg) ){
                        hasNum =  CacheManager.pack.propCache.getItemCountByCode2(transCfg.materialItemCode); 
                        needNum = transCfg.amount;
                        flag = hasNum>=needNum; 
                    }
                }else{
                    hasNum = CacheManager.pack.propCache.getItemCountByCode2(code);
                    flag = hasNum>0; 
                }                
                break;
            }
            
        }
        return flag;    
    }

    /**
     * 获取某个部位增加对应装备的属性 [1,20]
     * 
     *  */
    public getPosAddEquipAttr(roleIndex:number,pos:number,isReal:boolean):number[]{
        let attrs:number[] = [];
        let posLv:number = this.getPosLevel(roleIndex,pos);
        if(!isReal){
            posLv = Math.max(posLv,1);
        }
        if(posLv>0){
            let cfg:any = ConfigManager.cultivate.getByPk(`${ECultivateType.ECultivateTypeForeverEquip},${pos},${posLv}`);
            let attrExs:any[] = WeaponUtil.getAttrArray(cfg.attrEx);
            for(let i:number=0;i<attrExs.length;i++){
                if(WeaponUtil.isAddPosBaseAttr(attrExs[i][0])){
                    attrs = attrExs[i];
                    break;
                }
            }
        }
        return attrs;
    }
    /**
     * 获取增加人物武器对应部位的基础属性百分比
     */
    public getPosAddEquipAttrRate(roleIndex:number,pos:number):number{
        let rate:number = 0;
        let attrs:number[] = this.getPosAddEquipAttr(roleIndex,pos,true);
        if(attrs.length>0){
            if(WeaponUtil.isPercentageAttr(attrs[0])){
                rate = WeaponUtil.getAttrPercentVal(attrs[1]);//配置的实际是万分比 
            }
        }
        return rate;
    }

    /**获取某个角色身上传世装备的战力 */
    public getRoleFight(roleIndex:number):number{
        let totalAttr:any = this.getRoleTotalAttr(roleIndex);
        let fight:number = WeaponUtil.getCombat(totalAttr,roleIndex);        
        return fight;
    }
    /**获取身上传世装备的总属性 */
    public getRoleTotalAttr(roleIndex:number):any{
        let totalAttr:any = {};
        for(let type of this.dressEquipsType){
            let posLv:number = this.getPosLevel(roleIndex,type);
            if(posLv){
                //"cultivateType,position,level"
                let info:any = ConfigManager.cultivate.getByPk(`${ECultivateType.ECultivateTypeForeverEquip},${type},${posLv}`);
                if(info){
                    let attr:any = WeaponUtil.getAttrDict(info.attr);
                    let attrEx:any = WeaponUtil.getAttrDict(info.attrEx);
                    ObjectUtil.mergeObj(totalAttr,attr);
                    ObjectUtil.mergeObj(totalAttr,attrEx);
                }
            }
        }
        return totalAttr;
    }

    /**是否可合成的部位 */
    public isCanComposePos(pos:number):boolean{
        return pos!=EEquip.EEquipWeapon && pos!=EEquip.EEquipClothes;
    }

    /**
     * 获取套装等级
     * @param isReal 是否真实等级
     *  */
    public getSuitLv(roleIndex:number,isReal:boolean):number{
        let lv:number = Number.MAX_VALUE;
        for(let pos of this._dressEquipsType){
            let posLv:number = this.getPosLevel(roleIndex,pos);
            if(posLv<lv){
                lv = posLv; 
            }
            if(lv==0){ //有0级 肯定就是0级 
                break;
            }
        }
        if(!isReal){
            lv = Math.max(lv,1);
        }
        return lv; 
    }

    //从低到高依次为星、月、曜、圣。
    /**获取某个部位的等级 */
    public getPosLevel(roleIndex:number,pos:number):number{
        let lv:number =  CacheManager.cultivate.getCultivateLevel(roleIndex,ECultivateType.ECultivateTypeForeverEquip,pos);
        lv = Math.max(lv,0);
        return lv;
    }

    /**判断某个部位是否激活 */
    public isPosAct(roleIndex:number,pos:number):boolean{
        let lv:number = this.getPosLevel(roleIndex,pos);
        return lv>0;
    }

    public getPosItemInfo():any[]{
        if(!this._posItems){
            this._posItems = [];            
            let itemCfgs:any[] = ConfigManager.item.select({category:ECategory.ECategoryProp,type:EProp.EPropForeverEquipProp});
            //"cultivateType,position,level"
            for(let i:number = 0;i<this._dressEquipsType.length;i++){
                //let culCfg:any = ConfigManager.cultivate.getByPk(`${ECultivateType.ECultivateTypeForeverEquip},${this._dressEquipsType[i]},${1}`);
                //this._posItems.push(new ItemData(culCfg.itemCode));
                let type:number = this._dressEquipsType[i];
                for(let j:number = 0;j<itemCfgs.length;j++){
                    let itemCfg:any = itemCfgs[j];
                    if(itemCfg.effect==type){
                        this._posItems.push({type:type,item:new ItemData(itemCfg.code)});
                    }                    
                }
            }            

        }
        return this._posItems;
    }

    public getNameFix(level:number,isFace:boolean=true):string{
        let idx:number = Math.max(level-1,0);
        idx = Math.min(idx,LangAncientEquip.L9.length-1);
        let face:string = isFace?LangAncientEquip.L10[idx]:""; 
        return LangAncientEquip.L9[idx]+face;
    }

    /**是否是有技能的装备 */
    public isSkillEquip(type:number):boolean{
        return type==EEquip.EEquipWeapon || type==EEquip.EEquipClothes;
    }

    public get dressEquipsType():number[]{
        return this._dressEquipsType;
    }

    public clear(): void{    
        
    }
}