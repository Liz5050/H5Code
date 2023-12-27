/**
 * 开启按钮信息
 */
class OpenButtonInfo {
	/**起始坐标 */
	public startPos: egret.Point;
	/**是否在导航栏 */
	public isInNavbar: boolean;
	/**新加的按钮名称 */
	public name: string;
	/**新加按钮位置 */
	public index: number;
	/**增加前所有按钮 */
	public btnNames: Array<string>;
	/**增加按钮后最终的所有按钮 */
	private _finalBtnNames: Array<string>;

	public constructor(cfg: any = null) {
		if (cfg != null) {
			this.initByCfg(cfg);
		}
	}

	public initByCfg(cfg: any): void {
		if (cfg["startPos"]) {
			let a: Array<string> = cfg["startPos"].split(",");
			this.startPos = new egret.Point(Number(a[0]), Number(a[1]));
		}
		if (cfg["type"]) {
			this.isInNavbar = cfg["type"] == "navbar";
		}
		if (cfg["add"]) {
			this.name = cfg["add"];
		}
		if (cfg["index"]) {
			this.index = cfg["index"];
		}
		if (cfg["btns"]) {
			this.btnNames = cfg["btns"];
		}
	}

	public get finalBtnNames(): Array<any> {
		if (this._finalBtnNames == null) {
			this._finalBtnNames = [].concat(this.btnNames)
			this._finalBtnNames.splice(this.index, 0, this.name);
		}
		return this._finalBtnNames;
	}
}