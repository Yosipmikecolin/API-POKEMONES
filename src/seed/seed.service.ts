import { Injectable } from '@nestjs/common';
import axios,{ AxiosInstance } from 'axios';
import { Pokemon } from './interfaces/pokemon.interface';
import { url } from 'inspector';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;

  async executeSeed() {
    const {data} = await this.axios.get<Pokemon>("https://pokeapi.co/api/v2/pokemon?limit=60");
     data.results.forEach(({name,url}) => {
      const segments = url.split("/");
      const no:number = + segments[segments.length - 2];

     console.log(name,no)
    })

  }
}
