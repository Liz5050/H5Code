/**
 * 法器升级
 * 
 */
class MagicWeaponStrengthenCache implements ICache {
    public shapeInfo : any;
    public cfg : any;
    public nextCfg : any;
    public isMax :boolean;

    public constructor() {
        this.isMax = false;
	}


    public clear(): void {

	}

    public setShapeInfo(data : any) : void {
        this.shapeInfo = data;
        this.getCfgByLevel();
        EventManager.dispatch(LocalEventEnum. MagicShapeDataUpdate);
    }

    public getCfgByLevel() : void {
        this.cfg = ConfigManager.mgShape.getByShapeAndLevel(EShape.EShapeSpirit , this.shapeInfo.level_I);
        this.nextCfg = ConfigManager.mgShape.getByShapeAndLevel(EShape.EShapeSpirit , this.shapeInfo.level_I + 1);
        if(this.nextCfg) {
            this.isMax = false;
        }
        else{
            this.isMax = true;
        }
    }

    public get level(): number {
		if (this.shapeInfo) {
			return this.shapeInfo.level_I;
		}
		return -1;
	}

    public checkItemUseEnough() : boolean {
        if(this.isMax) {
            return  false;
        }
        if(!this.cfg) {
            return false;
        }
        let itemcode = this.cfg.useItemCode;
        
        let itemnum = this.cfg.useItemNum;
        if(!itemnum) {
            itemnum = 0;
            return true;
        }
        let costitems:ItemData = CacheManager.pack.propCache.getItemByCode(itemcode );

        if(costitems){
            return costitems.getItemAmount() >= itemnum;
        }
        else{
            return false;
        }
    }

    public checkTips(): boolean{
        return this.checkItemUseEnough() || CacheManager.magicWeaponChange.checkTips();
	}




}