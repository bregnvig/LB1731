import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { Playground } from "src/app/shared";

const aarhusPlaygrounds = [
  {
    "id": "legeplads.1",
    "name": "Havrebakkens Legeplads 3",
    "description": "Mellemstore legepladser (10 til 25 børn)",
    "position": {
      "lng": 10.202671,
      "lat": 56.182933
    }
  },
  {
    "id": "legeplads.2",
    "name": "Legepladsen på Lillehammervej 3",
    "description": "Mellemstore legepladser (10 til 25 børn)",
    "position": {
      "lng": 10.194065,
      "lat": 56.17789
    }
  },
  {
    "id": "legeplads.3",
    "name": "Åkrogens Legeplads 3",
    "description": "Mellemstore legepladser (10 til 25 børn)",
    "position": {
      "lng": 10.2823,
      "lat": 56.203013
    }
  },
  {
    "id": "legeplads.4",
    "name": "Lisbjerg Legeplads 4",
    "description": "Små legepladser (ca. 10 børn)",
    "position": {
      "lng": 10.165294,
      "lat": 56.221957
    }
  },
  {
    "id": "legeplads.5",
    "name": "Legepladsen: Indelukket",
    "description": "Mellemstore legepladser (10 til 25 børn)",
    "position": {
      "lng": 10.236919,
      "lat": 56.243779
    }
  },
  {
    "id": "legeplads.6",
    "name": "Frederiksbjerg Byparks Legeplads 2",
    "description": "Store legepladser (over 25 børn)",
    "position": {
      "lng": 10.189365,
      "lat": 56.147318
    }
  },
  {
    "id": "legeplads.7",
    "name": "Kirkedammens legeplads 3",
    "description": "Mellemstore legepladser (10 til 25 børn)",
    "position": {
      "lng": 10.17877,
      "lat": 56.140351
    }
  },
  {
    "id": "legeplads.8",
    "name": "Botanisk Haves legeplads 1",
    "description": "Udflugtslegepladser",
    "position": {
      "lng": 10.193471,
      "lat": 56.158299
    }
  },
  {
    "id": "legeplads.9",
    "name": "Legepladsen 'Steen Bille'",
    "description": "Store legepladser (over 25 børn)",
    "position": {
      "lng": 10.214595,
      "lat": 56.173494
    }
  },
  {
    "id": "legeplads.10",
    "name": "Mindeparkens Legeplads 1",
    "description": "Udflugtslegepladser",
    "position": {
      "lng": 10.20393,
      "lat": 56.129701
    }
  },
  {
    "id": "legeplads.11",
    "name": "Legepladsen på Tranbjerg Hovedgade 3",
    "description": "Mellemstore legepladser (10 til 25 børn)",
    "position": {
      "lng": 10.1354,
      "lat": 56.093657
    }
  },
  {
    "id": "legeplads.12",
    "name": "Bækvejsparkens Legeplads 3",
    "description": "Mellemstore legepladser (10 til 25 børn)",
    "position": {
      "lng": 10.191484,
      "lat": 56.033114
    }
  },
  {
    "id": "legeplads.13",
    "name": "Legepladsen 'Skovly'",
    "description": "Mellemstore legepladser (10 til 25 børn)",
    "position": {
      "lng": 10.20143,
      "lat": 56.063835
    }
  },
  {
    "id": "legeplads.14",
    "name": "Kærgårdsparkens Legeplads 3",
    "description": "Mellemstore legepladser (10 til 25 børn)",
    "position": {
      "lng": 10.089497,
      "lat": 56.038766
    }
  },
  {
    "id": "legeplads.15",
    "name": "Klokkerparkens Legeplads 2",
    "description": "Store legepladser (over 25 børn)",
    "position": {
      "lng": 10.157051,
      "lat": 56.161486
    }
  },
  {
    "id": "legeplads.16",
    "name": "Legepladsen på Baunevej 4",
    "description": "Små legepladser (ca. 10 børn)",
    "position": {
      "lng": 10.096877,
      "lat": 56.107378
    }
  },
  {
    "id": "legeplads.17",
    "name": "Kolt Parks Legeplads 3",
    "description": "Mellemstore legepladser (10 til 25 børn)",
    "position": {
      "lng": 10.074745,
      "lat": 56.110687
    }
  },
  {
    "id": "legeplads.18",
    "name": "Søparkens Legeplads 3",
    "description": "Mellemstore legepladser (10 til 25 børn)",
    "position": {
      "lng": 10.106169,
      "lat": 56.151117
    }
  },
  {
    "id": "legeplads.19",
    "name": "Legepladsen på Skaarups Alle 4",
    "description": "Små legepladser (ca. 10 børn)",
    "position": {
      "lng": 10.114934,
      "lat": 56.187769
    }
  },
  {
    "id": "legeplads.20",
    "name": "Kasted Legeplads 4",
    "description": "Små legepladser (ca. 10 børn)",
    "position": {
      "lng": 10.129597,
      "lat": 56.20792
    }
  },
  {
    "id": "legeplads.21",
    "name": "Harlev Byparks Legeplads 3",
    "description": "Mellemstore legepladser (10 til 25 børn)",
    "position": {
      "lng": 9.992165,
      "lat": 56.144787
    }
  },
  {
    "id": "legeplads.22",
    "name": "Legepladsen på Falkevej 3",
    "description": "Mellemstore legepladser (10 til 25 børn)",
    "position": {
      "lng": 10.179699,
      "lat": 56.168533
    }
  },
  {
    "id": "legeplads.23",
    "name": "Legepladsen ved Beringsminde 3",
    "description": "Mellemstore legepladser (10 til 25 børn)",
    "position": {
      "lng": 10.121334,
      "lat": 56.160496
    }
  },
  {
    "id": "legeplads.24",
    "name": "Legepladsen 'Hullet (Skejby) 4'",
    "description": "Små legepladser (ca. 10 børn)",
    "position": {
      "lng": 10.178756,
      "lat": 56.200355
    }
  },
  {
    "id": "legeplads.25",
    "name": "Legepladsen på Hunderosevej 4",
    "description": "Små legepladser (ca. 10 børn)",
    "position": {
      "lng": 10.306178,
      "lat": 56.267975
    }
  },
  {
    "id": "legeplads.26",
    "name": "Præstevangens Legeplads 3",
    "description": "Mellemstore legepladser (10 til 25 børn)",
    "position": {
      "lng": 10.168206,
      "lat": 56.163991
    }
  },
  {
    "id": "legeplads.27",
    "name": "Legepladsen 'Bellevue'",
    "description": "Mellemstore legepladser (10 til 25 børn)",
    "position": {
      "lng": 10.247466,
      "lat": 56.191244
    }
  },
  {
    "id": "legeplads.28",
    "name": "Forteparkens Legeplads 3",
    "description": "Mellemstore legepladser (10 til 25 børn)",
    "position": {
      "lng": 10.229691,
      "lat": 56.195473
    }
  },
  {
    "id": "legeplads.29",
    "name": "Vorrevangsparkens Legeplads 3",
    "description": "Mellemstore legepladser (10 til 25 børn)",
    "position": {
      "lng": 10.201189,
      "lat": 56.185695
    }
  },
  {
    "id": "legeplads.30",
    "name": "Legepladsen 'Tietgens Plads'",
    "description": "Mellemstore legepladser (10 til 25 børn)",
    "position": {
      "lng": 10.203031,
      "lat": 56.144483
    }
  },
  {
    "id": "legeplads.31",
    "name": "Marienlyst Naturlegeplads 2",
    "description": "Store legepladser (over 25 børn)",
    "position": {
      "lng": 10.160817,
      "lat": 56.18004
    }
  },
  {
    "id": "legeplads.32",
    "name": "Tilst Byparks Legeplads 3",
    "description": "Mellemstore legepladser (10 til 25 børn)",
    "position": {
      "lng": 10.099955,
      "lat": 56.190739
    }
  },
  {
    "id": "legeplads.33",
    "name": "Øby Parks Legeplads 2",
    "description": "Store legepladser (over 25 børn)",
    "position": {
      "lng": 10.165752,
      "lat": 56.15316
    }
  },
  {
    "id": "legeplads.34",
    "name": "Skoleparkens Legeplads 4",
    "description": "Små legepladser (ca. 10 børn)",
    "position": {
      "lng": 10.231047,
      "lat": 56.191834
    }
  },
  {
    "id": "legeplads.35",
    "name": "Ølsted Legeplads 4",
    "description": "Små legepladser (ca. 10 børn)",
    "position": {
      "lng": 10.136307,
      "lat": 56.233039
    }
  },
  {
    "id": "legeplads.36",
    "name": "Ekkodalen",
    "position": {
      "lng": 10.180933,
      "lat": 56.17265
    }
  },
  {
    "id": "legeplads.37",
    "name": "Legepladsen AH. Winges Vej",
    "position": {
      "lng": 10.204201,
      "lat": 56.175466
    }
  },
  {
    "id": "legeplads.38",
    "name": "Højvangsvej, Stautrup",
    "position": {
      "lng": 10.121945,
      "lat": 56.129923
    }
  },
  {
    "id": "legeplads.39",
    "name": "Ørneredens legeplads",
    "position": {
      "lng": 10.236652,
      "lat": 56.100977
    }
  },
  {
    "id": "legeplads.40",
    "name": "Legepladsen Holme Bypark",
    "position": {
      "lng": 10.180304,
      "lat": 56.110161
    }
  },
  {
    "id": "legeplads.41",
    "name": "Skjoldhøjkilen",
    "position": {
      "lng": 10.125356,
      "lat": 56.170021
    }
  },
  {
    "id": "legeplads.42",
    "name": "Legepladsen Værkjørpark",
    "position": {
      "lng": 10.147261,
      "lat": 56.125666
    }
  },
  {
    "id": "legeplads.43",
    "name": "Motionsruten i Gellerup Skov",
    "position": {
      "lng": 10.143299,
      "lat": 56.153237
    }
  },
  {
    "id": "legeplads.44",
    "name": "Stenalderlegeplads - Egæ Engsø",
    "position": {
      "lng": 10.220287,
      "lat": 56.213607
    }
  },
  {
    "id": "legeplads.45",
    "name": "Legepladsen i Byvangen",
    "position": {
      "lng": 10.16977,
      "lat": 56.130417
    }
  },
  {
    "id": "legeplads.46",
    "name": "Legeredskaberne i Mollerup Skov",
    "position": {
      "lng": 10.202514,
      "lat": 56.20603
    }
  }
];

@Injectable({
  providedIn: 'root'
})
export class AarhusPlaygroundService {
  playgrounds$ = of(aarhusPlaygrounds);

  constructor() {
    console.log('The AarhusPlaygroundService was just created');
  }

  getById(id: string): Observable<Playground | undefined> {
    return this.playgrounds$.pipe(
      map(playgrounds => playgrounds.find(p => p.id === id))
    );
  }

}