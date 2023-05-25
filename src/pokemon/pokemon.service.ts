import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly PokemonModule: Model<Pokemon>,
  ) {}

  //CREATE POKEMON
  async create(createPokemonDto: CreatePokemonDto) {
    try {
      const pokemon = await this.PokemonModule.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  //GET ALL POKEMONS
  findAll() {
    return `This action returns all pokemon`;
  }

  //GET UN POKEMON
  async findOne(term: string) {
    let pokemon: Pokemon;
    //numero
    if (!isNaN(+term)) {
      pokemon = await this.PokemonModule.findOne({ no: term });
    } else {
      pokemon =
        (await this.PokemonModule.findOne({ name: term })) ??
        (await this.PokemonModule.findById(term));
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
