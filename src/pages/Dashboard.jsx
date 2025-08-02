// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { supabase } from "../SupabaseClient";
import { useNavigate } from "react-router-dom";
import Header from "../components/Fragments/Header";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        navigate("/");
        return;
      }

      const userID = session.user.id;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userID)
        .single();

      if (error) {
        console.error("Gagal ambil profile:", error.message);
        return navigate("/set-username");
      }

      if (!data.username) {
        return navigate("/set-username");
      }

      setProfile(data);
      setLoading(false);
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-600">Memuat profil...</div>
    );
  }

  const daysLeft = profile.trial_started_at
    ? Math.max(
        0,
        7 -
          Math.floor(
            (Date.now() - new Date(profile.trial_started_at)) /
              (1000 * 60 * 60 * 24)
          )
      )
    : 0;

  return (
    <div className="min-h-screen bg-blue-50">
      <Header
        children={profile.username}
        onclick={handleLogout}
        list="Logout"
        detailstatus={
          profile.is_member
            ? "Member"
            : profile.status === "trialing"
            ? "Trial"
            : "Unknown"
        }
      />

      <div className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-4xl font-bold text-blue-700 mb-6 text-center">
          Selamat datang, {profile.username} 👋
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-blue-100 text-blue-800 p-4 rounded-xl shadow">
            <div className="text-sm">Status Akun</div>
            <div className="text-xl font-semibold mt-1">
              {profile.is_member
                ? "Member"
                : profile.status === "trialing"
                ? "Trial"
                : "Unknown"}
            </div>
          </div>
          <div className="bg-blue-200 text-blue-900 p-4 rounded-xl shadow">
            <div className="text-sm">Sisa Trial</div>
            <div className="text-xl font-semibold mt-1">
              {profile.is_member ? "Aktif" : `${daysLeft} hari`}
            </div>
          </div>
          <div className="bg-blue-300 text-blue-950 p-4 rounded-xl shadow">
            <div className="text-sm">Email</div>
            <div className="text-xl font-semibold mt-1">{profile.email}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <button
            onClick={() => navigate("/camera")}
            className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-lg font-semibold shadow"
          >
            📸 Ambil Foto
          </button>
          <button
            onClick={() => navigate("/template")}
            className="bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl text-lg font-semibold shadow"
          >
            🎨 Template & Ikon
          </button>
          <button
            onClick={() => navigate("/account")}
            className="bg-blue-400 hover:bg-blue-500 text-white py-4 rounded-xl text-lg font-semibold shadow"
          >
            👤 Akun & Paket
          </button>
        </div>
      </div>
    </div>
  );
}
