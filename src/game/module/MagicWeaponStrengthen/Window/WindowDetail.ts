/**
 * 法器升星 
*/

class WindowDetail extends BaseWindow {

    //private txtSkillName : fairygui.GRichTextField;
    //private txtSkillDesc : fairygui.GRichTextField;
    //private skillNumber : number;
    private attrTxt : fairygui.GRichTextField;
    private lineNumber : string[];

    public constructor() {
        super(PackNameEnum.MagicWeaponStrengthen , "WindowDetail");
    }


    public initOptUI() : void {
        this.lineNumber = ["\n\n" , "\n\n\n" , "\n\n\n\n" , "\n\n\n" , "\n\n\n\n"];
        //this.txtSkillName = this.getGObject("txt_skillName").asRichTextField;
        //this.txtSkillDesc = this.getGObject("txt_skillDesc").asRichTextField;
        this.attrTxt = this.getGObject("txt_addr").asRichTextField;
        //this.skillNumber = ConfigManager.sevenDayMagicWeapon.configLength;
        let strName : string = "";
        let strDesc : string = "";
        /*for(let i = 0 ; i < this.skillNumber - 1 ; i++)
        {
            let skillcode = ConfigManager.sevenDayMagicWeapon.getDatas()[i].skillId;
            let skillcfg = ConfigManager.skill.getSkill(skillcode);
            strName += skillcfg.skillName;
            strName += this.lineNumber[i];
            strDesc += skillcfg.skillDescription;
            strDesc += "\n\n";
            
        }*/
        //this.txtSkillName.text = strName;
        //this.txtSkillDesc.text = strDesc;
        
    }

    public updateAll(data: any = null): void {
        this.setAttrText();
	}

    public setAttrText() : void {
        this.attrTxt.text = "";
        let str : string = "";


        let magicWeaponDatas = ConfigManager.sevenDayMagicWeapon.getDatas();//要算上激活的那几个法器的数值

        let arrMagic =  WeaponUtil.getAttrArray(magicWeaponDatas[0].attrList);
        for(let i=1;i<magicWeaponDatas.length ;i++) {
            let arr1 = WeaponUtil.getAttrArray(magicWeaponDatas[i].attrList);
            arrMagic[0][1] += arr1[0][1];
            arrMagic[1][1] += arr1[1][1];
            arrMagic[2][1] += arr1[2][1];
            arrMagic[3][1] += arr1[3][1];
        }


        let arr =  WeaponUtil.getAttrArray(CacheManager.magicWeaponStrengthen.cfg.attrList);

        arr[0][1] += arrMagic[0][1];
        arr[1][1] += arrMagic[1][1];
        arr[2][1] += arrMagic[2][1];
        arr[3][1] += arrMagic[3][1];

        str = "";
        str += "攻         击:       <font color = "+ Color.Color_8 +">"+ arr[0][1] +"</font>\n";
        str += "破         甲:       <font color = "+ Color.Color_8 +">"+ arr[1][1] +"</font>\n";
        str += "生         命:       <font color = "+ Color.Color_8 +">"+ arr[2][1] +"</font>\n";
        str += "防         御:       <font color = "+ Color.Color_8 +">"+ arr[3][1] +"</font>\n";

        this.attrTxt.text = str;
    }
}