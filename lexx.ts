import { parseArgs } from 'util';
import { build_language } from './src/definition'

const { values, positionals } = parseArgs({
    args: Bun.argv.slice(2),
    options: {
        count: {
            type: 'string',
            short: 'c',
            default: '20',
        },
    },
    allowPositionals: true,
});

let language = "test.lang";
if (positionals.length > 0)
    language = positionals[0];

console.log(`Using language: ${language}`);
const def = await Bun.file(language).text();

try {
    const lang = build_language(def);
    let words = lang.generate(parseInt(values.count));
    for (const w of words) {
        console.log(`${w[0]}\t\t/${w[1]}/`);
    }
} catch (err) {
    console.error(err);
}
