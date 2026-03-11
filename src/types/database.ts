export interface City {
    city: string;
    country: string;
    slug: string;
    lat: number;
    lng: number;
    population: number;
    rent_index: number;
    food_index: number;
    transport_index: number;
    utilities_index: number;
    entertainment_index: number;
    cost_index: number;
    safety: number;
    healthcare: number;
    internet: number;
    environment: number;
    commute: number;
    leisure: number;
    outdoors: number;
}

export type Database = {
    public: {
        Tables: {
            cities_master: {
                Row: City;
                Insert: City;
                Update: Partial<City>;
            };
        };
    };
};
