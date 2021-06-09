interface Engine {

  effect: number;
  torgue: number;
  cylinders: number;
}

class AMG178 implements Engine {
  effect: 503;
  torgue: 700;
  cylinders: 6;
}

class AMG139 implements Engine {
  effect: 422;
  torgue: 500;
  cylinders: 4;
}

class NonDICar {

  engine: Engine;

  constructor() {
    this.engine = new AMG139();
  }
}

const nonDICar = new NonDICar();

class DICar {

  constructor(public engine: Engine) {
    this.engine = new AMG139();
  }
}

const diCar = new DICar(new AMG178());