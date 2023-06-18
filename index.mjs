#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import process from 'process';
import minimist from 'minimist';
import prompts from 'prompts';
import { fileURLToPath } from 'url';
import { blue, yellow, reset, red } from 'kolorist';

const DEFAULT_PROJECT_NAME = 'freact-project';

main();

async function main() {
  const argv = minimist(process.argv.slice(2), {
    string: ['template']
  });

  let argTemplate = argv.template;
  let argProjectName = formatTargetDir(argv._[0]);

  let projectName = argProjectName || DEFAULT_PROJECT_NAME;

  const getProjectName = () => argProjectName === '.'
    ? path.basename(path.resolve())
    : projectName;

  let result;
  try {
    result = await prompts([
      {
        type: argProjectName ? null : 'text',
        name: 'projectName',
        message: reset('Project name:'),
        initial: DEFAULT_PROJECT_NAME,
        onState: state => {
          projectName = formatTargetDir(state.value) || DEFAULT_PROJECT_NAME
        }
      },
      {
        type: () => !fs.existsSync(argProjectName) || isEmpty(argProjectName) ? null : 'confirm',
        name: 'overwrite',
        message: () => argProjectName === '.'
          ? 'Current directory'
          : `Target directory "${argProjectName}" is not empty. Remove existing files and continue?`
      },
      {
        type: (_, { overwrite }) => {
          if (overwrite === false) {
            throw new Error(red('✖') + ' Operation cancelled');
          }

          return null;
        },
        name: 'overwriteChecker'
      },
      {
        type: () => (isValidPackageName(getProjectName()) ? null : 'text'),
        name: 'packageName',
        message: reset('Package name:'),
        initial: () => toValidPackageName(getProjectName()),
        validate: dir => isValidPackageName(dir) || 'Invalid package.json name'
      },
      {
        name: 'template',
        type: typeof argTemplate === 'string' && isValidTemplate(argTemplate) ? null : 'select',
        message: typeof argTemplate === 'string' && !isValidTemplate(argTemplate)
          ? reset(`"${argTemplate}" isn't a valid template. Please choose from below: `)
          : reset('Select your template:'),
        choices: [
          {
            title: yellow('JavaScript'),
            value: 'js'
          },
          {
            title: blue('TypeScript'),
            value: 'ts'
          }
        ]
      }
    ], {
      onCancel: () => {
        throw new Error(red('✖') + ' Operation cancelled');
      },
    });
  } catch (e) {
    console.log(e.message);
    return;
  }

  let { overwrite, packageName, template } = result;
  const root = path.join(process.cwd(), projectName);

  if (overwrite) {
    emptyDir(root);
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true });
  }

  const write = (file, content) => {
    const targetPath = path.join(root, file);

    if (content) {
      fs.writeFileSync(targetPath, content);
    } else {
      copy(path.join(templateDir, file), targetPath);
    }
  }

  template ??= argTemplate;
  const templateDir = (() => {
    const basePath = path.join(fileURLToPath(import.meta.url), '../templates');

    switch (template) {
      case 'javascript':
      case 'js':
        return path.join(basePath, 'javascript');
      case 'typescript':
      case 'ts':
        return path.join(basePath, 'typescript');
      default:
        throw new Error('UNKNOWN TEMPLATE! THIS SHOULD NOT HAPPEN.');
    }
  })();

  for (const file of fs.readdirSync(templateDir)) {
    if (file === 'package.json') continue;
    write(file);
  }

  const pkg = JSON.parse(fs.readFileSync(path.join(templateDir, `package.json`), 'utf-8'));
  pkg.name = packageName || getProjectName();
  write('package.json', JSON.stringify(pkg, null, 2) + '\n');

  console.log('All done! Your project is now ready.');
}

function formatTargetDir(targetDir) {
  return targetDir?.trim().replace(/\/+$/g, '');
}

function copy(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
}

function isValidPackageName(projectName) {
  return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
    projectName
  );
}

function toValidPackageName(projectName) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z\d\-~]+/g, '-');
}

function copyDir(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });

  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copy(srcFile, destFile);
  }
}

function isEmpty(path) {
  const files = fs.readdirSync(path);
  return files.length === 0 || (files.length === 1 && files[0] === '.git');
}

function isValidTemplate(name) {
  if (typeof name !== 'string') return false;
  return ['javascript', 'typescript', 'js', 'ts'].includes(name);
}

function emptyDir(dir) {
  if (!fs.existsSync(dir)) return;

  for (const file of fs.readdirSync(dir)) {
    if (file === '.git') continue;
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true });
  }
}
