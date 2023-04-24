import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();

const {
  POSTGRES_HOST: host,
  POSTGRES_PORT: port,
  POSTGRES_USER: username,
  POSTGRES_PASSWORD: password,
  POSTGRES_DB: database,
  NODE_ENV,
} = process.env;
const isTestEnv = NODE_ENV === 'test';

export const ormconfig: DataSourceOptions = {
  type: 'postgres',
  host,
  port: parseInt(port),
  username,
  password,
  database,
  synchronize: false,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/db/migrations/**/*{.ts,.js}'],
};

const AppDataSource = new DataSource(ormconfig);

if (!isTestEnv) {
  AppDataSource.initialize()
    .then(() => {
      console.log('Data Source has been initialized!');
    })
    .catch((err) => {
      console.error('Error during Data Source initialization', err);
    });
}

export default AppDataSource;
