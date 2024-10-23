import { randNearbyGPSCoordinate, randSequence, randStreetAddress, randSuperheroName, randWeekday } from "@ngneat/falso";
import { Playground } from "./model";

export type nullish = null | undefined;

export const getRandomPlayground = (): Playground => {
    const [lat, lng] = randNearbyGPSCoordinate();
    const superhero = randSuperheroName();
    return {
        id: randSequence(),
        name: `${superhero} Playground`,
        description: `The superhero ${superhero} entertains on ${randWeekday().toLocaleLowerCase()}s`,
        addressDescription: randStreetAddress(),
        position: { lat, lng },
    };
}