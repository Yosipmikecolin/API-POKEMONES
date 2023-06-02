import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { IPokemon } from './interfaces/pokemon.interface';
import { AxiosAdapter } from 'src/common/adapters/axios.dapater';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name) private readonly PokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) {}

  //VARIABLES
  //private readonly axios: AxiosInstance = axios;

  //METODOS
  async executeSeed() {
    await this.PokemonModel.deleteMany({});
    const arrayPromises = [];
    const data = await this.http.get<IPokemon>(
      'https://pokeapi.co/api/v2/pokemon?limit=600',
    );
    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];
      //await this.PokemonModel.create({ name, no });
      arrayPromises.push(this.PokemonModel.create({ name, no }));
    });

    await Promise.all(arrayPromises);
    return 'Database filled successfully';
  }
}
