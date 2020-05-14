import { Command } from '@expo/commander';
import JsonFile from '@expo/json-file';
import chalk from 'chalk';
import path from 'path';
import semver from 'semver';

import { Changelog, ChangelogChanges, UNPUBLISHED_VERSION_NAME } from '../Changelogs';
import { EXPO_DIR } from '../Constants';
import { stripNonAsciiChars, formatChangelogEntry } from '../Formatter';
import logger from '../Logger';
import { getListOfPackagesAsync } from '../Packages';

const MAIN_CHANGELOG_PATH = path.join(EXPO_DIR, 'CHANGELOG.md');
const VERSIONS_FILE_PATH = path.join(EXPO_DIR, 'versions.json');

type CommandOptions = {
  sdk: string;
  cutOff: boolean;
};

export default (program: Command) => {
  program
    .command('merge-changelogs')
    .alias('mc')
    .description('Merges packages changelogs into the root one.')
    .option(
      '-s, --sdk <sdk>',
      'SDK version into which changelogs will be merged. Defaults to unpublished one.',
      UNPUBLISHED_VERSION_NAME
    )
    .asyncAction(action);
};

async function action(options: CommandOptions) {
  const sdkVersion = expandSDKVersion(options.sdk);
  const mainChangelog = new Changelog(MAIN_CHANGELOG_PATH);
  const mainChangelogVersions = await mainChangelog.getVersionsAsync();

  if (!mainChangelogVersions.includes(sdkVersion)) {
    logger.error(
      `\n🚫 Provided version ${chalk.blue(sdkVersion)} doesn't exist in main changelog.`
    );
    return;
  }

  const changelogChanges: Record<string, ChangelogChanges['versions']> = {};
  const versions = await JsonFile.readAsync(VERSIONS_FILE_PATH);
  const previousVersion = getPreviousVersion(mainChangelogVersions, sdkVersion);

  logger.info('\n🤏 Getting a list of packages');

  const packages = await getListOfPackagesAsync();

  logger.info('\n🔍 Gathering changelog entries from packages');

  await Promise.all(
    packages.map(async (pkg) => {
      const changelog = new Changelog(pkg.changelogPath);
      const fromVersion = versions[previousVersion]?.[pkg.packageName];

      if (fromVersion === null || !(await changelog.fileExistsAsync())) {
        // We want to skip a package if it doesn't have changelog file or is explicitly set to `null` in `versions.json`
        return;
      }

      const changes = await changelog.getChangesAsync(fromVersion);

      if (changes.totalCount > 0) {
        changelogChanges[pkg.packageName] = changes.versions;
      }
    })
  );

  const sortedPackageNames = Object.keys(changelogChanges).sort();

  for (const packageName of sortedPackageNames) {
    const packageVersions = Object.keys(changelogChanges[packageName]).sort((a, b) => {
      return a === UNPUBLISHED_VERSION_NAME
        ? -1
        : b === UNPUBLISHED_VERSION_NAME
        ? 1
        : semver.rcompare(a, b);
    });

    const fromVersion = versions[previousVersion]?.[packageName];

    if (fromVersion) {
      // Package was already bundled within previous version.
      logger.info(
        `\n📦 Inserting ${chalk.green(packageName)} entries as of ${chalk.yellow(fromVersion)}`
      );
    } else {
      // Merging initial release.
      logger.info(`\n📦 Inserting all ${chalk.green(packageName)} entries`);
    }

    for (const packageVersion of packageVersions) {
      const packageChanges = changelogChanges[packageName][packageVersion];

      for (const type in packageChanges) {
        const entries = packageChanges[type].map((entryMessage) => ({ message: entryMessage }));

        if (entries.length > 0) {
          logger.log('  ', chalk.magenta(stripNonAsciiChars(type).trim() + ':'));
          entries.forEach((entry) => {
            logger.log('    ', formatChangelogEntry(entry.message));
          });

          await mainChangelog.insertEntriesAsync(sdkVersion, type, packageName, entries);
        }
      }
    }
  }

  logger.info('\n💾 Saving changelog');

  await mainChangelog.saveAsync();

  logger.success(`\n✅ Successfully merged changelog entries`);
}

/**
 * Expand provided SDK version.
 */
function expandSDKVersion(sdk: string): string {
  if (sdk === UNPUBLISHED_VERSION_NAME || /^\d+\.\d+\.\d+$/.test(sdk)) {
    return sdk;
  }
  if (!isNaN(parseInt(sdk, 10))) {
    return `${sdk}.0.0`;
  }
  throw new Error(`Invalid SDK: ${sdk}`);
}

/**
 * Returns first ancestor version related to given current version.
 */
function getPreviousVersion(versions: string[], currentVersion: string) {
  const currentIndex = versions.indexOf(currentVersion);
  return versions[currentIndex + 1];
}
