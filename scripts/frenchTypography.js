/*
 * French typography of the visible text, checked in CI:
 * - curly apostrophes: l’heure, not l'heure
 * - a narrow no-break space (U+202F) before ? ! : ; and inside « », so the sign never wraps alone
 *
 * Only user-facing text is touched: JSX text, and the strings and template literals that aren't
 * code (imports, class names, URLs...). Comments and code are left alone, so English comments
 * like "don't" are fine.
 *
 * node scripts/frenchTypography.js --check   lists the issues, exits 1 if there are any
 * node scripts/frenchTypography.js --fix     fixes them in place
 */
const fs = require("fs");
const path = require("path");
const babel = require("@babel/core");

const NNBSP = " ";
const SRC = path.join(__dirname, "..", "src");
// JSX attributes whose value is code, not text
const CODE_ATTRIBUTES =
    /^(className|href|src|to|type|id|key|name|role|rel|target|autoComplete|path|width|height|loading|lang|method|htmlFor|data-.*)$/;

const fixText = (text, startsAfterCode) => {
    const fixed = text
        // an apostrophe between two letters is an elision: l’heure, qu’il, aujourd’hui
        .replace(/(\p{L})'(\p{L})/gu, "$1’$2")
        // a plain space before a high sign becomes a narrow no-break one
        .replace(/(\S)[\s\u00A0]+([?!:;»])/gu, "$1" + NNBSP + "$2")
        .replace(/«[\s\u00A0]+(\S)/gu, "«" + NNBSP + "$1");

    // in JSX the sign can follow an expression: {edition.name} : rendez-vous
    return startsAfterCode ? fixed.replace(/^[\s\u00A0]+([?!:;»])/u, NNBSP + "$1") : fixed;
};

const isCodeString = (nodePath) => {
    const parent = nodePath.parent;
    if (parent.type === "ImportDeclaration" || parent.type === "ExportAllDeclaration") return true;
    if (parent.type === "CallExpression" && parent.callee.name === "require") return true;
    if (parent.type === "JSXAttribute") return CODE_ATTRIBUTES.test(parent.name.name);
    // object keys and switch cases are identifiers, not text
    if (parent.type === "ObjectProperty" && parent.key === nodePath.node) return true;
    return false;
};

const collect = (code, filename) => {
    const ast = babel.parseSync(code, {
        filename,
        babelrc: false,
        configFile: false,
        presets: [require.resolve("@babel/preset-react")],
    });
    const edits = [];
    const add = (start, end, startsAfterCode) => {
        const raw = code.slice(start, end);
        const fixed = fixText(raw, startsAfterCode);
        if (fixed !== raw) edits.push({ start, end, raw, fixed });
    };

    babel.traverse(ast, {
        JSXText(nodePath) {
            const siblings = nodePath.parent.children;
            const previous = siblings[siblings.indexOf(nodePath.node) - 1];
            add(
                nodePath.node.start,
                nodePath.node.end,
                Boolean(previous) && previous.type === "JSXExpressionContainer",
            );
        },
        StringLiteral(nodePath) {
            if (isCodeString(nodePath)) return;
            // inside the quotes only
            add(nodePath.node.start + 1, nodePath.node.end - 1, false);
        },
        TemplateElement(nodePath) {
            add(
                nodePath.node.start,
                nodePath.node.end,
                nodePath.node !== nodePath.parent.quasis[0],
            );
        },
    });

    return edits;
};

const files = (dir) =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) return files(full);
        return /\.jsx?$/.test(entry.name) ? [full] : [];
    });

const fix = process.argv.includes("--fix");
let issues = 0;

for (const file of files(SRC)) {
    const code = fs.readFileSync(file, "utf8");
    const edits = collect(code, file);
    if (!edits.length) continue;

    issues += edits.length;
    if (fix) {
        // from the end, so the earlier offsets stay valid
        const fixed = edits
            .sort((a, b) => b.start - a.start)
            .reduce(
                (text, edit) => text.slice(0, edit.start) + edit.fixed + text.slice(edit.end),
                code,
            );
        fs.writeFileSync(file, fixed);
    } else
        edits.forEach((edit) => {
            const line = code.slice(0, edit.start).split("\n").length;
            console.log(
                `${path.relative(process.cwd(), file)}:${line}  ${JSON.stringify(edit.raw.slice(0, 70))}`,
            );
        });
}

if (fix) console.log(`Fixed ${issues} French typography issue(s).`);
else if (issues) {
    console.log(`\n${issues} French typography issue(s): run npm run typography-fix`);
    process.exit(1);
}
