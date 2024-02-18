import Filter from './filter';
import Phonology from './phonology';

export interface language_settings {
    modules: string[];
    settings: Map<string, any>;
};

export type word = [string, string];

export class Language {
    private readonly settings: language_settings;
    private readonly phones: Phonology;
    private readonly ortho: Filter;

    constructor(settings: language_settings, phones: Phonology, ortho: Filter) {
        this.settings = settings;
        this.phones = phones;
        this.ortho = ortho;
    }

    generate(count: number): word[] {
        const rand_rate = this.settings.settings.get('random-rate') || 50;
        let phones = this.phones.generate(count, rand_rate);
        return phones.map((phone) => [this.ortho.transform(phone), phone]);
    }
};

export default Language;
