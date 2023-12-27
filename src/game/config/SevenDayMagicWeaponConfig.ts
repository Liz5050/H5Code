class SevenDayMagicWeaponConfig extends BaseConfig{
	private datas: Array<any> = [];
	public constructor() {
		super("t_seven_day_magic_weapon","code");
	}

	public getDatas(): Array<any>{
		let dict: any = this.getDict();
		if(this.datas.length == 0){
			for(let key in dict){
				let data: any = dict[key];
				this.datas.push(data);
			}
		}
		return this.datas;
	}

	public getCondStr(code: number, isLongStr: boolean = false): string{
		let condStr: string = "";
		let data: any = this.getByPk(code);
		if(isLongStr){
			condStr += `第${data.openDay}天`;
		}else{
			condStr += `第${data.openDay}天\n`;
		}
		if(this.isSpecialMagicWeapon(data.code)){
			if(isLongStr){
				condStr += `激活全部法宝后解锁`;
			}else{
				condStr += "开启";
			}
		}else{
			if(isLongStr){
				condStr += `或VIP${data.openVip}开启`;
			}else{
				condStr += `或VIP\n${data.openVip}开启`;
			}
		}
		return condStr;
	}

	public isSpecialMagicWeapon(code: number): boolean{
		if(code == 6){
			return true;
		}
		return false;
	}
}