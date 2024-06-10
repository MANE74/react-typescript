import moment from "moment";

// Transform date in to format you need :)
export function transformDate(date: string, format: string): string {
    return moment(date).format(format);
}
