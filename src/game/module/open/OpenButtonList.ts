/**
 * 按钮列表
 */
class OpenButtonList {
	private posEnum: string;
	/**所有按钮名称 */
	private btnNames: Array<string>;
	/**已显示的按钮 */
	private showedBtns: Array<fairygui.GObject>;

	public constructor(posEnum: string, btnNames: Array<string>) {
		this.posEnum = posEnum;
		this.btnNames = btnNames;
	}

	/**
	 * 更新按钮显示及坐标
	 */
	public update(): void {
		this.showedBtns = [];
		let btn: fairygui.GObject;
		let isOpen: boolean;
		for (let i: number = 0; i < this.btnNames.length; i++) {
			btn = OpenButtonCfg.getBtnObj(this.btnNames[i], this.posEnum);
			isOpen = OpenButtonCfg.isOpenButton(this.btnNames[i]) && !OpenButtonCfg.isInNotShow(this.btnNames[i]);
			btn.visible = isOpen;
			btn.touchable = isOpen;
			if (btn.visible) {
				this.showedBtns.push(btn);
			}
		}

		let firstBtn: fairygui.GObject = OpenButtonCfg.getFirstButton(this.posEnum);
		let startX: number = firstBtn.x;
		let startY: number = firstBtn.y;
		for (let i: number = 0; i < this.showedBtns.length; i++) {
			btn = this.showedBtns[i];
			switch (this.posEnum) {
				case OpenPosEnum[OpenPosEnum.TopRight]:
					btn.x = startX - i * firstBtn.width;
					btn.y = startY;
					break;
				case OpenPosEnum[OpenPosEnum.Left1]:
				case OpenPosEnum[OpenPosEnum.Left2]:
				case OpenPosEnum[OpenPosEnum.Right1]:
				case OpenPosEnum[OpenPosEnum.Right2]:
					btn.x = startX;
					btn.y = startY + i * firstBtn.height;
					break;
				case OpenPosEnum[OpenPosEnum.Navbar]:
					btn.x = startX + i * firstBtn.width;
					btn.y = startY;
					break;
			}
		}
	}

	/**
	 * 获取按钮坐标。默认在列表最后一个位置
	 * @param name 按钮名称
	 */
	public getBtnPos(name: string): egret.Point {
		let btn: fairygui.GObject;
		if (this.showedBtns.length == 0) {
			btn = OpenButtonCfg.getFirstButton(this.posEnum);
		} else {
			let isShow: boolean;
			for (let i: number = 0; i < this.showedBtns.length; i++) {
				btn = this.showedBtns[i];
				if (btn.name == name && btn.visible) {
					isShow = true;
					break;
				}
			}
			if (!isShow) {
				btn = this.showedBtns[this.showedBtns.length - 1];
			}
		}
		return btn.localToGlobal();
	}

	/**
	 * 添加按钮到指定位置
	 * @param name 按钮名称
	 * @param index 位置序号，从左到右从0开始
	 */
	public addToIndex(name: string, index: number, duration: number = 1000): void {
		OpenButtonCfg.addToNotShow(name);
		let btn: fairygui.GObject;
		let len: number = this.showedBtns.length;
		let needMoveNum: number = len - index;
		let moveNum: number = 0;
		let self: any = this;
		for (let i: number = 0; i < len; i++) {
			if (i >= index) {
				btn = this.showedBtns[i];
				egret.Tween.get(btn).to({ x: btn.x + btn.width }, duration).call(() => {
					moveNum++;
					if (moveNum >= needMoveNum) {
						OpenButtonCfg.removeFromNotShow(name);
						self.update();
					}
				});
			}
		}
	}
}