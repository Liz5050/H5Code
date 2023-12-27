class EncounterCache implements ICache {
    static FULL_PK_SCORE: number = 100;

    public info: any = {
        // killScore:111,
        // pkScore:222,
        // pkScoreDt:11111111,
        // winCount:333,
        // myRank:123,
        // targets:[
        //     {entityId:{},
        //     name:"李英俊",
        //     level:123,
        //     roleState:3,
        //     career:1},
        //     {entityId:{},
        //     name:"李英俊",
        //     level:123,
        //     roleState:3,
        //     career:1},
        //     {entityId:{},
        //     name:"李英俊",
        //     level:123,
        //     roleState:3,
        //     career:1},
        //     {entityId:{},
        //     name:"李英俊",
        //     level:123,
        //     roleState:3,
        //     career:1}
        // ]
        targets:{data:[]}
    };
    private _tipFlag: boolean;

    public constructor() {
        
    }

    public updateInfo(value:any) :void {
        this.info = value;
        this.tipFlag = this.checkTips();
    }

    public checkTips():boolean {
        if(!ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.Encounter],false)) return false;
        if(this.info.pkScore_I >= EncounterCache.FULL_PK_SCORE || this.info.targets.data.length <= 0) return false;
        return true;
    }

    public getTarget(index: number):any {
        return this.info ? this.info.targets.data[index] : null;
    }

    get tipFlag(): boolean {
        return this._tipFlag;
    }

    set tipFlag(value: boolean) {
        if (this._tipFlag != value) {
            this._tipFlag = value;
            EventManager.dispatch(LocalEventEnum.EncounterTipChange);
        }
    }

    public clear() {
    }

}