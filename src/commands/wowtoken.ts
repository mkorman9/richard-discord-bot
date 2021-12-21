import { sendReply } from './utils';
import { getWowTokenPrice } from '../battlenet/api';
import type { CommandExecutionProps, CommandManifest } from './module';

const callback = async (props: CommandExecutionProps) => {
  try {
    const priceInfo = await getWowTokenPrice();
    sendReply(props.event.message, 'wowtoken/price.twig', {
      price: { gold: priceInfo.price.gold, updated: priceInfo.lastUpdated }
    });
  } catch (err) {
  }
};

const wowtoken: CommandManifest = {
  execute: callback
};

export default wowtoken;
