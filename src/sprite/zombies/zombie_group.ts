import Zombie from './zombie';
import { randInt } from 'three/src/math/MathUtils';


export class ZombieGroup 
{
    number_of_entities: number = 10;
    all_zombies: Array<Zombie> = [];
    is_create = false;

    /**
     * This function is used to create an instances
     */
    create()
    {

        for (let i = 0; i < this.number_of_entities; i++) 
        {
            const scale: number = randInt(13, 15) / 1000;
            const type = randInt(1, 2);
            const position: [number, number, number] = [randInt(-12, 8), 2, randInt(-1, 16)];

            if (type === 1 || type === 2)
            {
                const zombie = new Zombie(
                    {
                        zombie_type: type,
                        zombie_position: position,
                        zombie_scale: [
                            scale, 
                            scale, 
                            scale
                        ]
                    }
                );

                zombie.setup_mesh();
                this.all_zombies.push(zombie);
            }
        }

        this.is_create = true;
    }

    /**
    //  * This function is used to update instances mesh
     */
    update()
    {
        if (this.is_create)
        {
            for (const zombie of this.all_zombies)
            {
                zombie.update();
            }
        }
    }
}
