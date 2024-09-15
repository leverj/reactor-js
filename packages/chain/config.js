import {configure} from '@leverj/config'
import {postLoad, schema} from './config.schema.js'

export default await configure(schema, postLoad)
