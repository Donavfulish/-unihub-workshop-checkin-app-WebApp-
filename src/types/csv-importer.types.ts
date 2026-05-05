export type CsvRow = Record<string, string>;

export interface CsvImportError {
  row: number;
  errors: string[];
}

export interface CsvImportSummary {
  total: number;
  success: number;
  failed: number;
  errors: CsvImportError[];
}
