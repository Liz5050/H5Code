class ComposeCache implements ICache {
    private limitDatas: any;

    public constructor() {
    }

    public set limitGoods(value: any) {
        this.limitDatas = value;
    }

    /**
     * key为smeltPlanCode
     * @returns {any}
     */
    public get limitGoods(): any {
        if (this.limitDatas) {
            return this.limitDatas;
        }
        return {};
    }

    public clear(): void {

    }
}