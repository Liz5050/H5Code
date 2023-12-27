class CheckPointConfig extends BaseConfig {
    private _minXWCheckPoint:number = 0;
    public constructor() {
        super("t_checkpoint_config", "id");
        //levelExp
    }

    public parseByPk(sourceData: any, pk: string): any {
		let data = {};
		if (sourceData) {
			let key: string = "";
			let pks: Array<string> = pk.split(",");
            let min:number = Number.MAX_VALUE;
			for (let d of sourceData) {
				key = "";
				if (pks.length > 1) {//组合主键
					for (let k of pks) {
						if (d[k]) {
							key += d[k] + this.sep;
						} else {
							key += 0 + this.sep;
						}
					}
				} else {
					key = d[pk] ? d[pk] : 0;
				}
				data[key] = this.transform(d, data);
                if(data[key].levelExp){
                    min = Math.min(data[key].id,min);
                }

			}
            this._minXWCheckPoint = min;
		}
		return data;
	}

    public getCheckPoint(id:number): any {
        return this.getByPk(id);
    }

    public isCheckPointMap(id:number, mapId:number): boolean {
        let cp:any = this.getByPk(id);
        return cp && cp.mapId == mapId;
    }

    public getMaxCheckPointNum():number {
        return this.configLength;
    }

    /**获取可兑换修为的关卡信息 */
    public getLevelExp(cp:number=-1):any{
        if(cp==-1){
            cp = CacheManager.copy.getCopyProcess(CopyEnum.CopyCheckPoint);
        }
        let info:any = this.getByPk(cp);
		while(info && !info.levelExp){
			cp++;
			info = this.getByPk(cp);
		}
		return info;
    }

    public getMinXWCheckPoint():number{
        if(this._minXWCheckPoint==0){
            this.getDict();
        }        
        return this._minXWCheckPoint;
    }

    /**
     * 获取当前关卡属于当前地图的第几关
     * @param id 关卡id
     * @returns {number}
     */
    public getIdxInMap(id:number):number {
        let idx:number = 1;
        let dataDic:any = this.getDict();
        let curMapId:number = dataDic[id].mapId;
        let pre:any = dataDic[--id];
        while (pre && pre.mapId == curMapId) {
            idx++;
            pre = dataDic[--id];
        }
        return idx;
    }

}