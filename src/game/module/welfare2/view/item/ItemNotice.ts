class ItemNotice extends ListRenderer {

    private txt_notice : fairygui.GRichTextField;

    protected constructFromXML(xml:any):void {
        super.constructFromXML(xml);
        this.txt_notice = this.getChild("txt_notice").asRichTextField;
    }

    public setData(data:any):void{
		this._data = data;
        this.txt_notice.text = data;
	}

    
} 