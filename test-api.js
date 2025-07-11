const axios = require('axios');

const BASE_URL = 'https://backend-zma-production.up.railway.app';
const registerData = {
  name: 'Test User',
  email: 'testuser@example.com',
  password: 'secret123',
};

async function test() {
  let token = '';

  // 1. Register
  try {
    const res = await axios.post(`${BASE_URL}/auth/register`, registerData);
    console.log('✅ API /auth/register ----> thành công');
    console.log('📝 Thông tin đăng ký:', res.data);
  } catch (err) {
    console.log(
      '❌ API /auth/register ----> lỗi:',
      err.response?.status || err.message,
    );
    console.log(err.response?.data || err.message);
  }

  // 2. Login
  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, {
      email: registerData.email,
      password: registerData.password,
    });
    console.log('\n✅ API /auth/login ----> thành công');
    console.log('🔐 Access token:', res.data.access_token);
    token = res.data.access_token;
  } catch (err) {
    console.log(
      '\n❌ API /auth/login ----> lỗi:',
      err.response?.status || err.message,
    );
    console.log(err.response?.data || err.message);
  }

  // 3. Me
  try {
    const res = await axios.get(`${BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('\n✅ API /auth/me ----> thành công');
    console.log('👤 Thông tin người dùng:', res.data);
  } catch (err) {
    console.log(
      '\n❌ API /auth/me ----> lỗi:',
      err.response?.status || err.message,
    );
    console.log(err.response?.data || err.message);
  }
}

test();
