
interface IVATCalculator {
    calculate(amount: number): number;
}

class VATCalculator implements VATCalculator {

    public calculate(amount: number): number {
        return 1.25 * amount;
    }
}

const vat:IVATCalculator = new VATCalculator();

console.log(vat.calculate(100));
console.log(vat.calculate(120));
