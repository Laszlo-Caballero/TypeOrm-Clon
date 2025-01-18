console.clear();
import "reflect-metadata";
import { Atribute, Hydration, PrimaryKey, Table } from "./TypeOrm/TypeOrm";

// Clase que utiliza el decorador
@Table()
class Tabla {
  @PrimaryKey()
  id: number;

  @Atribute()
  nombre: string;

  @Atribute()
  estado: boolean;

  @Atribute()
  edad: number;
}

// Prueba

async function main() {
  const tabla = new Tabla();

  const HydrationTabla = Hydration(tabla);

  const datos = await HydrationTabla.findAll();
  console.log(datos);
}

main();
