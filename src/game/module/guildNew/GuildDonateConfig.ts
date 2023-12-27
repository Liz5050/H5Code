class GuildDonateConfig extends BaseConfig{
	private _donateInfos:any[];

	public constructor() {
		super("t_guild_donate_config","type");
	}

	public getDonateInfos():any[]{
		if(!this._donateInfos){
			this._donateInfos = [];
			let dict:any = this.getDict();
			for(let key in dict){
				this._donateInfos.push(dict[key]);
			}
			App.ArrayUtils.sortOn(this._donateInfos,"type");
		}
		return this._donateInfos;
	}

	public getDonateCfgByType(type:number):any {
		let cfgs:any[] = this.getDonateInfos();
		for(let i:number = 0; i < cfgs.length; i++) {
			if(type == cfgs[i].type) return cfgs[i];
		}
		return null;
	}
}