const fs = require('fs');

const genPath = 'node_modules/@spartan-ng/cli/src/generators/theme/generator.js';
let genContent = fs.readFileSync(genPath, 'utf8');
genContent = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = addThemeToApplicationGenerator;
const get_project_names_1 = require("../../utils/get-project-names");
const add_theme_to_application_styles_1 = require("./libs/add-theme-to-application-styles");
async function addThemeToApplicationGenerator(tree, setupTailwindCss = false) {
    const { projects, projectNames } = (0, get_project_names_1.getProjectsAndNames)(tree);
    const project = projects.get(projectNames[0]);
    if (!project) return;
    await (0, add_theme_to_application_styles_1.addThemeToApplicationStyles)(tree, {
        setupTailwindCss,
        project: project.name,
        theme: 'zinc',
        addCdkStyles: false,
        stylesEntryPoint: '',
        prefix: '',
    }, project);
}
`;
fs.writeFileSync(genPath, genContent);

const stylesPath = 'node_modules/@spartan-ng/cli/src/generators/theme/libs/add-theme-to-application-styles.js';
let stylesContent = fs.readFileSync(stylesPath, 'utf8');
stylesContent = stylesContent.replace("if (tailwindVersion === 3) {", "if (false) {");
fs.writeFileSync(stylesPath, stylesContent);

console.log('Fixed both files properly');
