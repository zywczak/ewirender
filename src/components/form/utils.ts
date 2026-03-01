import OPTION_IDS from "./colour/optionIds";
import { STEP_OPTION_IMAGES } from "./HousePreview/imageMapping";

export const getHouseTypeFromOptions = (selectedOptions: number[]): number | null => {
  if (selectedOptions.includes(OPTION_IDS.HOUSE.DETACHED)) return OPTION_IDS.HOUSE.DETACHED;
  if (selectedOptions.includes(OPTION_IDS.HOUSE.SEMI_DETACHED)) return OPTION_IDS.HOUSE.SEMI_DETACHED;
  if (selectedOptions.includes(OPTION_IDS.HOUSE.TERRACED)) return OPTION_IDS.HOUSE.TERRACED;
  return null;
};

const pickBestMatch = <T extends { options: number[] }>(candidates: T[]): T =>
  candidates.reduce((prev, curr) => {
    if (curr.options.length !== prev.options.length) {
      return curr.options.length > prev.options.length ? curr : prev;
    }
    return Math.max(...curr.options) > Math.max(...prev.options) ? curr : prev;
  }, candidates[0]);

export const findBestMatchingImage = (selectedOptions: number[]): string | null => {
  const matched = STEP_OPTION_IMAGES.filter((img) =>
    img.options.every((optId) => selectedOptions.includes(optId))
  );

  if (matched.length === 0) return null;

  return pickBestMatch(matched).image_url;
};

export const findFileToSend = (selectedOptions: number[]): string | null => {
  const houseType = getHouseTypeFromOptions(selectedOptions);

  if (houseType === OPTION_IDS.HOUSE.DETACHED) return "/media/detacheddefault.jpg";

  if (houseType === OPTION_IDS.HOUSE.SEMI_DETACHED) return "/media/semidetacheddefault.jpg";

  if (houseType === OPTION_IDS.HOUSE.TERRACED) return "/media/terraceddefault.jpg";

  return null;
};