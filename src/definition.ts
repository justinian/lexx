import type { filter_desc } from './filter';
import type { language_settings } from './language';

import Filter from './filter';
import Language from './language';
import { parse, ASTKinds } from './parser';
import Phonology from './phonology';


export function build_language(definition: string): Language {
    const result = parse(definition);
    if (!result.ast) {
        const error = new Error(result.errs.toString());
        throw error;
    }

    let settings_vars: Map<string, any> = new Map();
    let using_modules: string[][] = [];

    let word_patterns: string[][] = [];
    let filter_patterns: filter_desc[] = [];
    let classes: Map<string, string[]> = new Map();

    let macros: filter_desc[] = [];
    let spelling: filter_desc[] = [];

    for (const line of result.ast.lines) {
        switch (line.kind) {
        case ASTKinds.using:
            using_modules.push(line.modules);
            break;

        case ASTKinds.settings:
            for (const key of line.settings.keys())
                settings_vars.set(key, line.settings.get(key));
            break;

        case ASTKinds.pclass:
            classes.set(line.name, line.phonemes);
            break;

        case ASTKinds.macro:
            macros.push(['\\' + line.name, line.value]);
            break;

        case ASTKinds.words:
            word_patterns.push(line.patterns);
            break;

        case ASTKinds.reject:
        case ASTKinds.filter:
            for(const pattern of line.patterns)
                filter_patterns.push(pattern);
            break;

        case ASTKinds.spelling:
            for(const pattern of line.patterns)
                spelling.push(pattern);
            break;
        }
    }

    let macro_filter: Filter = new Filter(macros);

    let final_patterns = word_patterns
        .flat()
        .map(p => macro_filter.transform(p));

    return new Language(
        {modules: using_modules.flat(), settings: settings_vars},
        new Phonology(final_patterns, classes, filter_patterns),
        new Filter(spelling),
    );
}

export default build_language;
