import { useState, useEffect } from "react";
import { supabase } from "../../SupabaseClient";
import { useNavigate } from "react-router-dom";
import Input from "../Elements/Input";
import Fields from "../Elements/Fields";
import Button from "../Elements/Button";

export default function AuthForm() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) checkProfile(session.user.id);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) checkProfile(session.user.id);
    });
  }, []);

  const checkProfile = async (userId) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", userId)
      .single();

    if (data?.username) {
      navigate("/dashboard");
    } else {
      navigate("/set-username");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
  
    if (!email || !password || !fullName || !username) {
      setMessage("Please fill out all fields.");
      return;
    }
  
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
  
    if (error) return setMessage(error.message);
  
    localStorage.setItem("fullName", fullName);
    localStorage.setItem("username", username);
  
    setMessage("Registration successful! Please verify your email before logging in.");
  };
  
  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) setMessage(error.message);
  };

  return (
    <div className="w-1/5 mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl heading text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 font-bold mb-4 text-center">
        {isRegister ? "Bothw3b" : "Bothw3b"}
      </h2>

      {message && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-sm">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister && (
          <div>
            <Fields
              children="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Insert your Full Name"
              className='pt-3'
            />
            <Fields
              children="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Insert your Username"
            />
          </div>
        )}
        <Fields
          children="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@bothw3b.com"
        />

        <Fields
          children="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="**********"
        />

        {!isRegister && (
          <Button
            onClick={async () => {
              const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
              });
              if (error) setMessage(error.message);
            }}
            children="Sign In"
            className="text-white bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 w-full"
          />
        )}
        {isRegister && (
          <Button
            type="submit"
            className="text-white bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 w-full"
            children="Sign Up"
          />
        )}
      </form>

      <div className="flex justify-center">
        <Button onClick={loginWithGoogle} className="mt-3  max-w-xs">
          <img
            className="w-full h-10"
            src="../../../public/signin-assets/signin-assets/Web (mobile + desktop)/svg/light/web_light_sq_ctn.svg"
            alt="Sign in with Google"
          />
        </Button>
      </div>

      <div className="mt-6 items-center justify-center flex text-center text-sm ">
        {isRegister ? "Have a account?" : "Don't have a account?"}{" "}
        <Button
          onClick={() => setIsRegister(!isRegister)}
          children={isRegister ? "Sign In" : "Sign Up"}
          className="text-blue-500"
        />
      </div>
    </div>
  );
}
