class TargetBtnItem extends ListRenderer
{
	private nameTxt:fairygui.GTextField;
	public constructor() 
	{
		super();
	}

	protected constructFromXML(xml:any):void
	{
		super.constructFromXML(xml);
		this.nameTxt = this.getChild("txt_targetName").asTextField;
	}

	public setData(data:any):void
	{
		this.nameTxt.text = data.name;
	}
}