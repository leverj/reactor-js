import {Map} from 'immutable'
import {isArray, isMap, isObjectLike, mapKeys, mapValues} from 'lodash-es'

const isMappable = (_) => isArray(_) || isMap(_)
const asMappable = (_) => isMap(_) ? Array.from(_) : _ // => isArray
const disabled = (v) => { throw Error('this transformation is disabled') }
const identity = (v) => v

class DictionaryTransformer {
  constructor(definitions = []) {
    this.forward = Map().asMutable()
    this.backward = Map().asMutable()
    definitions.map(([term, translation]) => this.add(term, translation))
  }
  add(term, translation) {
    if (this.forward.has(term))
      throw Error(`already containing term: ${term}; must delete existing translation first`)
    if (this.backward.has(translation))
      throw Error(`already containing translation: ${translation} (for term: ${this.backward.get(translation)}; translations must be unique`)
    this.forward.set(term, translation)
    this.backward.set(translation, term)
  }
  reversed() { return new DictionaryTransformer(Array.from(this.backward.entries())) }
  map(term) { return this.forward.has(term) ? this.forward.get(term) : term }
  mapBack(term) { return this.backward.has(term) ? this.backward.get(term) : term }
}

class EnumTransformer {
  constructor(_enum_) { this._enum_ = _enum_ }
  map(term) { return this._enum_.hasValue(term) ? this._enum_.nameOf(term) : term }
  mapBack(term) { return this._enum_.hasName(term) ? this._enum_.valueOf(term) : term }
}

class FunctionalTransformer {
  constructor(forward, backward = disabled) {
    this.forward = forward
    this.backward = backward
  }
  map(...values) { return this.forward(...values) }
  mapBack(...values) { return this.backward(...values) }
}

class ComposingTransformer {
  constructor(chain) { this.chain = chain }
  map(term) { return this.chain.reduce((result, _) => _.map(result), term) }
  mapBack(term) { return this.chain.reduceRight((result, _) => _.mapBack(result), term)}
}

class KeysTransformer {
  constructor(transformer) { this.transformer = transformer }
  map(source) {
    if (!isObjectLike(source)) return source
    if (isMappable(source)) return asMappable(source).map(_ => this.map(_))
    // ... else isObjectLike && !isMappable
    const morphed = mapKeys(source, (_, key) => this.transformer.map(key))
    return mapValues(morphed, (value, _) =>
      isObjectLike(value) ?
        isMappable(value) ?
          asMappable(value).map(_ => this.map(_)) :
          this.map(value) :
        value
    )
  }
  mapBack(source) { disabled(source) }
}


class TypeTransformer {
  static of(type, properties, transform) { return new this().add(type, properties, transform) }

  constructor() { this.transforms = Map().asMutable() }
  add(type, properties, transform) {
    properties.forEach(_ => this.transforms.setIn([type, _], transform))
    return this
  }
  map(source, transformer = Identity) {
    const get = (type, key) => this.transforms.getIn([type, key],  Identity)
    const has = (type, key) => this.transforms.hasIn([type, key])
    if (!isObjectLike(source)) return transformer.map(source)
    if (isMappable(source)) return asMappable(source).map(_ => this.map(_, transformer))
    return mapValues(source, (value, key) => {
      const type = value ? value.constructor.name : undefined
      return isObjectLike(value) && !has(type, key) ?
        isMappable(value) ?
          asMappable(value).map(_ => this.map(_)) :
          this.map(value, get(type, key)) :
        get(type, key).map(value)
      }
    )
  }
  mapBack(source) { disabled(source) }
}

export const Dictionary = (...definitions) => new DictionaryTransformer(definitions)
export const Enumerate = (_enum_) => new EnumTransformer(_enum_)
export const Functional = (forward, backward) => new FunctionalTransformer(forward, backward)
export const Compose = (...transformers) => new ComposingTransformer(transformers)
export const Keys = (transformer) => new KeysTransformer(transformer)
export const Type = (type, properties, transform) => TypeTransformer.of(type, properties, transform)
export const Identity = Functional(identity, identity)
export const toJson = Functional(v => JSON.stringify(v))
export const fromJson = Functional(v => JSON.parse(v))
