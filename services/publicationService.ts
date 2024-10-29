import { baseData } from '../utils/api';
import { Publication, filterPublication, newPublication } from '../models/Publication';

export class PublicationService {
    
    static async getPublications(data:filterPublication, token:string): Promise<Publication[]> {
        const options: RequestInit = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(data)
        };
    
        return baseData('/publications/filter', options);
    }

    static async createPublication(data:newPublication, token:string): Promise<Publication> {
        const options: RequestInit = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(data)
        }
    
        return baseData('/publications', options);
    }

}