/**
 * 必杀套装预览窗口
 */

class UniqueSkillSuitAttrView extends BasePopupView{
	private attrList: fairygui.GList;

	public constructor() {
		super(PackNameEnum.UniqueSkill, "UniqueSkillSuitAttrView");
	}

	public initUI(): void{
		this.attrList = this.getGObject("list_attr").asList;
	}

	public show(): void{
		this.modal = true;
		super.show();
		this.center();

		this.updateList();
	}


	public updateList(): void{
		let data: any = ConfigManager.cultivateSuit.select({"cultivateType": ECultivateType.ECultivateTypeKill});
		let attrDict: any = {};
		let levelMaxNum: any = CacheManager.uniqueSkill.getLevelMaxNum();
		this.attrList.removeChildrenToPool();
		for(let key in data){
			let suitData: any = data[key];
			if(!attrDict[`${suitData.suitName}`]){
				attrDict[`${suitData.suitName}`] = "";
			}
			if(levelMaxNum[suitData.num] >= suitData.level){
				attrDict[`${suitData.suitName}`] += `<font color = '#f2e1c0'>${suitData.num}件套：${suitData.effectDesc}</font>\n`;
			}else{
				let str: string = suitData.effectDesc;
				str = str.replace(/<[^>]+>/g, "");
				attrDict[`${suitData.suitName}`] += `${suitData.num}件套：${str}\n`;
			}
			// if(attrDict[`${suitData.suitName}`]){
			// 	attrDict[`${suitData.suitName}`] += `${suitData.num}件套：${suitData.effectDesc}\n`;
			// }else{
			// 	attrDict[`${suitData.suitName}`] = `${suitData.num}件套：${suitData.effectDesc}\n`;
			// }
		}
		for(let key in attrDict){
			let item: fairygui.GComponent = this.attrList.addItemFromPool().asCom;
			let suitName: fairygui.GTextField = item.getChild("txt_suitName").asTextField;
			let suitAttr: fairygui.GTextField = item.getChild("txt_suitAttr").asTextField;
			suitName.text = key;
			suitAttr.text = attrDict[key];
		}
	}
}