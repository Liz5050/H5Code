class HeartMethodCache implements ICache {
    


    public getEquipCode(pos : number , role : number) : number {
        var cuData = CacheManager.cultivate.getCultivateInfoByRoleAndType(role, ECultivateType.ECultivateTypeHeartMethod);
        if(cuData) { 
             if(cuData.levelInfo[pos]) {
                 return cuData.levelInfo[pos];
             }
        }
        return 0;
    }

    public canOpenHeartMethod() : boolean {
        if(CacheManager.serverTime.serverOpenDay < 11) {
            return false;
        }
        return true;
    }


    public checkEquipCanUplvl(pos : number , role : number) : boolean {
        if(!this.canOpenHeartMethod()) {
            return false;
        }
        var itemcfg = ConfigManager.item.getByPk(this.getEquipCode(pos,role));
        var maxlvl = 5;
        if(itemcfg) {
            if(itemcfg.color == 2) {
                maxlvl = 3;
            }
            if(itemcfg.newItemLevel == maxlvl) {
                return false;
            }
        }
        if(itemcfg) {
            var list = CacheManager.pack.propCache.getMatEquipByPosAndColor(pos,itemcfg.color);
            return list.length > 0;
        }
        return false;
    }

    public checkEquipCanReplace( pos : number , role : number) : boolean {
        if(!this.canOpenHeartMethod()) {
            return false;
        }

        var itemcfg = ConfigManager.item.getByPk(this.getEquipCode(pos,role));
        var list = CacheManager.pack.propCache.getAllEquipBySmallPos(pos);
        if(!itemcfg) {
            if(list.length > 0) {
                return true;
            }
        }
        for(let i =0;i<list.length ; i++) {
            if(list[i].getItemInfo().code > itemcfg.code) {
                return true;
            }
        }
        return false;
    }
    
    public checkHeartMethodCanActive(pos : number ,role :number ) : boolean {
        if(!this.canOpenHeartMethod()) {
            return false;
        }
         var cuData = CacheManager.cultivate.getCultivateInfoByRoleAndType(role, ECultivateType.ECultivateTypeHeartMethod);
         if(cuData&&cuData != null) {
            if(cuData.extStr&&cuData.extStr!=null) {
                var darr = JSON.parse(cuData.extStr);   
                if(darr) {
                    if(darr[pos]||darr[pos] == 0) {
                        return  false;
                    }
                }
            }
         }
         var cfg = ConfigManager.cultivate.getMinCfg(ECultivateType.ECultivateTypeHeartMethod, pos);
         if(cfg) {
            let roleCareer: number = CacheManager.role.getRoleCareer();
            if(cfg.roleState <= CareerUtil.getRebirthTimes(roleCareer)) {
                return true;
            }
        }
        return false;
    }

    public checkHeartMethodCanUpdate(pos: number,role : number) : boolean {
        if(!this.canOpenHeartMethod()) {
            return false;
        }
        var cuData = CacheManager.cultivate.getCultivateInfoByRoleAndType(role, ECultivateType.ECultivateTypeHeartMethod);
        if(!cuData||cuData == null ){
            return false;
        }
        if(pos > 100) {
            if(!this.checkEquipFull(pos,role)) {
                return false;
            }
        } 
         if(cuData.extStr&&cuData.extStr!=null) {
            var darr = JSON.parse(cuData.extStr);   
            if(darr) {
                if(darr[pos]||darr[pos] == 0) {
                    var level = darr[pos];
                    if(level == ConfigManager.cultivate.getMaxLevel(ECultivateType.ECultivateTypeHeartMethod, pos)) {
                        return false;
                    }
                    var cfg = ConfigManager.cultivate.getCfgByLevelAndType(ECultivateType.ECultivateTypeHeartMethod, pos ,level );
                    var cfgnext = ConfigManager.cultivate.getCfgByLevelAndType(ECultivateType.ECultivateTypeHeartMethod, pos ,level + 1);
                    if(!cfgnext) {
                        return false;
                    }
                    var costcode = cfgnext.itemCode;
                    var costNum = cfgnext.itemNum;
                    let costitems:ItemData = CacheManager.pack.propCache.getItemByCode(costcode);
                    var itemNum = 0;
                    if(costitems){
                        itemNum = costitems.getItemAmount();
                    }
                    if(!costNum) {
                        costNum = 0;
                    }
                    return itemNum >= costNum;
                }
            }
         }
         return false;
    }

    //检查某个角色的某个心法有没有红点
    public checkHeartMethodPosTips(pos: number , role : number) : boolean {
        if(this.checkHeartMethodCanActive(pos,role)) {
            return true;
        }
        if(this.checkHeartMethodCanUpdate(pos,role)) {
            return true;
        }
        for(let i =1;i<=5;i++) {
            let id = (pos/100 - 1)*5 + i;
            if(this.checkEquipCanReplace(id,role)) {
                return true;
            }
            if(this.checkEquipCanUplvl(id,role)) {
                return true;
            }
        }
        if(this.checkHeartMethodCanDecompose(pos, role)) {
            return true;
        }
        return false;
    }

    public checkRoleTips(role : number) {
        for(let i=1;i<=4;i++) {
            if(this.checkHeartMethodPosTips(i*100,role)) {
                return true;
            }
        }
        return false;
    }

    public checkTabTips() {
        for(let i =0;i<3;i++) {
            if(this.checkRoleTips(i)) {
                return true;
            }
        }
        return false;
    }

    public clear(): void {

	}

     //检查某个角色的某个心法有没有红点
    public checkHeartMethodCanActiveOrActived(pos: number , role : number) : boolean {
        if(!this.canOpenHeartMethod()) {
            return false;
        }
        var cuData = CacheManager.cultivate.getCultivateInfoByRoleAndType(role, ECultivateType.ECultivateTypeHeartMethod);
         if(cuData&&cuData != null) {
            if(cuData.extStr&&cuData.extStr!=null) {
                var darr = JSON.parse(cuData.extStr);   
                if(darr) {
                    if(darr[pos]||darr[pos] == 0) {
                        return  true;
                    }
                }
            }
         }
         var cfg = ConfigManager.cultivate.getMinCfg(ECultivateType.ECultivateTypeHeartMethod, pos);
         if(cfg) {
            let roleCareer: number = CacheManager.role.getRoleCareer();
            if(cfg.roleState <= CareerUtil.getRebirthTimes(roleCareer)) {
                return true;
            }
        }
        return false;
    }

    //检查是否满配
    public checkEquipFull(pos: number , role : number) : boolean {
        for(let i=1 ; i<=5 ; i++) {
            let id = (pos/100 - 1)* 5 + i;
            if(this.getEquipCode(id,role) == 0) {
                return false;
            }
        }
        return true;
    }

    public getTheLeastEmptyIndex(pos: number , role : number) : number {
        for(let i=1 ; i<=5 ; i++) {
            let id = (pos/100 - 1)* 5 + i;
            if(this.getEquipCode(id,role) == 0) {
                return id;
            }
        }
        return 0;
    }

    public checkHeartMethodCanDecompose(pos : number, role : number) : boolean{
        if(!this.canOpenHeartMethod()) {
            return false;
        }
        if(!this.isActived(pos, role)) {
            return false;
        }
        if(this.checkAllOnePosHasTip(pos)) {
            return false;
        }
        for(let i =1;i<=5;i++) {
            let id = (pos/100 - 1)*5 + i;
            let list = CacheManager.pack.propCache.getAllEquipBySmallPos(id);
            if(list.length > 0) {
                return true;
            }
        }

        return false;
    }

    public isActived(pos : number , role : number ) : boolean {
        let cuData = CacheManager.cultivate.getCultivateInfoByRoleAndType(role, ECultivateType.ECultivateTypeHeartMethod);
        if(cuData) {
            if(cuData.extStr&&cuData.extStr!=null) {
                let darr = JSON.parse(cuData.extStr);   
                if(darr) {
                    if(darr[pos]||darr[pos] == 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public checkAllOnePosHasTip(pos : number) {
        for(let i = 0 ; i < 3 ; i++) {
            for(let j =1;j<=5;j++) {
                let id = (pos/100 - 1)*5 + j;
                if(this.checkEquipCanReplace(id, i)) {
                    return true;
                }
                if(this.checkEquipCanUplvl(id, i)) {
                    return true;
                }
            }
        }
        return false;
    }





}