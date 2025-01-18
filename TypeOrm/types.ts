export interface Repository<T> {
  findAll(): Promise<T[]>;
  findOne(data: Partial<T>): Promise<T>;
  save(data: Partial<T>): Promise<T>;
  updateBy(data: Partial<T>, condition: Partial<T>): Promise<ParseUpdate>;
}

export interface ParseUpdate {
  fieldCount: number;
  affectedRows: number;
  insertId: number;
  info: string;
  serverStatus: number;
  warningStatus: number;
  changedRows: number;
}
