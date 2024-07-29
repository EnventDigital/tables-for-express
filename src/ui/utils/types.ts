export interface ITableColors {
    header: string;
    row: string;
    stroke: string;
    alt_row: string;
    row_text: string;
    alt_row_text: string;
    header_text: string;
}

export interface ITableStyle {
    id: number;
    name: string;
    image: string;
    colors: ITableColors;
    isActive: boolean;
    border: string

}