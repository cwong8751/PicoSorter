export default function verifyUser() {
    // Check if user is logged in using localStorage
    //TODO: get rid of the password field in the user variable 
    const user = localStorage.getItem('user');

    console.log('User:', user);

    // Redirect to login page if user is not logged in
    if (!user) {
        window.location.href = '/login';
    }

    return user;
}