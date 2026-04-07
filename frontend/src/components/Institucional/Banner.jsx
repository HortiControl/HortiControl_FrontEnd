import banner from "../../assets/banner.png";

export default function Banner() {
    return (
        <section className="relative h-150 flex items-center bg-cover bg-center" style={{ backgroundImage: `url(${banner})` }}>
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
                <h1 className="text-white text-5xl md:text-6xl font-bold max-w-4xl leading-tight mb-8 pt-20">
                    Do campo direto para a sua mesa, com frescor e praticidade!
                </h1>
                <p className="text-white text-2xl font-medium max-w-2xl leading-relaxed italic">
                    Hortaliças in natura e minimamente processadas com a qualidade que sua família merece.
                </p>
            </div>
        </section>
    );
}