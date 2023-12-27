/**
 * 诛仙塔list渲染item
 */
class TowerCopyItem extends ListRenderer {
	public c1:fairygui.Controller;
	private txt_floor:fairygui.GTextField;
	private middle:fairygui.GImage;
	private MCOpen:fairygui.GMovieClip;
	private MCLock:fairygui.GMovieClip;
	private floor:number = 0;
	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
		this.c1 = this.getController("c1");
		this.txt_floor = this.getChild("txt_floor").asTextField;
		this.middle = this.getChild("middle").asImage;
		this.MCOpen = this.getChild("MCOpen").asMovieClip;
		this.MCLock = this.getChild("MCLock").asMovieClip;
	}
	public setData(data:any):void{		
		this._data = data;
		if(!this._data){
			this.c1.selectedIndex = 1;
			this.txt_floor.visible = false;
			return;
		}
		this.txt_floor.visible = true;
		this.floor = data.floor?data.floor:0;		
		this.txt_floor.text = "第"+this.floor+"层";
		this.txt_floor.visible = true;
		this.resetTower();
	}
	public get height():number{
		var h:number = this.getCalH();			
		return h;
	}
	public resetTower():void{
		var top:number = CacheManager.copy.getCopyProcess(CopyEnum.CopyTower)+2;
		this.MCLock.visible = false;
		this.txt_floor.visible = true;
		if(this.floor==1){
			this.c1.selectedIndex = 0; //塔底			
		}else if(this.floor==0){
			this.c1.selectedIndex = 2; //塔顶
			this.txt_floor.visible = false;
			this.MCLock.visible = true;
		}else{
			this.c1.selectedIndex = 1; //塔中
			this.MCOpen.visible = this.floor==top;			
		}
	}
	public setAsTopTower():void{
		this.c1.selectedIndex = 2; //塔顶
		this.txt_floor.visible = false;
	}

	public getCalH():number{
		var hArr:number[] = [296,188,226];
		var idx:number = 0;
		if(this.c1){
			idx = this.c1.selectedIndex;
		}
		return hArr[idx];
	}

}