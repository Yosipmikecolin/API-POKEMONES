import { Document } from 'mongoose';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';

//EL ESQUEMA ES PARA DECIR QUE ES UN ESQUEMA DE BASE DE DATOS
@Schema()
export class Pokemon extends Document {
  @Prop({
    unique: true,
    index: true,
  })
  name: string;

  @Prop({
    unique: true,
    index: true,
  })
  no: number;
}

//SE EXPORTA ESTE ESUQEMA PARA DECIRLE A LA BASE DE DATOS QUE ESTA ES MI ESTRUCTURA QUE USARA PARA MANIPULAR LA DATA
export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
