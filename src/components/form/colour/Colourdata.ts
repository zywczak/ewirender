// colourData.ts
import OPTION_IDS from "./optionIds";

export type ColourDefinition = {
  id: number;
  option_value: string;
  json_value: string;
  image: string;
};

export const BRICK_SLIPS_COLOURS: ColourDefinition[] = [
  { id: OPTION_IDS.COLOURS.SAHARA, option_value: "Sahara", json_value: "sahara", image: "/src/assets/sahara.png" },
  { id: OPTION_IDS.COLOURS.BLACKPOOL, option_value: "Blackpool", json_value: "blackpool", image: "/src/assets/blackpool.png" },
  { id: OPTION_IDS.COLOURS.COLORADO, option_value: "Colorado", json_value: "colorado", image: "/src/assets/colorado.png" },
  { id: OPTION_IDS.COLOURS.CORDOBA, option_value: "Cordoba", json_value: "cordoba", image: "/src/assets/cordoba.png" },
  { id: OPTION_IDS.COLOURS.CORSICA, option_value: "Corsica", json_value: "corsica", image: "/src/assets/corsica.png" },
  { id: OPTION_IDS.COLOURS.NEBRASKA, option_value: "Nebraska", json_value: "nebraska", image: "/src/assets/nebraska.png" },
  { id: OPTION_IDS.COLOURS.MALTA, option_value: "Malta", json_value: "malta", image: "/src/assets/malta.png" },
  { id: OPTION_IDS.COLOURS.ALASKA, option_value: "Alaska", json_value: "alaska", image: "/src/assets/alaska.png" },
  { id: OPTION_IDS.COLOURS.GLASGOW, option_value: "Glasgow", json_value: "glasgow", image: "/src/assets/glasgow.png" },
];

