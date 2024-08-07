import { ITableStyle } from "./types";

export const winFontsC = [
    "Algerian",
    "Arial",
    "Bahnschrift",
    "Broadway",
    "Calibri",
    "Cambria",
    "Candara",
    "Castellar",
    "Centaur",
    "Century",
    "Chiller",
    "Consolas",
    "Constantia",
    "Corbel",
    "Courier",
    "Ebrima",
    "Elephant",
    "Fixedsys",
    "Forte",
    "Gabriola",
    "Gadugi",
    "Garamond",
    "Georgia",
    "Gigi",
    "Haettenschweiler",
    "Harrington",
    "Impact",
    "Jokerman",
    "Leelawadee",
    "Mistral",
    "Modern",
    "NSimSun",
    "Onyx",
    "Papyrus",
    "Parchment",
    "Perpetua",
    "Playbill",
    "Pristina",
    "Ravie",
    "Rockwell",
    "Roman",
    "Script",
    "SimSun",
    "Stencil",
    "Sylfaen",
    "Symbol",
    "Tahoma",
    "Terminal",
    "Verdana",
    "Webdings"
];

export const tableStyles: ITableStyle[] = [
    { id: 1, name: "Basic table", image: "table.png", colors: { header: "#FFFFFF", row: "#FFFFFF", stroke: "#000000", alt_row: "#FFFFFF", row_text: "#000000", alt_row_text: "#000000", header_text: "#000000" }, isActive: true, border:'#000000' },
    { id: 2, name: "Basic grey", image: "table_grey.png", colors: { header: "#000000", row: "#808080", stroke: "#FFFFFF", alt_row: "#C8C8C8", row_text: "#FFFFFF", alt_row_text: "#FFFFFF", header_text: "#FFFFFF" }, isActive: false, border:'grey' },
    { id: 3, name: "Basic blue", image: "table_blue.png", colors: { header: "#0082CB", row: "#B0C8E2", stroke: "#FFFFFF", alt_row: "#E3EDFC", row_text: "#FFFFFF", alt_row_text: "#243E84", header_text: "#FFFFFF" }, isActive: false, border: '#0082CB' },
    { id: 4, name: "Basic orange", image: "table_orange.png", colors: { header: "#F95E19", row: "#F9D298", stroke: "#FFFFFF", alt_row: "#F2E4BB", row_text: "#FFFFFF", alt_row_text: "#9F6B53", header_text: "#FFFFFF" }, isActive: false, border: '#F95E19' },
    { id: 5, name: "Basic green", image: "table_green.png", colors: { header: "#447A06", row: "#CADD7C", stroke: "#FFFFFF", alt_row: "#DEF2B3", row_text: "#FFFFFF", alt_row_text: "#3C5D16", header_text: "#FFFFFF" }, isActive: false, border: '#447A06' },
    { id: 6, name: "Basic purple", image: "table_purple.png", colors: { header: "#662B8C", row: "#A69AB7", stroke: "#FFFFFF", alt_row: "#DBCAE8", row_text: "#FFFFFF", alt_row_text: "#643E7D", header_text: "#FFFFFF" }, isActive: false, border: '#662B8C' },
    { id: 7, name: "Basic brown", image: "table_brown.png", colors: { header: "#661F03", row: "#D8C29E", stroke: "#FFFFFF", alt_row: "#F0E5D0", row_text: "#FFFFFF", alt_row_text: "#9A5F48", header_text: "#FFFFFF" }, isActive: false, border: '#661F03' },
    { id: 8, name: "Basic deep blue", image: "table_blue_2.png", colors: { header: "#0019FF", row: "#D2D8FC", stroke: "#FFFFFF", alt_row: "#B1C0E8", row_text: "#5760AC", alt_row_text: "#FFFFFF", header_text: "#FFFFFF" }, isActive: false, border: '#0019FF' },
    { id: 9, name: "Basic red", image: "table_red.png", colors: { header: "#E01414", row: "#F4BFBD", stroke: "#FFFFFF", alt_row: "#DD8787", row_text: "#FFFFFF", alt_row_text: "#FFFFFF", header_text: "#FFFFFF" }, isActive: false, border: '#E01414' },
    { id: 10, name: "Basic yellow", image: "table_yellow.png", colors: { header: "#FFD60B", row: "#FCECAC", stroke: "#FFFFFF", alt_row: "#E5D298", row_text: "#C48A3F", alt_row_text: "#FFFFFF", header_text: "#FFFFFF" }, isActive: false, border: '#FFD60B' },
    { id: 11, name: "Simple table", image: "table_2.png", colors: { header: "#FFFFFF", row: "#CCCCCC", stroke: "#666666", alt_row: "#FFFFFF", row_text: "#FFFFFF", alt_row_text: "#727272", header_text: "#000000" }, isActive: false, border: '#CCCCCC' },
    { id: 12, name: "Simple grey", image: "table_2_grey.png", colors: { header: "#000000", row: "#FFFFFF", stroke: "#000000", alt_row: "#FFFFFF", row_text: "#000000", alt_row_text: "#000000", header_text: "#FFFFFF" }, isActive: false, border: '#000000' },
    { id: 13, name: "Simple blue", image: "table_2_blue.png", colors: { header: "#EEF8FF", row: "#A2D6F9", stroke: "#0082CB", alt_row: "#FFFFFF", row_text: "#FFFFFF", alt_row_text: "#0082CB", header_text: "#0082CB" }, isActive: false, border: '#0082CB' },
    { id: 14, name: "Simple orange", image: "table_2_orange.png", colors: { header: "#FFFCF0", row: "#F7CFA4", stroke: "#F95E19", alt_row: "#FFFFFF", row_text: "#FFFFFF", alt_row_text: "#683C2E", header_text: "#683C2E" }, isActive: false, border: '#F95E19' },
    { id: 15, name: "Simple green", image: "table_2_green.png", colors: { header: "#F0FCD0", row: "#FFFFFF", stroke: "#447A06", alt_row: "#CADD7C", row_text: "#39462A", alt_row_text: "#FFFFFF", header_text: "#39462A" }, isActive: false, border: '#447A06' },
    { id: 16, name: "Simple purple", image: "table_2_purple.png", colors: { header: "#F7E4F5", row: "#FFFFFF", stroke: "#662B8C", alt_row: "#DBCAE8", row_text: "#705780", alt_row_text: "#FFFFFF", header_text: "#705780" }, isActive: false, border: '#662B8C' },
    { id: 17, name: "Simple brown", image: "table_2_brown.png", colors: { header: "#F4ECE4", row: "#FFFFFF", stroke: "#661F03", alt_row: "#D8C29E", row_text: "#674F46", alt_row_text: "#FFFFFF", header_text: "#671C00" }, isActive: false, border: '#661F03' },
    { id: 18, name: "Simple deep blue", image: "table_2_blue_2.png", colors: { header: "#0019FF", row: "#FFFFFF", stroke: "#0019FF", alt_row: "#B1C0E8", row_text: "#505BBC", alt_row_text: "#FFFFFF", header_text: "#FFFFFF" }, isActive: false, border: '#0019FF' },
    { id: 19, name: "Simple red", image: "table_2_red.png", colors: { header: "#FFE9F5", row: "#FFFFFF", stroke: "#E01414", alt_row: "#F4BFBD", row_text: "#754545", alt_row_text: "#FFFFFF", header_text: "#754545" }, isActive: false, border: '#E01414' },
    { id: 20, name: "Simple yellow", image: "table_2_yellow.png", colors: { header: "#FFFFEB", row: "#FFFFFF", stroke: "#FFD60B", alt_row: "#FCECAC", row_text: "#807540", alt_row_text: "#8B7505", header_text: "#807540" }, isActive: false, border: '#FFD60B' },
]

export function hexToRgba(hex: string): { red: number, green: number, blue: number, alpha: number } {
    // Remove the leading # if present
    hex = hex.replace(/^#/, '');

    // Parse the red, green, and blue values
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Convert to normalized values (0-1 range)
    let red = r / 255;
    let green = g / 255;
    let blue = b / 255;

    // Default alpha to 1 if not provided
    let alpha = 1;

    return { red, green, blue, alpha };
}