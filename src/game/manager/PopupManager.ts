/**
 * Popup管理器
 */
class PopupManager {
	private static _curView:BaseGUIView;
	private static _curParent:fairygui.GComponent;
	private static _viewbound:egret.Rectangle;
	private static _textrue:egret.RenderTexture;
	private static _viewMap:any = {};
	private static _parentMap:any = {};
	private static _viewList:BaseGUIView[] = [];
	private static _parentList:fairygui.GComponent[] = [];

	public constructor() {
	}
	/**
	 * 注册视图
	 */
	public static regist(view:BaseGUIView,parent:fairygui.GComponent):void{
		if(PopupManager._curView){
			PopupManager.addView(PopupManager._curView,true);
			
		}
		PopupManager._curView = view;
		PopupManager._curParent = parent;
		if(!this._viewbound){
			this._viewbound = new egret.Rectangle();
		}		
		if(!PopupManager._textrue){
			PopupManager._textrue = App.RenderTextureManager.pop();
		}
		if(!PopupManager._curParent.displayObject.hasEventListener(egret.TouchEvent.TOUCH_TAP)){
			PopupManager._curParent.displayObject.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onParentClick,this);
		}
		PopupManager.addView(view,false);
		
		if(PopupManager._parentList.indexOf(parent)==-1){
			PopupManager._parentList.push(parent);
		}
		
	}
	private static addView(view:BaseGUIView,isInsert:boolean):void{		
		if(view && PopupManager._viewList.indexOf(view)==-1){
			if(isInsert){
				ArrayUtils.insert(PopupManager._curView,0,PopupManager._viewList);
			}else{
				PopupManager._viewList.push(view);
			}			
		}

	}
	/**
	 * 取消当前控制的视图
	 */
	public static unregist(view:BaseGUIView):void{
		let idx:number = PopupManager._viewList.indexOf(view);
		if(idx>-1){
			PopupManager._viewList.splice(idx,1);
		}
		if(PopupManager._viewList.length>0){
			let v:BaseGUIView = PopupManager._viewList.pop();
			PopupManager._curView = v;
			let idx:number = PopupManager._parentList.indexOf(v.parent);
			if(idx>-1){
				PopupManager._curParent = v.parent;
			}
		}else{
			PopupManager._curView = null;
			for(let par of PopupManager._parentList){
				par.displayObject.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onParentClick,this);
			}
			App.ArrayUtils.emptyArr(PopupManager._parentList);			
			PopupManager._curParent = null;
		}
		
	}

	private static onParentClick(e:egret.TouchEvent):void{			
		if(PopupManager._curView && PopupManager._curParent && e.target instanceof egret.DisplayObject){ // 
			let idx:number = PopupManager._curParent.getChildIndex(PopupManager._curView);
			let clickP:egret.Point = PopupManager._curParent.globalToLocal(e.stageX,e.stageY);			
			if(idx>-1){
				PopupManager._viewbound.x = PopupManager._curView.x - PopupManager._curView.width * PopupManager._curView.pivotX; 
				PopupManager._viewbound.y = PopupManager._curView.y - PopupManager._curView.height * PopupManager._curView.pivotY;
				PopupManager._viewbound.width = PopupManager._curView.width;
				PopupManager._viewbound.height = PopupManager._curView.height;								
				if(!PopupManager._viewbound.contains(clickP.x,clickP.y)){ //先用点击区域判断实现
					PopupManager._curView.hide();					
				}
			}			
		}		
	}

	public static checkClickOutRange(view:BaseGUIView,parent:fairygui.GComponent,stageX:number,stageY:number):boolean{
		if(view && parent){
			if(!PopupManager._viewbound){
				PopupManager._viewbound = new egret.Rectangle();
			}
			let idx:number = parent.getChildIndex(view);
			let mIdx:number = PopupManager.getMaxPropupChildIdx(parent);
			if(idx>-1 && idx==mIdx){ //同一个层 可能有多个popup窗口 优先关闭最顶层的
				let clickP:egret.Point = parent.globalToLocal(stageX,stageY);
				PopupManager._viewbound.x = view.x - view.width *  view.pivotX; 
				PopupManager._viewbound.y = view.y - view.height * view.pivotY;
				PopupManager._viewbound.width =  view.width;
				PopupManager._viewbound.height = view.height;								
				if(!PopupManager._viewbound.contains(clickP.x,clickP.y)){ //先用点击区域判断实现
					view.hide();			
					return true;		
				}
			}
		}
		return false;
	}

	public static getMaxPropupChildIdx(parent:fairygui.GComponent):number{
		let maxIdx:number = -1;
		for(let i:number = 0;i<parent.numChildren;i++){
			let c:fairygui.GObject = parent.getChildAt(i);
			if(c instanceof BaseGUIView && maxIdx<i && c.isPopup){ //
				maxIdx = i;
			}
		}
		return maxIdx;
	}
	
}