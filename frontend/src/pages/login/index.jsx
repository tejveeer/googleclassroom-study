const API_BASE = "http://localhost:3000";

export function Login() {
  const handleLogin = async () => {
    window.location.href = `${API_BASE}/api/auth/google`;
  };

  return (
    <div className="min-h-screen mx-auto max-w-max flex flex-col gap-2 justify-center items-center select-none">
      <h1 className="text-3xl font-bold">Google Classroom</h1>
      <button className="
        text-xl cursor-pointer px-6 py-1 self-end
        rounded-lg hover:rounded-xl transition-[border-radius] 
        ease-out duration-200 bg-gray-400"
        onClick={handleLogin}
      >
          Login
      </button>
    </div>
  )
}

