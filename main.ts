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

@Table()
class Persona {
  @PrimaryKey()
  id: number;

  @Atribute()
  nombre: string;

  @Atribute()
  apellidoMaterno: string;

  @Atribute()
  apellidoPaterno: string;

  @Atribute()
  edad: number;
}

// Prueba

async function main() {
  const tabla = new Tabla();

  const HydrationTabla = Hydration(tabla);

  const persona = new Persona();

  const HydrationPersona = Hydration(persona);

  const datos = await HydrationTabla.findAll();
  const findOne = await HydrationTabla.findOne({
    nombre: "Juan",
  });
  // const update = await HydrationTabla.updateBy(
  //   {
  //     nombre: "Lalo",
  //   },
  //   {
  //     id: 1,
  //   }
  // );

  // console.log(update.affectedRows);

  console.log(datos);
  console.log(findOne);
}

main();
