interface PlantTitleData {
  code: string;
  name?: string;
  city?: string;
  location?: string;
  abbreviation?: string;
  abbreviationCity?: string;
  abbreviationCountry?: string;
  country?: string;
}

export function getSingleSelectedPlantLabel(
  selectedPlants: string[],
  plantsData: PlantTitleData[]
): string | null {
  if (selectedPlants.length !== 1) return null;

  const code = selectedPlants[0];
  const plant = plantsData.find((p) => p.code === code);
  if (!plant) return code;

  const abbrevParts: string[] = [];
  if (plant.abbreviationCity) abbrevParts.push(plant.abbreviationCity);
  if (plant.abbreviationCountry) abbrevParts.push(plant.abbreviationCountry);

  const suffix =
    (abbrevParts.length > 0 && abbrevParts.join(", ")) ||
    plant.abbreviation ||
    plant.city ||
    plant.location ||
    plant.country ||
    plant.name ||
    "";

  return suffix ? `${code} ${suffix}` : code;
}

export function applySinglePlantTitle(
  title: string,
  singlePlantLabel: string | null
): string {
  if (!singlePlantLabel) return title;
  let nextTitle = title;
  nextTitle = nextTitle.replace(/ and [Pp]lant\b/g, ` in ${singlePlantLabel}`);
  nextTitle = nextTitle.replace(/\s*-\s*All Sites\b/g, ` - ${singlePlantLabel}`);
  nextTitle = nextTitle.replace(/\s*-\s*All Plants\b/g, ` - ${singlePlantLabel}`);
  return nextTitle;
}
