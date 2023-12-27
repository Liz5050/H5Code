/**
 * 小地图场景内的实体
 */
class MapEntity extends fairygui.GComponent {
	private _type: MapEntityType;
	private nameTxt: fairygui.GTextField;

	public constructor(type: MapEntityType, name: string = null) {
		super();
		this._type = type;
		let imgX: number = -6;
		let imgY: number = -8;
		let imgName: string = "img_npc";
		if (type == MapEntityType.BOSS) {
			imgName = "img_boss";
			imgX = -6;
			imgY = -8;
		} else if (type == MapEntityType.PATH) {
			imgName = "img_path";
			imgX = -4;
			imgY = -4;
		} else if (type == MapEntityType.PASSPOINT) {
			imgName = "img_passPoint";
			imgX = -20;
			imgY = -26;
		}
		let img: fairygui.GImage = fairygui.UIPackage.createObject(PackNameEnum.WorldMap, imgName).asImage;
		// img.setPivot(0.5, 0.5);
		img.setXY(imgX, imgY);
		this.addChild(img);

		if (name != null) {
			this.nameTxt = new fairygui.GRichTextField();
			this.nameTxt.fontSize = 18;
			this.nameTxt.color = 0xffffff;
			this.nameTxt.bold = true;
			this.nameTxt.autoSize = fairygui.AutoSizeType.Both;
			this.nameTxt.text = name;
			this.nameTxt.stroke = 1;
			this.nameTxt.setXY(-this.nameTxt.width / 2, -40);
			this.addChild(this.nameTxt);
		}
	}

	public get type(): MapEntityType {
		return this._type;
	}
}