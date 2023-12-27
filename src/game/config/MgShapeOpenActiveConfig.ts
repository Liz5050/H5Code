class MgShapeOpenActiveConfig extends BaseConfig {

    public constructor() {
        super("t_mg_shape_open", "shape");
    }

    public getOpenLevel(activeNum: number, shape: EShape): number {
        var cfg = this.getByPk(shape);
        if (cfg) {
            if (activeNum == 1) {
                return cfg.open1;
            }
            if (activeNum == 2) {
                return cfg.open2;
            }
            // if(activeNum == 0) {
            //     return 0;
            // }
        }
        return -1;
    }

    public getOpenCondDesc(activeNum: number, shape: EShape): string {
        let cfg: any = this.getByPk(shape);
        let condArr: Array<string> = [];
        if (cfg && activeNum < 3) {
            condArr = cfg.openLimitDesc.split("#");
            return condArr[activeNum];
        }
        return "";
    }
}