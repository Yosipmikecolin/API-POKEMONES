import { Module } from '@nestjs/common';
import {AxiosAdapter} from "./adapters/axios.dapater"

@Module({
    providers:[AxiosAdapter],
    exports:[AxiosAdapter]
})
export class CommonModule {}
