/**
 * 道具获取
 */
class PropGetConfig extends BaseConfig {
	public constructor() {
		super("t_mg_prop_get", "propId");
	}

	public getDataById(propId: number): Array<any> {
		let cfg: any = this.getByPk(propId);
		let datas: Array<any> = [];
		if(cfg){
			let links: Array<string> = cfg.buyLink.split("#");
			let showText: Array<string> = cfg.showText.split("#");
			for (let i: number = 0; i < links.length; i++) {
				let obj:any = {};
				obj.type = links[i];
				obj.name = showText[i];
				datas.push(obj);
			}
		}
		return datas;
	}
}