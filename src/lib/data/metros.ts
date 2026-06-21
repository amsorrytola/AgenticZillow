import type { Metro } from "@/lib/domain/types";

export interface MetroSeed extends Metro {
  /** median sale price anchor + variance fraction */
  priceBase: number;
  priceVar: number;
  /** median monthly rent anchor */
  rentBase: number;
  streets: string[];
  zips: string[];
  /** +/- degrees jitter around center for synthetic coordinates */
  spread: number;
}

export const METROS: MetroSeed[] = [
  {
    id: "austin-tx",
    city: "Austin",
    state: "TX",
    lat: 30.2672,
    lng: -97.7431,
    zoom: 11.2,
    spread: 0.085,
    priceBase: 560000,
    priceVar: 0.45,
    rentBase: 2200,
    neighborhoods: ["Downtown", "East Austin", "Hyde Park", "Travis Heights", "Mueller", "Zilker", "Clarksville", "Barton Hills", "Crestview", "South Congress"],
    streets: ["Pearl St", "Maple Ave", "Bluebonnet Ln", "Lavaca St", "Avenue G", "W 9th St", "Congress Ave", "Manor Rd", "Cesar Chavez St", "Guadalupe St", "Rio Grande St", "Bouldin Ave"],
    zips: ["78701", "78702", "78703", "78704", "78705", "78745", "78751", "78756"],
  },
  {
    id: "seattle-wa",
    city: "Seattle",
    state: "WA",
    lat: 47.6062,
    lng: -122.3321,
    zoom: 11.2,
    spread: 0.09,
    priceBase: 790000,
    priceVar: 0.5,
    rentBase: 2600,
    neighborhoods: ["Capitol Hill", "Ballard", "Fremont", "Queen Anne", "Greenwood", "Wallingford", "West Seattle", "Columbia City", "Beacon Hill", "Magnolia"],
    streets: ["Pine St", "Ballard Ave", "Fremont Ave N", "Queen Anne Ave N", "Greenwood Ave N", "45th St", "California Ave SW", "Rainier Ave S", "Beacon Ave S", "34th Ave W", "Madison St", "Boren Ave"],
    zips: ["98101", "98103", "98105", "98107", "98109", "98112", "98115", "98116", "98122", "98144"],
  },
  {
    id: "miami-fl",
    city: "Miami",
    state: "FL",
    lat: 25.7617,
    lng: -80.1918,
    zoom: 11,
    spread: 0.1,
    priceBase: 620000,
    priceVar: 0.7,
    rentBase: 2900,
    neighborhoods: ["Brickell", "Wynwood", "Coconut Grove", "Coral Gables", "Little Havana", "Edgewater", "Design District", "Downtown", "Midtown", "Key Biscayne"],
    streets: ["Brickell Ave", "NW 2nd Ave", "Grand Ave", "Coral Way", "SW 8th St", "Biscayne Blvd", "NE 1st Ave", "Collins Ave", "Ponce de Leon Blvd", "S Bayshore Dr", "NW 24th St", "Crandon Blvd"],
    zips: ["33125", "33127", "33129", "33131", "33132", "33133", "33134", "33137", "33139", "33149"],
  },
  {
    id: "denver-co",
    city: "Denver",
    state: "CO",
    lat: 39.7392,
    lng: -104.9903,
    zoom: 11,
    spread: 0.095,
    priceBase: 630000,
    priceVar: 0.5,
    rentBase: 2100,
    neighborhoods: ["LoHi", "RiNo", "Capitol Hill", "Wash Park", "Cherry Creek", "Five Points", "Berkeley", "Sloan's Lake", "Baker", "Highland"],
    streets: ["Tejon St", "Larimer St", "Pearl St", "Gaylord St", "1st Ave", "Welton St", "Tennyson St", "Sheridan Blvd", "S Broadway", "Zuni St", "Blake St", "17th Ave"],
    zips: ["80202", "80203", "80205", "80206", "80209", "80211", "80212", "80218", "80220", "80223"],
  },
  {
    id: "new-york-ny",
    city: "New York",
    state: "NY",
    lat: 40.7128,
    lng: -74.006,
    zoom: 11.5,
    spread: 0.07,
    priceBase: 1150000,
    priceVar: 0.85,
    rentBase: 4200,
    neighborhoods: ["West Village", "Williamsburg", "Park Slope", "Upper West Side", "Harlem", "Chelsea", "Astoria", "Long Island City", "Bushwick", "Tribeca"],
    streets: ["Bedford Ave", "W 4th St", "5th Ave", "Amsterdam Ave", "Lenox Ave", "W 23rd St", "31st Ave", "Vernon Blvd", "Wyckoff Ave", "Greenwich St", "Bleecker St", "Court St"],
    zips: ["10011", "10014", "10024", "10027", "11201", "11211", "11215", "11237", "11101", "11106"],
  },
];

export const METRO_BY_ID = Object.fromEntries(METROS.map((m) => [m.id, m]));
export const DEFAULT_METRO = METROS[0];
