// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Class, Brother } = initSchema(schema);

export {
  Class,
  Brother
};