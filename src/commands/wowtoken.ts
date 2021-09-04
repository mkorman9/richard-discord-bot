import twig from '../templates';
import { getWowTokenPrice } from '../battlenet/api';
import type { CommandExecutionProps, CommandManifest } from './module';

const callback = (props: CommandExecutionProps) => {
  getWowTokenPrice()
    .then(priceInfo => {
      twig.render('wowtoken_price.twig', {
        price: { gold: priceInfo.price.gold, updated: priceInfo.lastUpdated }
      })
        .then(output => {
          props.message.reply(output);
        });
    })
    .catch(err => {});
};

const wowtoken: CommandManifest = {
  execute: callback
};

export default wowtoken;
