class UIMovieManager {

	private static _effectPool:any = {};

	public constructor() {
	}

	/**
	 * 获取一个UI特效 
	 * @param pkgName 包名 一个特效一个包 并且导出的名称也和包名一致就可以了
	 * */
	public static get(pkgName:string,posX:number=null,posY:number=null,scaleX:number=1,scaleY:number=1,resName:string=null):UIMovieClip{
		let pools:UIMovieClip[] = UIMovieManager._effectPool[pkgName];
		let mc:UIMovieClip;
		if(pools && pools.length>0){
			mc = pools.pop(); 
		}else{			
			!resName?resName = pkgName:"";
			mc =  new UIMovieClip(pkgName,resName);
		}
		posX!=null?mc.x = posX:null; 
		posY!=null?mc.y = posY:null; 
		scaleX!=null?mc.scaleX = scaleX:null; 
		scaleY!=null?mc.scaleY = scaleY:null;
		mc.frame = 0;
		mc.playing = true; 
		return mc;
	}

	public static push(mc:UIMovieClip):void{
		if(!mc){
			return;
		}
		if(!mc.pkgName){ //包名为空的 不能放回池里 因为包名是key
			return;
		}
		let pools:UIMovieClip[] = UIMovieManager._effectPool[mc.pkgName];
		if(!pools){
			pools = [];
			UIMovieManager._effectPool[mc.pkgName] = pools;
		}
		mc.frame = 0;
		mc.alpha = 1;
		mc.rotation = 0;
		mc.playing = false;
		mc.x = 0;
		mc.y = 0;
		mc.removeFromParent();
		mc.clearVars();
		pools.push(mc);
	}

	/**清理某个类的特效 */
	public static clear(pkgName:string):void{
		let pools:UIMovieClip[] = UIMovieManager._effectPool[pkgName];
		if(pools){
			while(pools.length>0){
				let mc:UIMovieClip = pools.pop();
				mc.destroy();
				mc = null;
			}
		}
		delete UIMovieManager._effectPool[pkgName];
	}

	public static clearAll():void{
		for(let key in UIMovieManager._effectPool){
			UIMovieManager.clear(key);
		}
	}


}