import FbxObjectLoader from "../../loader/object";


const zombie_loader = new FbxObjectLoader(
    "assets/entity/zombie/models/Base mesh fbx.fbx", 
    [
        ["./assets/entity/zombie/animation/zombie@atack1.fbx", "attack1"],
        ["./assets/entity/zombie/animation/zombie@atack2.fbx", "attack2"],
        ["./assets/entity/zombie/animation/zombie@atack3.fbx", "attack3"],
        ["./assets/entity/zombie/animation/zombie@atack4.fbx", "attack4"],
        ["./assets/entity/zombie/animation/zombie@death1.fbx", "death1"],
        ["./assets/entity/zombie/animation/zombie@death2.fbx", "death2"],
        ["./assets/entity/zombie/animation/zombie@gethit.fbx", "gethit"],
        ["./assets/entity/zombie/animation/zombie@idle1.fbx", "idle1"],
        ["./assets/entity/zombie/animation/zombie@idle2.fbx", "idle2"],
        ["./assets/entity/zombie/animation/zombie@roar.fbx", "roar"],
        ["./assets/entity/zombie/animation/zombie@walk.fbx", "walk"]
    ]
)

export default zombie_loader


