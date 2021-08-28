import { TwingEnvironment, TwingLoaderFilesystem } from 'twing';

import { Language } from './config';

const loader = new TwingLoaderFilesystem(`./templates/${Language}`);
const twing = new TwingEnvironment(loader);

export default twing;
