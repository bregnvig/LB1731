export class Marker {

  constructor(
    public readonly name: string,
    public readonly latitude: number,
    public readonly longitude: number,
    public readonly message: string = '') { }

  get hasPosition(): boolean {
    return !!this.latitude && !!this.longitude;
  }
}