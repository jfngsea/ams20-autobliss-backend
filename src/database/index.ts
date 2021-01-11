import { TlsOptions } from 'tls';
import { ConnectionOptions } from 'typeorm';

const env = process.env.NODE_ENV || 'development';

const ssl: boolean | TlsOptions = env === 'production' ? { rejectUnauthorized: false } : false;

const dbConnection: ConnectionOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: ssl,
  synchronize: true,
  logging: false,
  entities: [env === 'production' ? 'build/entity/*{.ts,.js}' : 'src/entity/*{.ts,.js}'],
  migrations: [env === 'production' ? 'build/migration/*{.ts,.js}' : 'src/migration/*{.ts,.js}'],
  subscribers: [env === 'production' ? 'build/subscriber/*{.ts,.js}' : 'src/subscriber/*{.ts,.js}'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
};

export { dbConnection };
