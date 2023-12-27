class AchievementCategoryBtn extends ListRenderer
{
	private categoryBtn:fairygui.GButton;
	public constructor() 
	{
		super();
	}

	protected constructFromXML(xml:any):void
	{
		super.constructFromXML(xml);
		this.categoryBtn = this.getChild("btn_chanel").asButton;
	}

	public setData(data:any):void
	{
		this._data = data;
		let categoryName:string = ConfigManager.achievementName.getCategoryName(data);
		this.categoryBtn.text = categoryName;
	}
	
	public set btnSelected(value:boolean)
	{
		this.categoryBtn.selected = value;
	}
}