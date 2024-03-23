import FbxObjectLoader from "../../loader/object";


const zombie_loader = new FbxObjectLoader(
    "assets/entity/zombie/models/Base mesh fbx.fbx", 
    [
        {path: "./assets/entity/zombie/animation/zombie@atack1.fbx", name: "attack1"},
        {path: "./assets/entity/zombie/animation/zombie@atack2.fbx", name: "attack2"},
        {path: "./assets/entity/zombie/animation/zombie@atack3.fbx", name: "attack3"},
        {path: "./assets/entity/zombie/animation/zombie@atack4.fbx", name: "attack4"},
        {path: "./assets/entity/zombie/animation/zombie@death1.fbx", name: "death1"},
        {path: "./assets/entity/zombie/animation/zombie@death2.fbx", name: "death2"},
        {path: "./assets/entity/zombie/animation/zombie@gethit.fbx", name: "gethit"},
        {path: "./assets/entity/zombie/animation/zombie@idle1.fbx", name: "idle1"},
        {path: "./assets/entity/zombie/animation/zombie@idle2.fbx", name: "idle2"},
        {path: "./assets/entity/zombie/animation/zombie@roar.fbx", name: "roar"},
        {path: "./assets/entity/zombie/animation/zombie@walk.fbx", name: "walk"}
    ]
)

export default zombie_loader


