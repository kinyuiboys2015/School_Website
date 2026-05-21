import { prisma } from './libs/prisma.js';
import { verifyPassword } from './libs/auth.js';
import bcrypt from 'bcryptjs';

async function testLogin() {
  try {
    console.log('🔍 Testing Login Process...\n');

    const email = 'emmanuelmakau90@gmail.com';
    const password = 'Admin@123';

    // Step 1: Find user
    console.log('Step 1: Finding user...');
    const user = await prisma.user.findUnique({ 
      where: { email: email.toLowerCase().trim() } 
    });

    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }

    console.log('✅ User found:');
    console.log(`   - Name: ${user.name}`);
    console.log(`   - Email: ${user.email}`);
    console.log(`   - Role: ${user.role}`);
    console.log(`   - Has Password: ${!!user.password}`);
    console.log();

    // Step 2: Verify password
    console.log('Step 2: Verifying password...');
    if (!user.password) {
      console.log('❌ User has no password hash!');
      process.exit(1);
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    console.log(`✅ Password verification: ${isPasswordValid ? 'VALID ✓' : 'INVALID ✗'}`);
    console.log();

    if (!isPasswordValid) {
      console.log('❌ Password is incorrect. This is the issue!');
      process.exit(1);
    }

    // Step 3: Check LoginAttempt table exists
    console.log('Step 3: Checking if LoginAttempt table is accessible...');
    const attemptCount = await prisma.loginAttempt.count();
    console.log(`✅ LoginAttempt table accessible. Entries: ${attemptCount}`);
    console.log();

    // Step 4: Check DeviceToken table exists
    console.log('Step 4: Checking if DeviceToken table is accessible...');
    const deviceCount = await prisma.deviceToken.count();
    console.log(`✅ DeviceToken table accessible. Entries: ${deviceCount}`);
    console.log();

    // Step 5: Check VerificationToken table exists
    console.log('Step 5: Checking if VerificationToken table is accessible...');
    const verificationCount = await prisma.verificationToken.count();
    console.log(`✅ VerificationToken table accessible. Entries: ${verificationCount}`);
    console.log();

    console.log('✅ All checks passed! Login should work.');
    console.log();
    console.log('If you\'re still getting 500 errors:');
    console.log('1. Check that the server is running (npm run dev)');
    console.log('2. Check browser Network tab for the actual response body');
    console.log('3. Check server console for detailed error messages');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

testLogin();
