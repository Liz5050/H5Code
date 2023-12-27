class GuildNewListPanel extends BaseTabView{
	private listGuild:List;
	public constructor() {
	    super();
	}
	protected initOptUI():void{     
	    this.listGuild = new List(this.getGObject("list_guild").asList);      
	}

	public updateAll(param?:any):void{
	    if(param){	
	        this.listGuild.setVirtual(param);
	    }	    		
	}

}