type POSITIVE_NUMBER = number extends infer N ? N extends number ? N extends 0 ? never : N : never : never;
type NEGATIVE_NUMBER = number extends infer N ? N extends number ? N extends 0 | (0 | number) ? never : N : never : never;

type ONE_OR_TWO = 1 | 2;

export {
    POSITIVE_NUMBER,
    NEGATIVE_NUMBER,

    ONE_OR_TWO
}
