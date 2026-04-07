import logo from "../../assets/logo.png";

export default function Footer() {
    return (
        <footer id="contato" className="bg-[#ECFFD1] pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

                    {/* Coluna 1: Logo e Descrição */}
                    <div className="flex flex-col space-y-4">
                        <img
                            src={logo}
                            alt="Logo Alto Tietê Hortaliças"
                            className="w-30"
                        />
                        <p className="text-sm text-black leading-relaxed">
                            Do campo direto para a sua mesa. Unindo o legado da produção rural com a inovação que o seu dia a dia precisa.
                        </p>
                    </div>

                    {/* Coluna 2: Contato */}
                    <div>
                        <h3 className="text-xl font-bold text-[#1C7F13] mb-6">Contato</h3>
                        <ul className="space-y-3 text-sm text-black">
                            <li><strong>Telefone:</strong> 11 97101-2069</li>
                            <li>
                                <strong>Localização:</strong> Barroso / Mogi das Cruzes <br />
                                CEP: 08769-450
                            </li>
                            <li><strong>Horário:</strong> 08:00 - 19:00</li>
                        </ul>
                    </div>

                    {/* Coluna 3: Explorar */}
                    <div>
                        <h3 className="text-xl font-bold text-[#1C7F13] mb-6">Explorar</h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <a href="#home" className="text-black hover:text-[#1C7F13] transition-colors">Home</a>
                            </li>
                            <li>
                                <a href="#sobre" className="text-black hover:text-[#1C7F13] transition-colors">Sobre Nós</a>
                            </li>
                            <li>
                                <a href="#historia" className="text-black hover:text-[#1C7F13] transition-colors">História</a>
                            </li>
                            <li>
                                <a href="#servicos" className="text-black hover:text-[#1C7F13] transition-colors">Serviços</a>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Linha Inferior de Copyright (Opcional, para melhor acabamento) */}
                <div className="border-t border-green-200 pt-8 text-center">
                    <p className="text-xs text-gray-600">
                        &copy; {new Date().getFullYear()} Alto Tietê Hortaliças. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}