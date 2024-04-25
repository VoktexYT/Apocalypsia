export default function randomChoice<T>(items: T[]) : T | undefined 
{
    if (items.length === 0) return undefined;

    const index = Math.floor(Math.random() * items.length);
    
    return items[index];
}
