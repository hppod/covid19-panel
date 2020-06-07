export interface Caso {
    city: string,
    city_ibge_code: string,
    confirmed: number,
    confirmed_per_100k_inhabitants: number,
    date: string,
    death_rate: number,
    deaths: number,
    estimated_population_2019: number,
    is_last: boolean,
    order_for_place: number,
    place_type: string,
    state: string
}