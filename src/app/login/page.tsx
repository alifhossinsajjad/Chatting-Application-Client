import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-x-hidden overflow-y-auto bg-[#0a0d17] py-12">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
        {/* Abstract lines simulation (like figma background) */}
        <div className="absolute w-[800px] h-[800px] border border-white/5 rounded-full" />
        <div className="absolute w-[1000px] h-[1000px] border border-white/5 rounded-full" />
        <div className="absolute w-[1200px] h-[1200px] border border-white/5 rounded-full" />
      </div>

      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />
      
      {/* The form component */}
      <div className="relative z-10 w-full flex justify-center px-4">
        <LoginForm />
      </div>
    </div>
  );
}
