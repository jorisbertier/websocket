import { Button } from '../../components/ui/button';

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Login</h2>
            <form>
                {/* Email Input */}
                <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                />
                </div>
    
                {/* Password Input */}
                <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password"
                />
                </div>
    
                <Button size="lg" type="submit" className="w-full bg-black text-white hover:bg-blue-600">
                Login
                </Button>
            </form>
    
            <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <a href="/register" className="text-blue-500 hover:text-blue-700">
                    Sign up
                </a>
                </p>
            </div>
            </div>
        </div>
    );
}