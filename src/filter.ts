export type filter_desc = [string, string];
export const reject_sentinel: string = "REJECT";

type filter_entry = [RegExp, string];

export class Filter {
    private readonly filters: filter_entry[] = [];

    constructor(descs: filter_desc[]) {
        for (const desc of descs) {
            this.filters.push([new RegExp(desc[0], 'g'), desc[1]]);
        }
    }

    transform(input: string): string {
        for (const entry of this.filters)
            input = input.replaceAll(entry[0], entry[1]);

        return input;
    }

    filter(input: string): string | null {
        for (const entry of this.filters) {
            input = input.replaceAll(entry[0], entry[1]);
            if (input.includes(reject_sentinel))
                return null;
        }

        return input;
    }
};

export default Filter;
