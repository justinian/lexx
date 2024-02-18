import Filter from './filter';
import type { filter_desc } from './filter';

class RejectError extends Error {};

class WeightedRandom {
    private readonly phonemes: string[];
    private readonly weights: number[];
    private readonly total: number;

    constructor(phonemes: string[]) {
        this.phonemes = phonemes;
        const base = Math.log(phonemes.length + 1);

        this.weights = [];
        for (let i = 0; i < phonemes.length; i++) {
            this.weights.push(base - Math.log(i+1));
        }

        this.total = this.weights.reduce((x, y) => x + y, 0);
    }

    choose(): string {
        const roll = Math.random() * this.total;
        let accumulator = 0;
        for (let i = 0; i < this.phonemes.length; i++) {
            accumulator += this.weights[i];
            if (accumulator > roll)
                return this.phonemes[i];
        }

        // Should never get here, return the most common item.
        return this.phonemes[0];
    }
};

class PhoneMap extends Map<string, WeightedRandom> {
    replace(input: string, rand_rate: number): string {
        let self = this;

        function replacer(match, className, questionMark, offset, str) {
            if (questionMark && (Math.random() * 100) > rand_rate)
                return "";
            
            let choices = self.get(className);
            return self.replace(choices.choose());
        }
        return input.replaceAll(/([A-Z])(\?)?/g, replacer);
    }
}

export class Phonology extends Filter {
    private readonly patterns: WeightedRandom;
    private readonly classes: PhoneMap;

    constructor(patterns: string[], classes: Map<string, string[]>, filters: filter_desc[]) {
        super(filters);
        this.patterns = new WeightedRandom(patterns);

        this.classes = new PhoneMap();
        for (const [name, phones] of classes)
            this.classes.set(name, new WeightedRandom(phones));
    }

    generate(count: number, rand_rate: number): string[] {
        return Array
            .from({length: count}, () => {
                let result = this.classes.replace(this.patterns.choose(), rand_rate);
                return this.filter(result);

                const form = this.patterns.choose()
                    .split(/([A-Z]\??)/)
                    .filter(s => {
                        if (s.endsWith('?'))
                            return (Math.random() * 100) <= rand_rate;
                        return !!s;
                    })
                    .map(s => {
                        const pclass = s.substring(0,1);
                        const ph = this.classes.get(pclass);
                        if (!ph) {
                            const all = [...this.classes.keys()].map(k => `'${k}'`).join(', ');
                            throw new Error(`Unknown phoneme class '${pclass}' in ${all}`);
                        }
                        return ph.choose();
                    })
                    .join("");

                return form;
            })
            .filter((s): s is "string" => (typeof s === "string"));
    }
};

export default Phonology;
