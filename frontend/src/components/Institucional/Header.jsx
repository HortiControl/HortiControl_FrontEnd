import logo from "../../assets/logo.png";

export default function Header() {
    return (
        <header className="absolute top-0 left-0 w-full z-50 py-6">
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <div className="shrink-0">
                    <img src={logo} alt="Logo" className="w-37.5" />
                </div>

                <nav className="hidden lg:flex gap-10">
                    {['Sobre nós', 'História', 'Propósito', 'Serviços', 'Contato'].map((link) => (
                        <a
                            key={link}
                            href={`#${link.toLowerCase().split(' ')[0]}`}
                            className="text-white text-xl font-medium hover:text-green-300 transition-colors"
                        >
                            {link}
                        </a>
                    ))}
                </nav>

                <div className="flex gap-4">
                    <button className="px-7 py-2 bg-yellow-100 rounded-full text-black text-xl font-medium hover:bg-yellow-300 hover:text-black transition">
                        Entrar
                    </button>
                    <button className="px-7 py-2 bg-green-600 rounded-full text-white text-xl font-bold hover:bg-green-700 transition shadow-md">
                        Cadastrar
                    </button>
                </div>
            </div>
        </header>
    );
}