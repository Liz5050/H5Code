/**
 * 资源路径工具
 */
class ResourcePathUtils {
    private static RPGGame: string = "resource/assets/rpgGame/";
    private static RPGGame_Common: string = "resource/assets/rpgGame/common/";
    private static RPGGame_Map: string = "resource/assets/rpgGame/map/";
    private static RPGGame_Show: string = "resource/assets/rpgGame/show/";

    private static RPGGame_Attack: string = "resource/assets/rpgGame/attack/";
    private static RPGGame_Buff: string = "resource/assets/rpgGame/buff/";
    private static RPGGame_Law: string = "resource/assets/rpgGame/law/";
    private static RPGGame_Monster: string = "resource/assets/rpgGame/monster/";
    private static RPGGame_Mount: string = "resource/assets/rpgGame/mount/";
    private static RPGGame_Npc: string = "resource/assets/rpgGame/npc/";
    private static RPGGame_Pet: string = "resource/assets/rpgGame/pet/";
    private static RPGGame_Player: string = "resource/assets/rpgGame/player/";
    private static RPGGame_Skill: string = "resource/assets/rpgGame/skill/";
    private static RPGGame_Spirit: string = "resource/assets/rpgGame/spirit/";
    private static RPGGame_Weapon: string = "resource/assets/rpgGame/weapon/";
    private static RPGGame_Wing: string = "resource/assets/rpgGame/wing/";
    private static RPGGame_Title: string = "resource/assets/rpgGame/title/";

    private static Sound:string = "resource/sound/";

    public static getRPGGame(): string {
        return this.RPGGame;
    }

    public static getRPGGameCommon(): string {
        return this.RPGGame_Common;
    }

    public static getRPGGameMap(): string {
        return this.RPGGame_Map;
    }

    public static getRPGGameShow(): string {
        return this.RPGGame_Show;
    }

    public static getRPGGameAttack(): string {
        return this.RPGGame_Attack;
    }
    public static getRPGGameBuff(): string {
        return this.RPGGame_Buff;
    }
    public static getRPGGameLaw(): string {
        return this.RPGGame_Law;
    }
    public static getRPGGameMonster(): string {
        return this.RPGGame_Monster;
    }
    public static getRPGGameMount(): string {
        return this.RPGGame_Mount;
    }
    public static getRPGGameNpc(): string {
        return this.RPGGame_Npc;
    }
    public static getRPGGamePet(): string {
        return this.RPGGame_Pet;
    }
    public static getRPGGamePlayer(): string {
        return this.RPGGame_Player;
    }
    public static getRPGGameSkill(): string {
        return this.RPGGame_Skill;
    }
    public static getRPGGameSpirit(): string {
        return this.RPGGame_Spirit;
    }
    public static getRPGGameWeapon(): string {
        return this.RPGGame_Weapon;
    }
    public static getRPGGameWing(): string {
        return this.RPGGame_Wing;
    }
    public static getRPGGame_Title(): string {
        return this.RPGGame_Title;
    }
    public static getSound():string{
        return ResourcePathUtils.Sound;
    }
}