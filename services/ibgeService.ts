import { State } from "../models/State";
import { City } from "../models/City";

export class IBGEService {
    static async getStates(): Promise<State[]> {
        try {
            const response = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados");
            if (!response.ok) {
              throw new Error("Erro ao buscar estados.");
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            return [];
        }
    }
  
    static async getCities(stateID:string): Promise<City[]> {
        try {
            const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateID}/municipios`);
            if (!response.ok) {
              throw new Error("Erro ao buscar cidades.");
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            return [];
        } 
    }
  }