class GuildFlagItem extends ListRenderer {
	private flagLoader: GLoader;
	private flag: number;

	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.flagLoader = <GLoader>this.getChild("loader_flag");
	}

	public setData(data: any, index: number = -1): void {
		this.flag = data;
		this.flagLoader.load(URLManager.getPackResUrl(PackNameEnum.Guild, `image_banner${this.flag}`));
	}

}