/**
 * 外观开启
 */
class OpenShapePanel extends BaseTabPanel {
	private modelContainer: fairygui.GComponent;
	private modelBody: egret.DisplayObjectContainer;
	private model: ModelShow;
	private nameLoader: GLoader;
	private descLoader: GLoader;

	

	private modelDict: any;

	public initOptUI(): void {
		this.modelContainer = this.getGObject("model_container").asCom;
		this.modelBody = ObjectPool.pop("egret.DisplayObjectContainer");
		(this.modelContainer.displayObject as egret.DisplayObjectContainer).addChild(this.modelBody);

		this.nameLoader = <GLoader>this.getGObject("loader_name");
		this.descLoader = <GLoader>this.getGObject("loader_desc");

		this.modelDict = {
			"Mount": EShape.EShapeMount,
			"Pet": EShape.EShapePet,
			"Wing": EShape.EShapeWing,
			"Magic": EShape.EShapeMagic,
			"Spirit": EShape.EShapeSpirit
		};
	}

	public updateAll(): void {
	}

	/**
	 * 清除模型
	 */
	public clearModel(): void {
		if (this.model != null) {
			this.model.destroy();
			this.model = null;
		}
	}

	public getIconPos(): egret.Point {
		return new egret.Point(fairygui.GRoot.inst.width / 2, fairygui.GRoot.inst.height / 2);
	}

	public update(cfg: any): void {
		if (cfg != null) {
			let a: Array<string> = cfg.showModel.split("#");
			this.nameLoader.load(`ui://${PackNameEnum.Open}/${a[0]}`);
			this.descLoader.load(`ui://${PackNameEnum.Open}/${a[1]}`);

			if (this.model == null) {
				this.model = new ModelShow(this.modelDict[cfg.openKey]);
				this.modelBody.addChild(this.model);
			}
			let modelId: number = Number(a[2]);
			this.model.setData(modelId);

			if (modelId == 1001) {
				this.modelBody.x = 350;
				this.modelBody.y = 600;
			} else if (modelId == 2001) {
				this.modelBody.x = 380;
				this.modelBody.y = 420;
			} else if (modelId == 3001) {
				this.modelBody.x = 470;
				this.modelBody.y = 420;
			} else if (modelId == 4001) {
				this.modelBody.x = 380;
				this.modelBody.y = 420;
			} else if (modelId == 6001) {
				this.modelBody.x = 360;
				this.modelBody.y = 520;
			}
		}
	}
}