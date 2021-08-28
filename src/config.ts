import fs from 'fs';
import YAML from 'yaml';

const ConfigLocation = './config.yml';

const readConfig = () => {
  try {
    const configContent = fs.readFileSync(ConfigLocation, 'utf8');
    return YAML.parse(configContent);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const config = readConfig();

export const Token = config['token'];
export const Timezone = config['timezone'] || 'UTC';
export const Language = config['language'] || 'pl';

const databaseConfig = config['database'] || {};
export const DatabaseDirectory = databaseConfig['directory'] || './.db';

const rolesConfig = config['roles'] || {};
export const PrivilegedRoles = new Set(rolesConfig['privileged'] || []);

const channelsConfig = config['channels'] || {};
export const MonitoredChannels = new Set(channelsConfig['monitored'] || []);
export const AnnouncementsChannel = channelsConfig['announcements'];
