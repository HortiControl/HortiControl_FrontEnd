export default function Servicos() {
    const servicos = [
        {
            titulo: "Mercados",
            desc: "Fornecemos para hortifrutis e redes de mercados com logística ágil e produtos de alta qualidade."
        },
        {
            titulo: "Hortaliças",
            desc: "Convencionais (25 variedades), Hidropônicas (10 variedades) e Lavadas (40 variedades)."
        },
        {
            titulo: "Região",
            desc: "Atendemos Zona Leste (Artur Alvim, Carrão), Zona Norte (Casa Verde) e Zona Oeste (Pirituba, Butantã)."
        }
    ];

    return (
        <section id="servicos" className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-4xl font-bold mb-12">Nossos serviços</h2>
                <div className="bg-white rounded-3xl p-10 shadow-xl flex flex-col md:flex-row border border-gray-100">
                    {servicos.map((s, idx) => (
                        <div
                            key={idx}
                            className={`flex-1 px-8 py-6 text-center ${idx !== servicos.length - 1 ? 'md:border-r-2 border-green-700' : ''}`}
                        >
                            <h3 className="text-2xl font-bold text-green-700 mb-4">{s.titulo}</h3>
                            <p className="text-gray-600 leading-relaxed">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}