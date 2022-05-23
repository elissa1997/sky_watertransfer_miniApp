import { getEnv } from './env.js';
import dev from './dev.js';
import pro from './pro.js';

const env = getEnv();
console.log('env', env);

let config = pro;

if (env == 'dev') {
  config = dev;
}

export default config;