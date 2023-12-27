class RealmCache {
	private _level:number;
	public constructor() {
		this.level = 0;
	}

	public get level():number{
		return this._level;
	}

	public set level(value:number){
		this._level = value
	}

}