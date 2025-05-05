import { Button } from '@/components/ui/button'; // Adapte ce chemin si nécessaire

export default function RegisterPage() {

    return (
        <div className="flex-1 flex items-center justify-center bg-red-50 px-4 h-full">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create an account</h2>

            <form>
            {/* Name */}
            <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
                </label>
                <input
                type="text"
                name="name"
                id="name"
                required
                className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
                />
            </div>

            {/* Email */}
            <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
                </label>
                <input
                type="email"
                name="email"
                id="email"
                required
                className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
                />
            </div>

            {/* Password */}
            <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
                </label>
                <input
                type="password"
                name="password"
                id="password"
                required
                className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                />
            </div>

            {/* Submit */}
            <Button type="submit" size="lg" className="w-full bg-black text-white hover:bg-blue-600">
                Sign Up
            </Button>
            </form>

            {/* Link to login */}
            <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-blue-500 hover:text-blue-700">
                Log in
            </a>
            </p>
        </div>
        </div>
    );
}