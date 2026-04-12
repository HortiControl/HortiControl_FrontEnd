import { Mail, Lock, EyeOff } from 'lucide-react';
import { Button } from "../Button";
import banner from "../../assets/banner.png";
import logo from "../../assets/HortiControlLogo.png";

const LoginCard = () => {


    //Para realizar o envio das informações do
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Captura as informações do formulário
        const formData = new FormData(e.currentTarget);

        // Transforma em objeto json
        const dados = Object.fromEntries(formData.entries());

        console.log(dados);
        
        // if (dados.senha !== dados.confirmarSenha) {
        //     alert("As senhas não coincidem!");
        //     return;
        // }

        try {
            const response = await fetch("http://localhost:8080/usuarios/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: dados.email,
                    senha: dados.senha
                }),
            });

            console.log(response);

            if (!response.ok) throw new Error();
            const token = await response.text();
            
            // Se precisar do token, dê um localStorage.getItem("token");
            localStorage.setItem("token",token);
            // console.log(token);
            alert("Login realizado com sucesso!");
        }
        catch (error) {
            console.log(error.message);
            alert("Erro ao cadastrar");
        }


    };
    
    return (

        <div className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat font-[Montserrat] p-4"
            style={{ backgroundImage: `url(${banner})` }}>

            <div className="w-full max-w-112.5 p-8 bg-white/95 backdrop-blur-sm rounded-[25px] shadow-2xl flex flex-col items-center">

                <img src={logo} alt="Logo" className="w-28 mb-4 object-contain" />

                <h2 className="text-[#333] font-bold text-3xl mb-1">Seja Bem-Vindo!</h2>
                <p className="text-gray-500 text-sm mb-8">Faça o login e acesse o sistema</p>

                <form className="w-full space-y-5" onSubmit={handleSubmit}>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold mb-1.5 ml-1 text-sm">E-mail:</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                name='email'
                                placeholder="exemplo@email.com"
                                className="w-full pl-10 pr-4 py-3 bg-[#e9ecef] rounded-xl border-none focus:ring-2 focus:ring-[#009951] outline-none transition-all placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold mb-1.5 ml-1 text-sm">Senha:</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="password"
                                name='senha'
                                placeholder="•••••"
                                className="w-full pl-10 pr-10 py-3 bg-[#e9ecef] rounded-xl border-none focus:ring-2 focus:ring-[#009951] outline-none transition-all placeholder:text-gray-400"
                            />
                            <EyeOff className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 cursor-pointer hover:text-gray-600" />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full py-3.5 rounded-xl text-lg bg-[#009951]! hover:bg-[#007d42]! text-white!"
                    >
                        Entrar
                    </Button>
                </form>

                <p className="mt-6 text-sm text-gray-600">
                    Não têm uma conta? <span className="text-[#009951] font-bold cursor-pointer hover:underline">Cadastre-se</span>
                </p>
            </div>
        </div>
    );
};

export default LoginCard;