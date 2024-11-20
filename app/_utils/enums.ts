import { z } from "zod";

export type CERAMIC_SIZES = "60x60" | "40x40" | "30x30" | "30x60" | "skirting";
export type CERAMIC_TYPES = "polished" | "normal" | "digital";
export type CERAMIC_MANUFACTURERS = "Arerti" | "Dukem" | "China";

export const CeramicsSizesEnum = z.enum([
  "60x60",
  "40x40",
  "30x30",
  "30x60",
  "skirting",
]);
export const CeramicsTypesEnum = z.enum(["polished", "normal", "digital"]);
export const CeramicsManufacturersEnum = z.enum(["Arerti", "Dukem", "China"]);

export type CeramicSizes = z.infer<typeof CeramicsSizesEnum>;
export type CeramicTypes = z.infer<typeof CeramicsTypesEnum>;
export type CeramicsManufacturers = z.infer<typeof CeramicsManufacturersEnum>;
