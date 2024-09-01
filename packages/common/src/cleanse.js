import {isNil, omitBy} from 'lodash-es'

export const cleanse = (object) => omitBy(object, isNil)
