import { MapOptions, tileLayer, marker, icon, latLng } from "leaflet";
import { Coordinate } from "src/app/shared";

export const createOptions = (...coordinates: Coordinate[]): MapOptions => {
    return {
      layers: [
        tileLayer('http://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
        ...coordinates.map(coordinate => marker(coordinate, {
          icon: icon({
            iconUrl: 'assets/marker-icon.png',
            shadowUrl: 'assets/marker-shadow.png'
          })
        })),
      ],
      zoom: 17,
      center: latLng(coordinates[0]),
    };
  };
  