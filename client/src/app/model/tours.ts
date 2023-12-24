import { Destination } from "./destiantion";
import { People } from "./people";

export class Tours {
    peoples: People[] = []
    destination: Destination = new Destination()
    date: string = ""
    image: Blob | null = null
}
