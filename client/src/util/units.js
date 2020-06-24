const UNITS = []

export class Unit {
    static find(unit) {
        unit = unit.toString()
        return UNITS.find(u => u.abbr === unit || u.singular === unit || u.plural === unit)
    }

    static exists(unit) {
        return Boolean(Unit.find(unit))
    }

    static list(measure) {
        if (!measure || measure === '') return [ ...UNITS ]
        measure = measure.toString().toLowerCase().trim()
        switch (measure) {
            case 'metric':
                return UNITS.filter(u => u.system === 'metric' || u.system === '')
            case 'imperial':
                return UNITS.filter(u => u.system === 'imperial' || u.system === '')
            case 'us':
                return UNITS.filter(u => u.system === 'us' || u.system === '')
            case 'volume':
                return UNITS.filter(u => u.measure === 'volume')
            case 'mass':
            case 'weight':
                return UNITS.filter(u => u.measure === 'mass')
            case 'amount':
                return UNITS.filter(u => u.measure === 'amount')
            default:
                return []
        }
    }

    constructor(measure, system, abbr, singular, plural, toBase, fromBase) {
        this.measure = measure
        this.system = system
        this.abbr = abbr
        this.singular = singular
        this.plural = plural
        this.toBase = toBase
        this.fromBase = fromBase

        this.amount = undefined

        UNITS.push(this)
    }

    to(unit) {
        if (!(typeof unit === 'object' && unit !== null)) unit = Unit.find(unit)
        return new Unit(unit, unit.fromBase(this.toBase(this.amount || 0)))
    }
}

UNITS.push(new Unit('mass', 'metric', 'g', 'gram', 'grams', x => x / 28.35, x => x * 28.35))
UNITS.push(new Unit('mass', 'imperial', 'oz', 'ounce', 'ounces', x => x, x => x))
UNITS.push(new Unit('mass', 'imperial', 'lb', 'pound', 'pounds', x => x / 16.0, x => x * 16.0))
UNITS.push(new Unit('volume', 'metric', 'ml', 'milliliter', 'milliliters', x => x / 29.574, x => x * 29.527))
UNITS.push(new Unit('volume', 'metric', 'l', 'liter', 'liters', x => x * 33.814, x => x / 33.814))
UNITS.push(new Unit('volume', 'us', 'tsp', 'teaspoon', 'teaspoons', x => x / 6.0, x => x * 6.0))
UNITS.push(new Unit('volume', 'us', 'Tbs', 'tablespoon', 'tablespoons', x => x / 2.0, x => x * 2.0))
UNITS.push(new Unit('volume', 'us', 'fl-oz', 'fluid ounce', 'fluid ounces', x => x, x => x))
UNITS.push(new Unit('volume', 'us', 'c', 'cup', 'cups', x => x * 8.115, x => x / 8.115))
UNITS.push(new Unit('volume', 'us', 'pt', 'pint', 'pints', x => x * 16.0, x => x / 16.0))
UNITS.push(new Unit('volume', 'us', 'qt', 'quart', 'quarts', x => x * 32.0, x => x / 32.0))
UNITS.push(new Unit('volume', 'us', 'gal', 'gallon', 'gallons', x => x * 128.0, x => x / 128.0))
UNITS.push(new Unit('amount', '', '', 'count', 'count', x => x, x => x))
UNITS.push(new Unit('amount', '', 'dzn', 'dozen', 'dozen', x => x / 12, x => x * 12))
