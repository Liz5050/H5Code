class ForgeImmortalsCircleView extends BaseView{
	private value:number = -1;
	private lastValue:number;
	private maxValue: number = 9;//最大值
	private startAngle: number = -90;//起始角度，单位度。
	private shape: egret.Shape;
	private imgCircle:GLoader;
	private loaderIco:GLoader;
	private centerX:number;
	private centerY:number;
	private ballImgs:fairygui.GImage[];
	private effCtn:fairygui.GComponent[];
	private effPosDict:any;

	private motionCalllFn:Function;
	private motionCaller:any;
	private curIndex:number;
	public constructor(view:fairygui.GComponent) {
		super(view);
	}
	protected initOptUI():void{
		this.shape = new egret.Shape();
        (this.view.displayObject as egret.DisplayObjectContainer).addChild(this.shape);
		this.imgCircle = <GLoader>this.getGObject("img_circle");
		this.loaderIco = <GLoader>this.getGObject("loader_ico");
		this.centerX = this.imgCircle.x + this.imgCircle.width/2;
		this.centerY = this.imgCircle.y + this.imgCircle.height/2;
		this.imgCircle.displayObject.mask = this.shape;
		this.imgCircle.load(URLManager.getModuleImgUrl("immortals_circle.png",PackNameEnum.Forge));	

	}
	
	public updateAll(data?:any):void{
		//来到这里 等级不可能是0
		this.initBalls();
		let lv:number = CacheManager.forgeImmortals.getImmortalLevel(data.roleIndex,data.info.position);		
		let d:number = lv%ForgeImmortalsCache.BREAK_LV;				
		let idx:number = -1;
		let proVal:number = Math.max(d-1,0);
		if(lv>0){			
			if(d==0){ //整十
				idx = this.ballImgs.length-1;
				proVal = this.maxValue;
			}else{
				idx = d-1;
			}
		}
		this.curIndex = idx;
		this.updateValue(proVal);
		let isMotionEff:boolean = data.isOnlineMotion;
		this.updateBallStatus(isMotionEff,idx);
		
	}

	private updateBallStatus(isMotionEff:boolean,idx:number):void{
		for(let i:number=0;i<this.ballImgs.length;i++){
			let img:fairygui.GImage = this.ballImgs[i];			
			let isOk:boolean = idx>=i;
			//img.visible = !isOk;
			img.grayed = !isOk;
			let eff:fairygui.GComponent = this.effCtn[i];
			if(!isMotionEff){
				eff.visible = isOk;
				let effPos:any =this.effPosDict[i];
				eff.x = effPos.x;
				eff.y = effPos.y;
				if(isOk){
					let name:string = "effectMc";
					if(!eff.getChild(name)){
						let mc:UIMovieClip = UIMovieManager.get(PackNameEnum.Skill,0,0,1,1,"MCMeridian");
						mc.name = name;										
						eff.addChild(mc); //-67 -65
					}
				}else{
					eff.removeChildren();
				}
			}else{
				egret.Tween.removeTweens(eff);
				let tw:egret.Tween = egret.Tween.get(eff); 
				tw.to({x:-67,y:-65},500);
				tw.call(this.onEffectEnd,this,[i]);

				
			}

		}

	}

	public updateValue(newValue: number): void {
        // if (newValue < this.lastValue) {
        //     console.log(newValue);
        // }
        if (this.value == newValue) return;
        this.value = newValue;
        let newAngle = this.startAngle + ((newValue / this.maxValue) * 360) % 360;
        if (newValue >= this.maxValue) {
            newAngle = this.startAngle + 360;
        }
        this.changeGraphics(newAngle);
        this.lastValue = newValue;
    }

	public setMotionCall(fn:Function,caller:any):void{
		this.motionCalllFn = fn;
		this.motionCaller =  caller;
	}

	private onEffectEnd(i:number):void{		
		let eff:fairygui.GComponent = this.effCtn[i];
		eff.visible = false;
		if(i==this.ballImgs.length-1){			
			if(this.motionCalllFn && this.motionCaller){
				this.motionCalllFn.call(this.motionCaller);
			}	
		}		
		this.updateBallStatus(false,this.curIndex);
	}

	private initBalls():void{
		if(!this.ballImgs){
			this.ballImgs = [];
			this.effCtn = [];
			this.effPosDict = {};
			for(let i:number=0;i<this.maxValue;i++){			
				this.ballImgs.push(this.getGObject("img_ball"+i).asImage);
				let cnt:fairygui.GComponent = this.getGObject("eff_"+i).asCom;
				this.effPosDict[i] = {x:cnt.x,y:cnt.y};
				this.effCtn.push(cnt);
			}
		}
		
	}
	private changeGraphics(angle) {
        let r: number = 190;
        this.shape.graphics.clear();
        this.shape.graphics.moveTo(0, 0);
        this.shape.graphics.beginFill(0x00ffff, 1);
        this.shape.graphics.lineTo(this.centerX, -this.centerY);
        this.shape.graphics.drawArc(this.centerX,this.centerY, r, this.startAngle * Math.PI / 180, angle * Math.PI / 180, false);
        this.shape.graphics.lineTo(this.centerX,this.centerY);
        this.shape.graphics.endFill();
    }
}