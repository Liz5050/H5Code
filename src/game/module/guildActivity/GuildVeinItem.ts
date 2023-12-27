/**
 * 心法项
 */
class GuildVeinItem extends ListRenderer {

    private _type: EGuildVeinType;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
    }

    public setData(data: any, index: number): void {
        this._data = data;
    }

    public get type(): EGuildVeinType {
        return this._type;
    }

    public set type(value: EGuildVeinType) {
        this._type = value;
    }


}