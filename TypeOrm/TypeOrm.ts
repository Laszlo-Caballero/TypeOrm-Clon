import { getConection } from "../Mysql/mysql";
import parseTypes from "./parserTypes";
import { ParseUpdate, Repository } from "./types";

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

    target.prototype.findOne = async function (data: any) {
      const condition = Object.entries(data)
        .map(([key, value]) =>
          typeof value === "string"
            ? `${key} = '${value}'`
            : `${key} = ${value}`
        )
        .join(" AND ");

      const cn = await getConection();

      const [rows] = await cn.query(
        `SELECT * FROM ${nameTable} WHERE ${condition}`
      );

      return rows[0] || {};
    };

    target.prototype.save = async function (data: any) {
      const keys = Object.keys(data).join(",");
      const values = Object.values(data)
        .map((value) => (typeof value === "string" ? `'${value}'` : value))
        .join(",");
      const cn = await getConection();

      await cn.query(`INSERT INTO ${nameTable} (${keys}) VALUES (${values})`);

      return data;
    };

    target.prototype.updateBy = async function (data: any, condition: any) {
      const keys = Object.keys(data)
        .map((key) =>
          typeof data[key] === "string"
            ? `${key} = '${data[key]}'`
            : `${key} = ${data[key]}`
        )
        .join(",");

      const conditions = Object.entries(condition)
        .map(([key, value]) => `${key} = ${value}`)
        .join(" AND ");

      const cn = await getConection();

      const [rows] = await cn.query(
        `UPDATE ${nameTable} SET ${keys} WHERE ${conditions}`
      );

      const parseRows = rows as ParseUpdate;

      return parseRows;
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
