class MgBeastEquipConfig extends BaseConfig {
    public constructor() {
        super("t_mg_beast_equip", "code");
    }

    /**@param code item表effect */
    public getStarAttrDict(code: number): void {
        let data: any = this.getByPk(code);
        if (data) {
            return WeaponUtil.getAttrDict(data.starAttrList);
        }
    }

    /**@param code item表effect */
    public getStar(code: number): number {
        let star: number = 0;
        let data: any = this.getByPk(code);
        if (data) {
            star = data.star;
        }
        return star;
    }

    /**@param code item表effect */
    public getColorEx(code: number): number {
        let colorEx: number = 0;
        let data: any = this.getByPk(code);
        if (data && data.colorEx) {
            colorEx = data.colorEx;
        }
        return colorEx;
    }

    /**@param code item表effect */
    public getDecomposeExp(code: number): number {
        let decomposeExp: number = 0;
        let data: any = this.getByPk(code);
        if (data) {
            decomposeExp = data.decomposeExp;
        }
        return decomposeExp;
    }
}