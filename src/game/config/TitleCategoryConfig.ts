class TitleCategoryConfig extends BaseConfig {
	public constructor() {
		super("t_title_area_type", "type");
	}

	public getTitleCategoryList():any[]
	{
		let dict:any = this.getDict();
		let list:any[] = [];
		for(let type in dict)
		{
			list.push(dict[type]);
		}
		return list;
	}
}