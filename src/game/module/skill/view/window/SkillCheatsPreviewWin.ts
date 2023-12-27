class SkillCheatsPreviewWin extends BaseWindow {
	
	private listCom:List;
	private listData:any[];
	private roleIndex:number = 0;
	public constructor() {
		super(PackNameEnum.SkillCheats,"SkillCheatsPreviewWin");
	}

	public initOptUI():void{
		this.listCom = new List(this.getGObject("list_com").asList);
	}

	public updateAll(data?:any):void{	
		this.listData = [];
		let titles:string[] = [LangSkill.LANG4,LangSkill.LANG5];
		let colors:number[] = [EColor.EColorOrange,EColor.EColorRed];
		this.roleIndex = data.roleIndex;
		for(let i:number=0;i<titles.length;i++){
			this.listData.push({list:this.getListItem(colors[i]),title:titles[i],roleIndex:data.roleIndex});
		}
		this.listCom.setVirtual(this.listData,this.setItemRender,this);		
	}

	private setItemRender(index: number, item:CheatsSelectWinComItem):void{
		if(this.listData[index]){			
			item.setData(this.listData[index],index);
			item.setSize(item.width,item.getH());
		}
	}

	private getListItem(color:EColor):ItemData[]{
		let data:ItemData[] = [];
		let items1:any[] = ConfigManager.item.select({category:ECategory.ECategoryCheats,color:color});		
		for(let i:number=0;i<items1.length;i++){			
			let item:ItemData = new ItemData(items1[i].code);
			data.push(item);
		}		
		return data;
	}
	
}