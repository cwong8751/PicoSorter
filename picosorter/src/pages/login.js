// pages/login.js
import Head from 'next/head';

export default function Login() {

    // handle login 
    const handleLogin = async (e) => {
        e.preventDefault();

        // get user and password 
        const username = e.target.username.value;
        const password = e.target.password.value;

        // authenticate user
        const response = await fetch('http://localhost:3030/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password }) // use plaintext password just for now 
        });
        
        const data =  await response.json();
        console.log(data);

        // do auth 
        if(response.status == 200){
            // save user information to localStorage
            localStorage.setItem('user', JSON.stringify(data.user));

            // redirect to dashboard 
            window.location.href = '/dashboard';
        }
        else if(response.status == 401){
            alert('Invalid username or password');
        }
        else{
            alert('Error logging in');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <Head>
                <title>Login - picosorter</title>
            </Head>
            <main className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Login to picosorter</h1>
                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Username"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
                    >
                        Login
                    </button>
                </form>
            </main>
        </div>
    );
}
