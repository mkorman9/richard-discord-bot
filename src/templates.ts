import { TwingEnvironment, TwingLoaderFilesystem } from 'twing';

import { LANGUAGE } from './config';

const loader = new TwingLoaderFilesystem(`./templates/${LANGUAGE}`);
const twing = new TwingEnvironment(loader);

export default twing;
