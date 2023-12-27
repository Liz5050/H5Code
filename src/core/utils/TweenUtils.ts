class TweenUtils {
	public static to(tar:any,toProps:any,douration:number,callFn:Function=null,caller:any=null,getProps:any=null,easeFn:Function=null,delay:number=0,isAutoKill:boolean=true):egret.Tween{
		if(isAutoKill){
			TweenUtils.kill(tar);
		}
		var t:egret.Tween = egret.Tween.get(tar,getProps);	
		if(delay>0){
			t.wait(delay);
		}
		t.to(toProps,douration,easeFn);		
		if(callFn && caller){
			t.call(callFn,caller);
		}
		return t;
	}
	public static kill(tar:any):void{
		egret.Tween.removeTweens(tar);
	}
	
	public static toYoYo(tar:any,duration:number,startProp:any,yoyoProp:any):void{
		TweenUtils.kill(tar);
		start();
		function start():void{
			var t:egret.Tween = egret.Tween.get(tar);
			t.to(startProp,duration);
			t.call(yoyo);
		}
		
		function yoyo():void{
			var t:egret.Tween = egret.Tween.get(tar);
			t.to(yoyoProp,duration);
			t.call(start);
		}

	}

}