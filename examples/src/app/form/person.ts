export class Person {
  constructor(
    public firstName: string,
    public lastName: string,
    public favoriteColor: string,
    public height?: number,
    public shoeSize = 42) {

  }
}
