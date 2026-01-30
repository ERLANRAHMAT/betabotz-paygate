#!/usr/bin/env node

/**
 * Test Runner - Betabotz Paygate SDK
 * Run all tests or specific test suites
 */

const transactionTests = require('./transaction.test');
const callbackTests = require('./callback.test');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function printHeader(text) {
  console.log('\n' + colors.bright + colors.blue + '═'.repeat(50) + colors.reset);
  console.log(colors.bright + colors.cyan + text + colors.reset);
  console.log(colors.bright + colors.blue + '═'.repeat(50) + colors.reset);
}

function printSuccess(text) {
  console.log(colors.green + '✅ ' + text + colors.reset);
}

function printError(text) {
  console.log(colors.red + '❌ ' + text + colors.reset);
}

function printWarning(text) {
  console.log(colors.yellow + '⚠️  ' + text + colors.reset);
}

async function runTestSuite(suiteName, tests) {
  printHeader(`Running ${suiteName}`);
  
  let passed = 0;
  let failed = 0;
  const results = [];

  for (const [testName, testFn] of Object.entries(tests)) {
    if (testName === 'runAllTests') continue; // Skip the runAllTests function
    
    try {
      console.log(`\n${colors.yellow}Running: ${testName}${colors.reset}`);
      await testFn();
      passed++;
      results.push({ name: testName, status: 'PASS' });
      printSuccess(`${testName} passed`);
    } catch (error) {
      failed++;
      results.push({ name: testName, status: 'FAIL', error: error.message });
      printError(`${testName} failed: ${error.message}`);
    }
  }

  return { suiteName, passed, failed, results };
}

async function runAllSuites() {
  printHeader('Betabotz Paygate SDK - Complete Test Suite');
  
  const suiteResults = [];
  
  try {
    // Run Transaction Tests
    const txResults = await runTestSuite('Transaction Tests', transactionTests);
    suiteResults.push(txResults);
    
    // Small delay between test suites
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Run Callback Tests
    const cbResults = await runTestSuite('Callback Tests', callbackTests);
    suiteResults.push(cbResults);
    
  } catch (error) {
    printError(`Test suite error: ${error.message}`);
  }

  // Print summary
  printHeader('Test Summary');
  
  let totalPassed = 0;
  let totalFailed = 0;
  
  for (const suite of suiteResults) {
    console.log(`\n${colors.bright}${suite.suiteName}:${colors.reset}`);
    console.log(`  Passed: ${colors.green}${suite.passed}${colors.reset}`);
    console.log(`  Failed: ${colors.red}${suite.failed}${colors.reset}`);
    
    totalPassed += suite.passed;
    totalFailed += suite.failed;
    
    // Show failed tests
    if (suite.failed > 0) {
      console.log(`\n  ${colors.red}Failed Tests:${colors.reset}`);
      for (const result of suite.results) {
        if (result.status === 'FAIL') {
          console.log(`    - ${result.name}: ${result.error}`);
        }
      }
    }
  }
  
  console.log('\n' + colors.bright + '─'.repeat(50) + colors.reset);
  console.log(`${colors.bright}Total Tests:${colors.reset} ${totalPassed + totalFailed}`);
  console.log(`${colors.green}Passed:${colors.reset} ${totalPassed}`);
  console.log(`${colors.red}Failed:${colors.reset} ${totalFailed}`);
  console.log(colors.bright + '─'.repeat(50) + colors.reset);
  
  if (totalFailed === 0) {
    printSuccess('All tests passed! 🎉');
    process.exit(0);
  } else {
    printError('Some tests failed!');
    process.exit(1);
  }
}

async function runSpecificTests(testType) {
  switch (testType) {
    case 'transaction':
    case 'tx':
      await runTestSuite('Transaction Tests', transactionTests);
      break;
      
    case 'callback':
    case 'cb':
      await runTestSuite('Callback Tests', callbackTests);
      break;
      
    default:
      printWarning(`Unknown test type: ${testType}`);
      printWarning('Available options: transaction, callback, all');
      process.exit(1);
  }
  
  process.exit(0);
}

// Command line interface
async function main() {
  const args = process.argv.slice(2);
  
  // Show help
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
${colors.bright}Betabotz Paygate SDK - Test Runner${colors.reset}

${colors.bright}Usage:${colors.reset}
  node test/run.js [options]

${colors.bright}Options:${colors.reset}
  (no args)           Run all tests
  transaction, tx     Run only transaction tests
  callback, cb        Run only callback tests
  --help, -h          Show this help message

${colors.bright}Examples:${colors.reset}
  node test/run.js                  # Run all tests
  node test/run.js transaction      # Run transaction tests only
  node test/run.js callback         # Run callback tests only
`);
    process.exit(0);
  }
  
  // Run specific tests or all
  if (args.length === 0) {
    await runAllSuites();
  } else {
    await runSpecificTests(args[0]);
  }
}

// Run the test runner
if (require.main === module) {
  main().catch(error => {
    printError(`Fatal error: ${error.message}`);
    console.error(error);
    process.exit(1);
  });
}

module.exports = {
  runAllSuites,
  runSpecificTests,
  runTestSuite,
};
