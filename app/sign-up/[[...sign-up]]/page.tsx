export default function SignUpPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="text-center px-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
          </svg>
        </div>
        <h1 className="text-white text-xl font-bold mb-2">AI Creator</h1>
        <p className="text-white/40 text-sm">Configura las keys de Clerk en .env.local para activar el registro</p>
      </div>
    </main>
  );
}
