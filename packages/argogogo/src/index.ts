import {resolve, join} from 'path';
import {mkdirSync, existsSync, writeFileSync} from 'fs';
import {execSync} from 'child_process';
import {sync as spawnSync} from 'cross-spawn';

try {
  run();
} catch (error) {
  process.exit(1);
}

function run() {
  const [, , name, ...rest] = process.argv;

  if (!name) {
    log('You must run this command with a directory name', {error: true});
    log('Example: npx argogogo my-extension', {error: true});
    process.exit(1);
  }

  const directory = resolve(name);
  const useReact = rest.includes('--react');
  const useTypeScript = rest.includes('--typescript');
  const useYarn = shouldUseYarn() && !rest.includes('--npm');

  if (existsSync(directory)) {
    if (looksLikeExistingProject(directory)) {
      log(`Using existing project in ${directory}`);

      if (useYarn) {
        log('Running yarn start');
        spawn('yarnpkg', ['start'], {cwd: directory, stdio: 'inherit'});
      } else {
        log('Running npm start');
        spawn('npm', ['start'], {cwd: directory, stdio: 'inherit'});
      }

      return;
    }

    log(`The directory ${directory} already exists`, {error: true});
    process.exit(1);
  }

  mkdirSync(directory);

  const extraDependencies = useReact ? {react: '>=16.8.0 <17.0.0'} : {};
  const extraDevDependencies = useTypeScript ? {typescript: '^3.9.0'} : {};

  writeFileWithNewline(
    join(directory, 'package.json'),
    JSON.stringify(
      {
        name,
        private: true,
        scripts: {
          start: 'argogogo',
        },
        dependencies: {
          '@shopify/argo-checkout-private': '^0.0.2',
          ...extraDependencies,
        },
        devDependencies: {
          'argogogo-run': '^0.0.2',
          ...extraDevDependencies,
        },
      },
      null,
      2,
    ),
  );

  if (useReact) {
    const content = `
import {renderReact, Button} from '@shopify/argo-checkout-private';

renderReact('Checkout', () => <App />);

function App() {
  return (
    <Button onPress={() => console.log('Paid!')}>
      Pay
    </Button>
  );
}
`;

    writeFileWithNewline(
      join(directory, `index.${useTypeScript ? 'tsx' : 'js'}`),
      content,
    );
  } else {
    const content = `
import {extend, Button} from '@shopify/argo-checkout-private';

extend('Checkout', (root) => {
  const button = root.createComponent(Button, {
    onPress() {
      console.log('Paid!');
    },
  });
  button.appendChild(root.createText('Pay'));
  root.appendChild(button);
  root.mount();

  return {};
});
`;

    writeFileWithNewline(
      join(directory, `index.${useTypeScript ? 'ts' : 'js'}`),
      content,
    );
  }

  if (useYarn) {
    log('Running yarn install');
    spawn('yarnpkg', ['install'], {cwd: directory, stdio: 'inherit'});

    log('Running yarn start');
    spawn('yarnpkg', ['start'], {cwd: directory, stdio: 'inherit'});
  } else {
    log('Running npm install');
    spawn('npm', ['install'], {cwd: directory, stdio: 'inherit'});

    log('Running npm start');
    spawn('npm', ['start'], {cwd: directory, stdio: 'inherit'});
  }
}

function writeFileWithNewline(path: string, content: string) {
  return writeFileSync(path, `${content.trim()}\n`);
}

function spawn(...args: Parameters<typeof spawnSync>) {
  const {status, stderr, stdout} = spawnSync(...args);

  if (status != null && status !== 0) {
    throw new Error(stderr.toString('utf8') ?? stdout.toString('utf8'));
  }
}

function log(message: string, {error = false} = {}) {
  const separator = error ? '\u001b[31m>\u001b[39m' : '\u001b[2m>\u001b[22m';
  // eslint-disable-next-line no-console
  console.log(`🔭 ${separator} ${message}`);
}

function shouldUseYarn() {
  try {
    execSync('yarnpkg --version', {stdio: 'ignore'});
    return true;
  } catch {
    return false;
  }
}

function looksLikeExistingProject(directory: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const packageJson = require(join(directory, 'package.json'));
    return packageJson?.scripts?.start === 'argogogo';
  } catch {
    return false;
  }
}
