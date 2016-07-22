var VATCalculator = (function () {
    function VATCalculator() {
    }
    VATCalculator.prototype.calculate = function (amount) {
        return 1.25 * amount;
    };
    return VATCalculator;
}());
var vat = new VATCalculator();
console.log(vat.calculate(100));
console.log(vat.calculate(120));
