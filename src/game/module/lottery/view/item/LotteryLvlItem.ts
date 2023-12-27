


class LotteryLvlItem extends ListRenderer {

    private txt_lvl : fairygui.GTextField;
    public level : number;

    protected constructFromXML(xml:any):void {
		super.constructFromXML(xml);
        this.txt_lvl = this.getChild("name").asTextField;
	}

    public setData(data : any,index: number) {
        this.txt_lvl.text = data;
        this.itemIndex = index;
    }

}