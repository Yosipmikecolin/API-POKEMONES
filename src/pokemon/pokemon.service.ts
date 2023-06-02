import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { Model } from 'mongoose';
import { PaginationDTO } from './dto/pagination.dto';

@Injectable()
export class PokemonService {
  private defaultLimit: number;
  constructor(
    @InjectModel(Pokemon.name)
    private readonly PokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = this.configService.get<number>('dafaultLimit');
  }

  //CREATE POKEMON
  async create(createPokemonDto: CreatePokemonDto) {
    try {
      const pokemon = await this.PokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  //GET ALL POKEMONS
  findAll(querys: PaginationDTO) {
    const { limit = this.defaultLimit, offset = 0 } = querys;
    return this.PokemonModel.find()
      .limit(limit)
      .skip(offset)
      .select('-__v')
      .sort({ no: 1 });
  }

  //GET UN POKEMON
  async findOne(term: string) {
    let pokemon: Pokemon;
    //numero
    if (!isNaN(+term)) {
      pokemon = await this.PokemonModel.findOne({ no: term });
    } else {
      pokemon =
        (await this.PokemonModel.findOne({ name: term })) ??
        (await this.PokemonModel.findById(term));
    }

    if (!pokemon) {
      throw new BadRequestException('The requested pokemon was not found');
    }

    return pokemon;
  }

  //UPDATED POKEMON
  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    if (pokemon.name) {
      try {
        await pokemon.updateOne(updatePokemonDto, { new: true });
        return { ...pokemon.toJSON(), ...updatePokemonDto };
      } catch (error) {
        this.handleExceptions(error);
      }
    }
  }

  //DELETE POKEMON
  async remove(id: string) {
    const pokemon = await this.findOne(id);
    await pokemon.deleteOne();
    return pokemon;
  }

  //FUNCTIONS
  public handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon exist in db: ${JSON.stringify(error.keyValue)}`,
      );
    } else {
      console.log(error);
      throw new InternalServerErrorException(
        "Couldn't updated pokemon - check console",
      );
    }
  }
}
