import { IsString, IsNotEmpty, IsNumber, IsOptional, IsIn } from 'class-validator';
export class CreateProductoDto {
      @IsString()
      @IsNotEmpty()
      nombre: string;
    
      @IsString()
      @IsOptional()
      categoria: string;
      
      @IsString()
      @IsNotEmpty()
      marca: string;

      @IsNumber()
      @IsNotEmpty()
      precio: number;
    
      @IsNumber()
      @IsNotEmpty()
      stock: number;
    
     
      @IsString()
      @IsOptional()
      @IsIn(["Alto", "Medio", "Bajo"])
      estado?: string;
}
