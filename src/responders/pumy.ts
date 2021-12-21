import type { ResponderExecutionProps, ResponderManifest } from './module';

const callback = (props: ResponderExecutionProps): boolean => {
  if (props.message.content.search(/(\b|[^\w])pumy(\b|[^\w])/i) >= 0) {
    props.message.reply('> [...] pumy [...] \n\n co ma jaja z gumy? :D \n\n https://i.kym-cdn.com/photos/images/original/000/249/522/b80.jpg');
    return true;
  }

  return false;
};

const pumy: ResponderManifest = {
  execute: callback
};

export default pumy;
