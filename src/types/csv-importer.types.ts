export type CsvRow = Record<string, string>;

export interface CsvImportError {
  line: number;
  raw: string;
  reason: string;
}

export interface CsvImportSummary {
  filePath: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  duplicatesInFile: number;
  inserted: number;
  updated: number;
  errors: CsvImportError[];
}
