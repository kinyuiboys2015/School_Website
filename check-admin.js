import { prisma } from './libs/prisma.js';
import { hashPassword } from './libs/auth.js';

async function checkAndCreateAdmin() {
  try {
    console.log('🔍 Checking for admin user...\n');

    // Check all users
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });

    console.log('📊 Total users in database:', allUsers.length);
    if (allUsers.length > 0) {
      console.log('Users found:');
      allUsers.forEach((user, i) => {
        console.log(`  ${i + 1}. ${user.name} (${user.email}) - Role: ${user.role} - Status: ${user.status}`);
      });
    } else {
      console.log('⚠️  No users found in database');
    }

    // Check for admin user
    const adminUser = await prisma.user.findFirst({
      where: {
        email: 'emmanuelmakau90@gmail.com',
      },
    });

    if (!adminUser) {
      console.log('\n❌ Admin user "emmanuelmakau90@gmail.com" not found');
      console.log('🔨 Creating admin user...\n');

      const hashedPassword = await hashPassword('Admin@123');

      const newAdmin = await prisma.user.create({
        data: {
          name: 'Emmanuel Makau',
          email: 'emmanuelmakau90@gmail.com',
          password: hashedPassword,
          role: 'ADMIN',
          status: 'active',
          phone: '0790 789847',
        },
      });

      console.log('✅ Admin user created successfully!');
      console.log(`   Email: ${newAdmin.email}`);
      console.log(`   Password: Admin@123`);
      console.log(`   Role: ${newAdmin.role}`);
      console.log(`   Status: ${newAdmin.status}`);
    } else {
      console.log('\n✅ Admin user exists:');
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Name: ${adminUser.name}`);
      console.log(`   Role: ${adminUser.role}`);
      console.log(`   Status: ${adminUser.status}`);
      console.log(`   Has password: ${!!adminUser.password}`);
    }

    console.log('\n✅ Check complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkAndCreateAdmin();
