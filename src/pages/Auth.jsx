import AuthForm from "@/components/AuthForm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Auth = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-6 mt-16">
        <div className="w-full max-w-md">
          <AuthForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth; 