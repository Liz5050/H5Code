/**
 * 预览组件
 * @author zhh
 * @time 2018-09-03 16:40:02
 */
class CheatsSelectWinComItem extends ListRenderer{
    private txtTitle:fairygui.GTextField;
    private listItem:List;
    private itemRenderProp:any;
	public constructor(view:fairygui.GComponent) {
		super();
	}
	protected constructFromXML(xml:any):void{
        super.constructFromXML(xml);
        //---- script make start ----
        this.txtTitle = this.getChild("txt_title").asTextField;
        this.listItem = new List(this.getChild("list_item").asList);

        this.itemRenderProp = {toolTipSource:ToolTipSouceEnum.CheatPreview};

        //this.listItem.list.addEventListener(fairygui.ItemEvent.CLICK,this.onGUIListSelect,this);
        //---- script make end ----


	}
    public setData(data:any,index:number):void    {
        this.itemRenderProp.roleIndex = data.roleIndex;
        this.listItem.renderProps = this.itemRenderProp; 
        this.listItem.data = data.list; //item表的配置
        this.listItem.list.resizeToFit();
        this.setTitle(data.title);
    }

	public getH():number{
        return this.listItem.list.y + this.listItem.list.height+20;
    }

    public setTitle(value:string):void{
        this.txtTitle.text = value;
    }
    

}