export const RENDER_COLOURS: ColourDefinition[] = [
  { id: OPTION_IDS.COLOURS.COLOR_10001, option_value: "Brilliant White", json_value: "10001-Brilliant_White", image: "/src/assets/colors/10001-Brilliant_White.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_20001_PURE_WHITE, option_value: "Pure White", json_value: "20001-Pure_White", image: "/src/assets/colors/20001-Pure_White.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_20001, option_value: "20001", json_value: "20001", image: "/src/assets/colors/20001.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_20168, option_value: "Paraffin", json_value: "20168-Paraffin", image: "/src/assets/colors/20168-Paraffin.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_21189, option_value: "Peach", json_value: "21189-Peach", image: "/src/assets/colors/21189-Peach.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_22219, option_value: "Peony", json_value: "22219-Peony", image: "/src/assets/colors/22219-Peony.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_22440, option_value: "Rose", json_value: "22440-Rose", image: "/src/assets/colors/22440-Rose.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_22594, option_value: "Coral", json_value: "22594-Coral", image: "/src/assets/colors/22594-Coral.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_23544, option_value: "Elderflower", json_value: "23544-Elderflower", image: "/src/assets/colors/23544-Elderflower.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_24194, option_value: "Mirror", json_value: "24194-Mirror", image: "/src/assets/colors/24194-Mirror.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_25070, option_value: "Sage", json_value: "25070-Sage", image: "/src/assets/colors/25070-Sage.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_25820, option_value: "Prosecco", json_value: "25820-Prosecco", image: "/src/assets/colors/25820-Prosecco.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_26470, option_value: "Silk", json_value: "26470-Silk", image: "/src/assets/colors/26470-Silk.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_27037, option_value: "Acorn", json_value: "27037-Acorn", image: "/src/assets/colors/27037-Acorn.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_27041, option_value: "Truffle", json_value: "27041-Truffle", image: "/src/assets/colors/27041-Truffle.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_27116, option_value: "Storm", json_value: "27116-Storm", image: "/src/assets/colors/27116-Storm.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_27120, option_value: "Silver", json_value: "27120-Silver", image: "/src/assets/colors/27120-Silver.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_27254, option_value: "Walnut", json_value: "27254-Walnut", image: "/src/assets/colors/27254-Walnut.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_27408, option_value: "Steel", json_value: "27408-Steel", image: "/src/assets/colors/27408-Steel.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_27412, option_value: "Ash", json_value: "27412-Ash", image: "/src/assets/colors/27412-Ash.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_27416, option_value: "Smoke", json_value: "27416-Smoke", image: "/src/assets/colors/27416-Smoke.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_27420, option_value: "Diamond", json_value: "27420-Diamond", image: "/src/assets/colors/27420-Diamond.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_27491, option_value: "Concrete", json_value: "27491-Concrete", image: "/src/assets/colors/27491-Concrete.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_27495, option_value: "Fog", json_value: "27495-Fog", image: "/src/assets/colors/27495-Fog.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_27554, option_value: "Lead", json_value: "27554-Lead", image: "/src/assets/colors/27554-Lead.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_27566, option_value: "Cloud", json_value: "27566-Cloud", image: "/src/assets/colors/27566-Cloud.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_28010, option_value: "Porcelain", json_value: "28010-Porcelain", image: "/src/assets/colors/28010-Porcelain.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_28012, option_value: "Bone", json_value: "28012-Bone", image: "/src/assets/colors/28012-Bone.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_28014, option_value: "Haze", json_value: "28014-Haze", image: "/src/assets/colors/28014-Haze.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_28018, option_value: "Ivory", json_value: "28018-Ivory", image: "/src/assets/colors/28018-Ivory.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_28028, option_value: "Eggshell", json_value: "28028-Eggshell", image: "/src/assets/colors/28028-Eggshell.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_28030, option_value: "Almond", json_value: "28030-Almond", image: "/src/assets/colors/28030-Almond.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_28036, option_value: "Magnolia", json_value: "28036-Magnolia", image: "/src/assets/colors/28036-Magnolia.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_28038, option_value: "Mist", json_value: "28038-Mist", image: "/src/assets/colors/28038-Mist.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_28048, option_value: "Linen", json_value: "28048-Linen", image: "/src/assets/colors/28048-Linen.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_28050, option_value: "Frost", json_value: "28050-Frost", image: "/src/assets/colors/28050-Frost.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_28056, option_value: "Opal", json_value: "28056-Opal", image: "/src/assets/colors/28056-Opal.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_28058, option_value: "Ice", json_value: "28058-Ice", image: "/src/assets/colors/28058-Ice.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_28070, option_value: "Sandstone", json_value: "28070-Sandstone", image: "/src/assets/colors/28070-Sandstone.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_28076, option_value: "Antique White", json_value: "28076-Antique_White", image: "/src/assets/colors/28076-Antique_White.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_28078, option_value: "Copenhagen", json_value: "28078-Copenhagen", image: "/src/assets/colors/28078-Copenhagen.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_28080, option_value: "Platinum", json_value: "28080-Platinum", image: "/src/assets/colors/28080-Platinum.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_28088, option_value: "Orchid", json_value: "28088-Orchid", image: "/src/assets/colors/28088-Orchid.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_29050, option_value: "Seashell", json_value: "29050-Seashell", image: "/src/assets/colors/29050-Seashell.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_29315, option_value: "Dune", json_value: "29315-Dune", image: "/src/assets/colors/29315-Dune.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_29710, option_value: "HailStone", json_value: "29710-HailStone", image: "/src/assets/colors/29710-HailStone.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_29740, option_value: "Anthracite", json_value: "29740-Anthracite", image: "/src/assets/colors/29740-Anthracite.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_27570, option_value: "Clay", json_value: "27570-Clay", image: "/src/assets/colors/27570-Clay.jpg" },
  { id: OPTION_IDS.COLOURS.COLOR_29755, option_value: "Slate", json_value: "29755-Slate", image: "/src/assets/colors/29755-Slate.jpg" },
];