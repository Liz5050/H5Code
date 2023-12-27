class MgRuneConfig extends BaseConfig {
	public constructor() {
		super("t_mg_rune","code,level");
	}

	public getRuneExp(itemData: ItemData): number{
		let runeData: any = ConfigManager.mgRune.getByPk(`${itemData.getEffect()},${itemData.getItemExtInfo().level}`);
		if(runeData.decomposeExp){
			return runeData.decomposeExp;
		}
		return 0;
	}

	public getRuneCoin(itemData: ItemData): number{
		let runeData: any = ConfigManager.mgRune.getByPk(`${itemData.getEffect()},${itemData.getItemExtInfo().level}`);
		if(runeData.decomposeCoin){
			return runeData.decomposeCoin;
		}
		return 0;
	}
}