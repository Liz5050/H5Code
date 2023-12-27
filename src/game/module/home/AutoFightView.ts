class AutoFightView extends fairygui.GComponent {
	private _mc:UIMovieClip;
	private _pathName:string;
	private _fightName:string;
	private _curName:string = "";
	public constructor() {
		super();
		this._pathName = "MCAutomaticFinding";
		this._fightName = "MCAutomaticFight";
		//this._mc = new UIMovieClip(PackNameEnum.MCPreload,this._pathName);
		this.addChild(this._mc);
	}

	public updateStatus(isFight:boolean):void{
		var resName:string = isFight?this._fightName:this._pathName;
		if(this._curName!=resName){
			this._curName = resName;
			//this._mc.setRes(PackNameEnum.MCPreload,resName);
			this.setSize(this._mc.width,this._mc.height);
		}
		
		
	}

}