import Zombie from "../sprite/zombie"
import * as setup from './setup'


export const zombie = new Zombie(
    setup.scene, 
    0.01, 
    100, 
    "zombie1",
    [0, 0, 0],
    [0.01, 0.01, 0.01]
)

