// @ts-check
import { initSchema } from "@aws-amplify/datastore";
import { schema } from "./schema";

const { Class, Brother } = initSchema(schema);

// @ts-ignore
export { Class, Brother };
