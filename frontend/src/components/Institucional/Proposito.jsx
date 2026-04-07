export default function Proposito() {
    const pilares = [
        {
            titulo: "Missão",
            descricao: "Entregar alimentos frescos, saudáveis e práticos, agregando valor à produção rural e facilitando a vida dos nossos consumidores."
        },
        {
            titulo: "Visão",
            descricao: "Ser referência na região no fornecimento de hortaliças processadas, mantendo o padrão de frescor direto do campo."
        },
        {
            titulo: "Valores",
            descricao: "Respeito à terra, tradição familiar, inovação tecnológica, qualidade rigorosa e compromisso com a alimentação dos brasileiros."
        }
    ];

    return (
        <section id="proposito" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-4xl font-bold mb-12 text-gray-800">Propósito</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {pilares.map((pilar, index) => (
                        <div
                            key={index}
                            className="bg-[#ECFFD1] p-10 rounded-2xl hover:shadow-md transition-shadow duration-300"
                        >
                            <h3 className="text-2xl font-bold mb-5 text-green-900">
                                {pilar.titulo}
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                {pilar.descricao}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}