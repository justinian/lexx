import { parseArgs } from 'util';
import { build_language } from './src/definition'

const default_count = '20';

const { values, positionals } = parseArgs({
    args: Bun.argv.slice(2),
    options: {
        count: {
            type: 'string',
            short: 'c',
            default: default_count,
        },
        namebase: {
            type: 'boolean',
            short: 'n',
        },
    },
    allowPositionals: true,
});

let language = "test.lang";
if (positionals.length > 0)
    language = positionals[0];

const def = await Bun.file(language).text();

try {
    if (typeof(values.count) != "string")
        values.count = default_count;

    const lang = build_language(def);
    let words = lang.generate(parseInt(values.count));

    if (values.namebase) {
        let ws = words.map(w => w[0]);
        console.log(ws.join(','));
    } else {
        for (const w of words) {
            console.log(`${w[0]}\t\t/${w[1]}/`);
        }
    }
} catch (err) {
    console.error(err);
}
