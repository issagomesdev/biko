import { baseData } from '../utils/api';
import { Publication, filterPublication, newPublication } from '../models/Publication';

export class PublicationService {
    
    static async getPublications(data:filterPublication, token:string|undefined): Promise<Publication[]> {
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

    static async getPublication(id:any, token:string|undefined): Promise<Publication> {
      const options: RequestInit = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };
  
      return baseData(`/publications/${id}`, options);
  }

    static async createPublication(data:newPublication, token:string|undefined): Promise<Publication> {
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

    static async deletePublication(publication:number, token:string|undefined): Promise<any>{
      const options: RequestInit = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
  
      return baseData(`/publications/${publication}`, options);
    }

    static async likePublication(publication:number, token:string|undefined): Promise<Publication> {
        const options: RequestInit = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
    
        return baseData(`/publications/like/${publication}`, options);
    }

    static async commentPublication(publication:number, comment:string, token:string|undefined): Promise<Publication> {
        const options: RequestInit = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({comment})
        }
    
        return baseData(`/publications/comment/${publication}`, options);
    }


}