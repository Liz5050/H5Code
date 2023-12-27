/**
 * 展示模型容器
 */
class ModelContainer extends fairygui.GComponent {
	private modelBody: egret.DisplayObjectContainer;
	private model: ModelShow;

	private _shape: EShape;
	private _thisParent: fairygui.GComponent;
	public constructor(parent: fairygui.GComponent, shape: EShape) {
		super();
		this._thisParent = parent;
		this._shape = shape;
		this.initUI();
	}

	public initUI(): void {
		this._thisParent.addChild(this);
		this.model = new ModelShow(this.shape);
		
		this.modelBody = ObjectPool.pop("egret.DisplayObjectContainer");
		this.modelBody.addChild(this.model);

		(this._thisParent.displayObject as egret.DisplayObjectContainer).addChild(this.modelBody);
	}

	public set isShapeChangeMc(value:boolean){
		this.model.isShapeChangeMc = value;
	}
	
	public set shape(shape: EShape) {
		this._shape = shape;
		this.model.setShowType(shape);
	}

	public get shape(): EShape {
		return this._shape;
	}

	public updateScale(scaleX:number,scaleY:number):void{
		if(this.model){
			this.model.scaleX = scaleX;
        	this.model.scaleY = scaleY;
		}		
	}

	/**
	 * 更新模型坐标
	 */
	public updatePosition(x: number, y: number): void {
		this.modelBody.x = x;
		this.modelBody.y = y;
	}

	public setBodyVisible(value:boolean):void{
		this.modelBody.visible = value; 
	}

	/**
	 * 更新模型
	 */
	public updateModel(modelId: number, shape: EShape = null): void {
		this.model.setData(0);
		if (shape != null) {
			this.shape = shape;
		}
		this.model.setData(modelId);
	}

}