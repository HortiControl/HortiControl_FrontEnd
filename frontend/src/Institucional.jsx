import Header from "./components/Institucional/Header"
import Banner from "./components/Institucional/Banner"
import Sobre from "./components/Institucional/Sobre"
import Historia from "./components/Institucional/Historia"
import Proposito from "./components/Institucional/Proposito"
import Servicos from "./components/Institucional/Servicos"
import Footer from "./components/Institucional/Footer"

function Institucional() {
  return (
    <div className="font-[Montserrat]">
      <Header />
      <Banner />
      <Sobre />
      <Historia />
      <Proposito />
      <Servicos />
      <Footer />
    </div>
  );
}

export default Institucional