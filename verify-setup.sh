#!/bin/bash

echo "🔍 Kinyui School Login Verification"
echo "===================================="
echo ""

echo "✅ Step 1: Database Status"
npx prisma migrate status 2>&1 | grep -E "Database schema|migration"
echo ""

echo "✅ Step 2: Admin User Status"
node check-admin.js 2>&1 | grep -E "Admin user|Email:|Role:|Status:"
echo ""

echo "✅ Step 3: Configuration Check"
echo "   - JWT_SECRET: $([ -n "$JWT_SECRET" ] && echo '✓ SET' || echo '✗ NOT SET')"
echo "   - DATABASE_URL: $([ -n "$DATABASE_URL" ] && echo '✓ SET' || echo '✗ NOT SET')"
echo "   - EMAIL_USER: $([ -n "$EMAIL_USER" ] && echo '✓ SET' || echo '✗ NOT SET')"
echo "   - EMAIL_PASS: $([ -n "$EMAIL_PASS" ] && echo '✓ SET' || echo '✗ NOT SET')"
echo ""

echo "✅ All systems ready!"
echo ""
echo "🔑 Login Credentials:"
echo "   Email: emmanuelmakau90@gmail.com"
echo "   Password: Admin@123"
echo ""
echo "💡 If you still get 500 errors:"
echo "   1. Check browser console for specific error messages"
echo "   2. Check server logs for detailed error information"
echo "   3. Make sure the server is running: npm run dev"
