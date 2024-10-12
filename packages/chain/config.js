import {configure} from '@leverj/lever.config'
import {postLoad, schema} from './config.schema.js'

export default await configure(schema, postLoad)
