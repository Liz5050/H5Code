/**
 * 外形幻形
 */

class ShapeBaseChangeModule  extends BaseTabModule{
	protected roleItemPanel: RoleItemPanel;
    protected roleIndex: number = 0;
	protected shapeName: string = "战阵";


    public constructor(moduleName:ModuleEnum, packname:string) {
		super(moduleName,packname);
	}

	public initOptUI():void{
		super.initOptUI();
		this.roleItemPanel = <RoleItemPanel>this.getGObject("panel_roleItem");
        this.roleItemPanel.setSelectChangedFun(this.onRoleIndexChanged, this);
		this.tabBtnList.list.visible = false;
		this.descBtn.visible = true;
	}

	public updateAll(data?: any): void {
		this.heightController.selectedIndex = 1;
        let index: number = data ? data.roleIndex : 0;
        this.roleItemPanel.updateRoles(index);
        this.roleIndex = this.roleItemPanel.selectedIndex;
		this.checkRoleItemRedTip();
    }

    private onRoleIndexChanged(index: number, data: any): void {
        this.setRoleIndex(index);
    }

	protected updateSubView():void {
        this.setRoleIndex(this.roleIndex);        
    }

    private setRoleIndex(index: number): void {
		if(this.getShapeCache().getInfo(index)) {
        	this.roleIndex = index;
        	this.roleItemPanel.selectedIndex = index;
		}
		else {
			Tip.showTip(`该角色${this.shapeName}未激活`);
			this.roleItemPanel.selectedIndex = this.roleIndex;
		}
        if (this.curPanel instanceof ShapeBaseChangePanel) {
			this.curPanel.roleIndex = this.roleItemPanel.selectedIndex;
		}
    }


	public clickDesc(): void {
		let desc: string = "1、使用<font color='#09c73d'>战阵灵丹</font>可以提升战阵星数，每满10星可以提升到下一阶。\n" +
							"2、战阵幻形激活后即可开启对应天赋，提升对应系统的属性。\n" +
							"3、提升战阵等阶可以提升战阵的属性，解锁战阵的四个技能，提升战力，增强战场统治力。\n" +   
							"4、战阵可穿戴<font color='#09c73d'>阵眼、阵灵、阵纹、阵诀 </font>四种装备，为战阵穿戴装备可以大幅提升战阵的战力；战阵装备无穿戴等级限制，可以在<font color='#09c73d'>背包-合成</font>页面升级成更高品阶的战阵装备。\n"+   
							"5、在幻形界面可以<font color='#09c73d'>幻形</font>战阵的外形，获得额外的属性和战力；使用战阵进阶丹同样可以提升战阵幻形的等阶，解锁<font color='#09c73d'>天赋</font>和<font color='#09c73d'>技能</font>，助你掌控战场节奏。\n"+   
							"6、多个战阵幻形的天赋激活后可<font color='#09c73d'>同时生效</font>，无需幻形，幻形只改变战阵的外观。\n";
        EventManager.dispatch(UIEventEnum.BossExplainShow, {desc:desc}); 
	}

	/**更新宠物幻形界面 */
    public updatePetChangePanel():void{
        if(this.curPanel instanceof ShapeBaseChangePanel){
           this.curPanel.updatePanel();
        }
		this.checkRoleItemRedTip();
    }
    
    /**更新宠物幻形界面（祝福值更新） */
    public petChangeUpgrade(data: any):void{
        if(this.curPanel instanceof ShapeBaseChangePanel){
           this.curPanel.onSuccess(data);
        }
		this.checkRoleItemRedTip();
    }

	/**
	 * 幻化成功
	 */
	public onChangeModelSuccess(): void {
		if(this.curPanel instanceof ShapeBaseChangePanel) {
			this.curPanel.updateChangeList();
			this.curPanel.updateModel();
		}
		this.checkRoleItemRedTip();
	}
	/**
	 * 道具改版
	 */
	public onPropPackChange(): void {
		if(this.curPanel instanceof ShapeBaseChangePanel) {
			this.curPanel.updateProp();
			this.curPanel.refreshChangeList();
		}
		this.checkRoleItemRedTip();
	}

	 private checkRoleItemRedTip(): void {
        for (let data of this.roleItemPanel.listData) {
            let index = data["index"];
            if (data["role"] != null) {
                let isTip:boolean;
				isTip = this.getChangeCache().checkTips(index);
                this.roleItemPanel.setRoleRedTip(index,isTip);
            }
        }
    }

	public getChangeCache() : ShapeBaseChangeCache {
		return null;
	}

	public getShapeCache() : ShapeBaseCache {
		return null;
	}
}
