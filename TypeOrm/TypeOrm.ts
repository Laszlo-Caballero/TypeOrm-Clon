import { getConection } from "../Mysql/mysql";
import parseTypes from "./parserTypes";
import { Repository } from "./types";

export function Table(name?: string) {
  return function (target: any) {
    const nameTable = name || target.name;

    getConection().then((cn) => {
      cn.query(`Create table IF NOT EXISTS ${nameTable} (_id int)`);
    });

    console.log(`Nombre de la tabla: ${name || target.name}`);

    target.prototype.findAll = async function () {
      const cn = await getConection();
      const [rows] = await cn.query(`SELECT * FROM ${nameTable}`);
      return rows;
    };
  };
}

export function Atribute(type?: string) {
  return function (target: any, propertyKey: string | symbol) {
    const tipo = Reflect.getMetadata("design:type", target, propertyKey);

    const nombreTable = target.constructor.name;
    const typeTable = parseTypes(type || tipo.name);

    getConection().then(async (cn) => {
      const [column] = await cn.query(
        `SHOW COLUMNS FROM ${nombreTable} LIKE '${String(propertyKey)}'`
      );

      if (!column[0]) {
        cn.query(
          `ALTER TABLE ${nombreTable} ADD COLUMN  ${String(
            propertyKey
          )} ${typeTable}`
        );
        console.log("se añadio la columna");
      }
    });

    console.log(
      `Propiedad: ${String(propertyKey)}, Tipo inferido: ${
        tipo.name
      }, nombre de la tabla: ${nombreTable}`
    );
  };
}

export function PrimaryKey() {
  return function (target: any, propertyKey: string | symbol) {
    const tipo = Reflect.getMetadata("design:type", target, propertyKey);

    const nombreTable = target.constructor.name;
    const typeTable = parseTypes(tipo.name);

    getConection().then(async (cn) => {
      const [column] = await cn.query(
        `SHOW COLUMNS FROM ${nombreTable} LIKE '${String(propertyKey)}'`
      );

      if (!column[0]) {
        cn.query(
          `ALTER TABLE ${nombreTable} ADD COLUMN  ${String(
            propertyKey
          )} ${typeTable} PRIMARY KEY AUTO_INCREMENT`
        );
        console.log("se añadio la columna");
      }
    });

    console.log(
      `Propiedad: ${String(propertyKey)}, nombre de la tabla: ${nombreTable}`
    );
  };
}

export function Hydration<T>(classOriginal: T): Repository<T> {
  return classOriginal as Repository<T>;
}
