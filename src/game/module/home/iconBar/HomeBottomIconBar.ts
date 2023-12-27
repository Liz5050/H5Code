class HomeBottomIconBar extends fairygui.GComponent {
	private allIcons:fairygui.GComponent[] = [];
	private iconTotalW:number = 0;
	public constructor() {
		super();
	}

	public addIcon(icon:fairygui.GComponent):void {
		if(this.allIcons.indexOf(icon) != -1) return;
		this.iconTotalW += icon.width;
		this.allIcons.push(icon);
		this.addChild(icon);
		this.updateIconPosition();
	}

	public removeIcon(icon:fairygui.GComponent):void {
		let index:number = this.allIcons.indexOf(icon);
		if(index == -1) return;
		this.iconTotalW -= icon.width;
		this.allIcons.splice(index,1);
		this.removeChild(icon);
		this.updateIconPosition();
	}

	private updateIconPosition():void {
		let startX:number = (this.width - this.iconTotalW) / 2;
		this.iconTotalW = 0;
		for(let i:number = 0; i < this.allIcons.length; i++) {
			this.allIcons[i].x = startX + this.iconTotalW;
			this.iconTotalW += this.allIcons[i].width;
		}
		this.touchable = this.allIcons.length > 0;
	}	
}