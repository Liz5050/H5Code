/**
 * 神器界面的碎片、模型展示
 */
class GodWeaponModelView extends BaseContentView {
	private viewMap:any;
	private curInfo:any;
	private pieceImgDict:any;
	private godLoadDict:any;
	private ctrlDict:any;
	private tweenTime:number;
	public constructor(par:fairygui.GComponent) {
		super(PackNameEnum.TrainGW1,"TrainGW",null,par);
		this.viewMap = {};
		this.pieceImgDict = {};
		this.godLoadDict = {};
		this.ctrlDict = {};
		this.tweenTime = 2000;
	}

	public initOptUI():void{		
		let dict:any = this.pieceImgDict[this._onShowParam.code];
		if(!dict){
			dict = {};
			let id:number = 0;
			while(true){
				id++;
				let key:string = "img_piece_"+(id-1);
				let gobj:fairygui.GObject = this.getGObject(key);			
				if(!gobj){
					break;
				}else{
					dict[id] = gobj.asImage;
				}
			}
			this.pieceImgDict[this._onShowParam.code] = dict;
		}	
		
	}

	public updateAll(data:any):void{
		this.setPos();
		this.curInfo = data;
		let isAct:boolean = CacheManager.godWeapon.isGodWPAct(this.curInfo.code);
		let idx:number = 0;	
		if(!isAct){
			let pieceList:any[] = ConfigManager.godWeapon.getPieceList(this.curInfo.code);
			for(let i:number = 0;i<pieceList.length;i++){
				let img:fairygui.GImage = this.getGImg(pieceList[i].piece);
				if(img){
					let grayed:boolean = !CacheManager.godWeapon.isGodWPieceAct(pieceList[i].code,pieceList[i].piece);
					img.grayed = grayed;
					if(grayed){
						//img.filters = EFilters.BLACKS;
						img.alpha = 0.4;
					}else{
						//img.filters = null;
						img.alpha = 1;
					}
				}
			}									
		}else{
			idx = 1;					
		}		
	
	}
	
	/**
	 * 根据特定的 pkgName 和 contentName显示UI 
	 */
	public showByPkgContent(param: any = null, callBack: CallBack = null,pkgName:string="",contentName:string=""):void{
		let v:fairygui.GComponent = this.viewMap[param.code];
		if(this.view && v!=this.view){
			this.view.removeFromParent();
			this.view = null;
		}		
		if(!v){
			if(pkgName){
				this.packageName = pkgName;
				this._isInit = false;
				this._isForceLoad = true;
			}			
			if(contentName){
				this.viewName = contentName;
				this._isInit = false;
				this._isForceLoad = true;
			}			
		}else{
			this.view = v;
			if(!this.view.parent){
				this.addChild(this.view);
			}			
		}
		this.show(param,callBack);
		
	}

	public onShow(data: any = null): void {
		super.onShow(data);
		let v:fairygui.GComponent = this.viewMap[data.code];
		if(!v){
			this.viewMap[data.code] = this.view;
		}
	}

	private getGImg(piece:number):fairygui.GImage{
		return this.pieceImgDict[this.curInfo.code][piece];
	}
	
	
	private setPos():void{
		let par:fairygui.GComponent = this.parent;
		this.x = par.width - this.width >> 1;
		this.y = par.height - this.height;
	}

}