import { useEffect, useState } from "react";
import { supabase } from "../SupabaseClient";
import { useNavigate } from "react-router-dom";

export default function SetUsername() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initialize = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        setError("Anda belum login");
        setLoading(false);
        return;
      }

      setSession(data.session);
      const accessToken = data.session.access_token;

      const fullName = localStorage.getItem("fullName");
      const savedUsername = localStorage.getItem("username");

      // Jika daftar manual → langsung create/update profile
      if (fullName && savedUsername) {
        const res = await fetch("http://localhost:8080/api/create-or-update-profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ full_name: fullName, username: savedUsername }),
        });

        if (res.ok) {
          localStorage.removeItem("fullName");
          localStorage.removeItem("username");
          navigate("/dashboard");
          return;
        }
      }

      // Jika login Google → cek profile apakah sudah punya username
      try {
        const res = await fetch("http://localhost:8080/api/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (res.ok) {
          const profile = await res.json();
          if (profile?.username) {
            navigate("/dashboard");
            return;
          }
        }
      } catch (err) {
        console.error("Gagal mengambil profil:", err);
      }

      setLoading(false); // render form Set Username
    };

    initialize();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    try {
      const fullName = localStorage.getItem("fullName") || "Pengguna";
      const accessToken = session.access_token;

      const response = await fetch("http://localhost:8080/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ username, full_name: fullName }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Gagal menyimpan username");
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Sedang memuat sesi...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-2xl shadow-xl border">
      <h1 className="text-2xl font-bold mb-4 text-center">Set Username</h1>
      {error && <p className="text-red-600 text-sm text-center mb-3">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Masukkan username kamu"
          className="w-full p-3 border rounded-xl mb-4"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Simpan
        </button>
      </form>
    </div>
  );
}
