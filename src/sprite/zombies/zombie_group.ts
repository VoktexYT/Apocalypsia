import Zombie from './zombie';
import { randInt } from 'three/src/math/MathUtils';
import * as instances from '../../game/instances';


export class ZombieGroup 
{
    number_of_entities: number = 1;

    all_zombies: Array<{id: number, object: Zombie}> = [];
    is_create = false;

    next_level = false;

    max_id = 999_999_999;
    min_id = 100_000_000;

    generate_id()
    {
        return Math.floor(Math.random() * (this.max_id - this.min_id + 1)) + this.min_id;
    }

    remove_zombie_from_id(id: number)
    {
        let idx = 0;

        for (let zombie of this.all_zombies)
        {
            if (zombie.id === id)
            {
                this.all_zombies.splice(idx, 1);
                break;
            }

            idx++;
        }
    }

    /**
     * This function is used to create an instances
     */
    create()
    {
        let difficult = instances.level_counter.level_count;

        if (difficult === 0)
        {
            difficult++;
        }

        this.number_of_entities = difficult;

        for (let i = 0; i < this.number_of_entities; i++) 
        {
            const scale: number = randInt(13, 15) / 1000;
            const type = randInt(1, 2);
            const position: [number, number, number] = [randInt(-12, 8), 2, randInt(-1, 16)];

            if (type === 1 || type === 2)
            {
                const ID = this.generate_id();

                const zombie = new Zombie(
                    {
                        zombie_type: type,
                        zombie_position: position,
                        zombie_scale: [
                            scale, 
                            scale, 
                            scale
                        ],
                        zombie_id: ID
                    }
                );

                zombie.setup_mesh();

                this.all_zombies.push({
                    object: zombie,
                    id: ID
                });
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
                zombie.object.update();
            }

            if (this.all_zombies.length === 0 && this.number_of_entities !== 0)
            {
                instances.level_counter.update_level();
                this.create();
            }

            console.log(this.all_zombies.length);
        }
    }
}
