const SilverToGold = 100;
const CopperToGold = SilverToGold * SilverToGold;

export interface GoldAmount {
  gold: number;
  silver: number;
  copper: number;
}

export const calculateGoldAmount = (value: number): GoldAmount => {
  const gold = Math.floor(value / CopperToGold);
  const silver = Math.floor((value - (gold * CopperToGold)) / SilverToGold);
  const copper = value - (gold * CopperToGold) - (silver * SilverToGold);

  return {
    gold,
    silver,
    copper
  };
};
