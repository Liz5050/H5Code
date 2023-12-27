class CopyLegendConfig extends BaseConfig {
    private bossList:{[copyCode:number]:any[]} = {};
    public constructor() {
        super("t_copy_strategy",'copyCode,bossCode');
    }

    public getListByCode(code:number):any[] {
        let dict:any = this.getDict();
        let infs:any[] = [];
        for (let key in dict) {
            if(dict[key].copyCode == code) {
                infs.push(dict[key]);
            }
        }
        if (infs && infs.length) {
            for (let i = infs.length - 1; i >= 0; i--)
                if (!infs[i].showInCopy) infs.splice(i, 1);
        }

        let finals:any = [];
        for(let i = 0; i < infs.length ; i++) {
            if(infs[i].danger == "BOSS") {
                finals.push(infs[i]);
            }
        }
        for(let i = 0; i < infs.length ; i++) {
            if(infs[i].danger != "BOSS") {
                finals.push(infs[i]);
            }
        }

        return finals;
    }

    /**
     * 获取副本中所有boss
     */
    public getCopyBossList(copyCode:number):any[] {
        if(!this.bossList[copyCode]) {
            this.bossList[copyCode] = [];
            let dict:any = this.getDict();
            for(let key in dict) {
                if(dict[key].copyCode == copyCode) {
                    this.bossList[copyCode].push(dict[key]);
                }
            }
        }
        return this.bossList[copyCode];
    }
}