export default class Entity {
    private _velocity: Number
    private _hp: Number
    private _name: String

    private _texturesPath: Array<String>
    private _baseMeshPath: String
    private _baseMeshAnimationPath: Array<String>

    constructor() {
        this._velocity = 0;
        this._hp = 0;
        this._name = "";
        this._texturesPath = [];
        this._baseMeshPath = "";
        this._baseMeshAnimationPath = [];
    }

    set_velocity(velocity: Number): this {
        this._velocity = velocity;
        return this;
    }

    set_health_point(hp: Number): this {
        this._hp = hp;
        return this;
    }
}


const zombie = new Entity();


