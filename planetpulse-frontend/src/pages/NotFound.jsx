// src/pages/NotFound.jsx
function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-100 via-orange-200 to-yellow-100 p-6">
      <h2 className="text-5xl font-extrabold text-red-700 drop-shadow-lg">
        🚫 404 - Page Not Found
      </h2>
      <p className="mt-6 text-xl text-gray-800 text-center max-w-md">
        Oops! You seem lost. Let's get you back to making the planet better.
      </p>
      <a
        href="/"
        className="mt-8 px-6 py-3 bg-green-600 text-white text-lg rounded-full shadow-md hover:bg-green-700 transition"
      >
        🔙 Go to Home
      </a>
    </div>
  );
}

export default NotFound;
