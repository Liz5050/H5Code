class PerData {
    public cfg1:any;
    public cfg2:any;
    public id:number;
}

class ItemLotteryProb extends ListRenderer {


    private txt_name : fairygui.GTextField;
    private txt_per : fairygui.GTextField;
    private txt_name1 : fairygui.GTextField;
    private txt_per1 : fairygui.GTextField;
    private c1 : fairygui.Controller;


	protected constructFromXML(xml:any):void {
		super.constructFromXML(xml);
		this.txt_name = this.getChild("name").asTextField;
        this.txt_per = this.getChild("percent").asTextField;
        this.txt_name1 = this.getChild("name1").asTextField;
        this.txt_per1 = this.getChild("percent1").asTextField;
        this.c1 = this.getController("c1");
	}


    public setData(data : any) {
        if(data.cfg1) {
            this.txt_name.text = data.cfg1.name;
            this.txt_per.text = data.cfg1.rate / 100 + "%";

        }
        if(data.cfg2) {
            this.txt_name1.text = data.cfg2.name;
            this.txt_per1.text = data.cfg2.rate / 100 + "%";
            this.txt_per1.visible = true;
            this.txt_name1.visible = true;
        }
        else {
            this.txt_per1.visible = false;
            this.txt_name1.visible = false;
        }
        this.c1.selectedIndex = data.id % 2;
        
    }
}