class CopyDefendLogItem extends ListRenderer{
	private cell:ChatContentCell;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void{
		super.constructFromXML(xml);
	}

	public setData(data:any,index:number):void{
		let maxWid:number = 650;
		if(!this.cell){
			this.cell = new ChatContentCell(maxWid);
		}
		this.addChild(this.cell);
		this.cell.x = this.cell.y = 0;
		this.cell.setFontColor(0xc8b185);
		this.cell.setFontSize(20);
		this.cell.setOnlyLineFlag(true);
		this.cell.update(data);

	}

}