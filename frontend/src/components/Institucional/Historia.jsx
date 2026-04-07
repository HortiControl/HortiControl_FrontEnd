import historia from "../../assets/historia.jpeg";

export default function Historia() {
    return (
        <section id="historia" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-4xl font-bold mb-12 text-gray-800">História</h2>
                <div className="flex flex-col lg:flex-row gap-12 items-center bg-[#ECFFD1] p-10 md:p-16 rounded-[20px] shadow-sm">
                    <div className="flex-1 space-y-6 text-lg text-gray-700 leading-relaxed">
                        <p>Nossa jornada começou em <strong>1999</strong>, vendendo hortaliças diretamente em <strong>feiras livres e varejões</strong>.</p>
                        <p>Após uma visita técnica ao <strong>Japão</strong>, observamos a tendência global de famílias menores e a busca por refeições rápidas.</p>
                        <p>Hoje, a <strong>Alto Tietê Hortaliças</strong> é referência em <strong>tecnologia pós-colheita</strong>, transformando o trabalho manual em um processo mecanizado de <strong>alta qualidade</strong>.</p>
                    </div>
                    <div className="w-full lg:w-100">
                        <img src={historia} alt="Nossa História" className="rounded-2xl w-full shadow-md" />
                    </div>
                </div>
            </div>
        </section>
    );
}