/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		qualities: [100],
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '8080',
				pathname: '/ottaku/images/**',
			},
			{
				protocol: 'http',
				hostname: '127.0.0.1',
				port: '8080',
				pathname: '/ottaku/images/**',
			},
			{
				protocol: 'https',
				hostname: 'i.namu.wiki',
				pathname: '/**',
			},
			{
				protocol: 'http',
				hostname: '**',
			},
			{
				protocol: 'https',
				hostname: '**',
			},
		],
	},

	async rewrites() {
		return [
			{
				source: '/api/:path*',
				destination: 'http://localhost:8080/ottaku/api/:path*',
			},
			{
				source: '/images/:path*',
				destination: 'http://localhost:8080/ottaku/images/:path*',
			},
		];
	},
	experimental: {
		scrollRestoration: true,
	},
};

export default nextConfig;
