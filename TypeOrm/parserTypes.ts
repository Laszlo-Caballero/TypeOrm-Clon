export default function parseTypes(type: string) {
  const types = {
    string: "VARCHAR(255)",
    number: "INT",
    boolean: "BOOLEAN",
  };

  return types[type.toLocaleLowerCase()] || "VARCHAR(255)";
}
