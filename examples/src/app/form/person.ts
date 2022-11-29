export class Person {
  constructor(
    public firstName: string,
    public lastName: string,
    public favoriteColor: string,
    public height?: number | null,
    public shoeSize = 42) {

  }
}
