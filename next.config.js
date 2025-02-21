module.exports = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'https://services.meetchase.ai/:path*',
        },
      ];
    },
  
    async headers() {
      return [
        {
          source: '/api/:path*',
          headers: [
            {
              key: 'Access-Control-Allow-Origin',
              value: 'http://localhost:3000, https://up-bluejay-centrally.ngrok-free.app',
            },
            {
              key: 'Access-Control-Allow-Methods',
              value: 'GET, POST, OPTIONS',
            },
            {
              key: 'Access-Control-Allow-Headers',
              value: 'Content-Type, Authorization',
            },
            {
              key: 'Access-Control-Allow-Credentials',
              value: 'true',
            },
          ],
        },
      ];
    },
  };
  