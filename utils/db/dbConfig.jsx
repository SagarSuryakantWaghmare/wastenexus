import {neon} from '@neondatabase/serverless';
import {drizzle} from 'drizzle-orm/neon-http';

import * as schema from './schema';
const sql = neon("postgresql://neondb_owner:npg_sRGwK26QIcMS@ep-wispy-rice-a127vh0i-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require", { disableWarningInBrowsers: true });

export const db=drizzle(sql,{schema});


