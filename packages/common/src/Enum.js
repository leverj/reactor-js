import {zip} from 'lodash-es'

/** a general purpose Enum a-la-java style */
export class Enum {
  static of(members) {
    const names  = Object.keys(members)
    const values = Object.values(members)
    return new this(members, names, values)
  }

  static ofValues(members) {
    const names  = Object.keys(members)
    const values = Object.values(members).map(_ => _.value)
    return new this(members, names, values)
  }

  constructor(members, names, values) {
    this.names  = names
    this.values = values
    Object.assign(this, members)
  }

  element(value) {return this[this.nameOf(value)]}
  hasValue(value) { return this.values.indexOf(value) >= 0 }
  hasName(name) { return this.names.indexOf(name) >= 0 }
  nameOf(value) { return this.names[this.values.indexOf(value)] }
  valueOf(name) { return this.values[this.names.indexOf(name)] }
  ordinalOf(value) { return this.values.indexOf(value) }
  toMap() { return new Map(zip(this.names, this.values)) }

  expandWith(members) {
    const [names, values]  = [Object.keys(members), Object.values(members)]
    for (let each in names) if (this.names.includes(each)) throw Error(`attempt to duplicate name ${each}`)
    for (let each in values) if (this.values.includes(each)) throw Error(`attempt to duplicate value ${each}`)
    const expanded = zip(this.names.concat(names), this.values.concat(values)).reduce((obj, [key, value]) => (obj[key] = value, obj), {})
    return Enum.of(expanded)
  }
}
