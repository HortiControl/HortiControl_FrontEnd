import { User, Mail, Phone, Lock } from 'lucide-react';
import { Button } from "../Button";
import banner from "../../assets/banner.png";
import logo from "../../assets/HortiControlLogo.png";
import { useState } from "react";


const CadastroCard = () => {  

    //Para realizar o envio das informações do
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Captura as informações do formulário
        const formData = new FormData(e.currentTarget);

        // Transforma em objeto json
        const dados = Object.fromEntries(formData.entries());

        console.log(dados);
        
        if (dados.senha !== dados.confirmarSenha) {
            alert("As senhas não coincidem!");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome: dados.nome,
                    email: dados.email,
                    telefone: dados.telefone,
                    senha: dados.senha
                })
            });

            console.log(response);

            if (!response.ok) throw new Error();

            alert("Cadastro realizado com sucesso!");
        }
        catch (error) {
            console.log(error.message);
            alert("Erro ao cadastrar");
        }


    };




    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat font-[Montserrat] p-4"
            style={{ backgroundImage: `url(${banner})` }}>

            <div className="w-full max-w-125 p-4 bg-white/95 backdrop-blur-sm rounded-[25px] shadow-2xl flex flex-col items-center">

                <img src={logo} alt="Logo" className="w-24 mb-4 object-contain" />

                <h2 className="text-[#333] font-bold text-3xl mb-1">Criar uma conta</h2>
                <p className="text-gray-500 text-sm mb-6 text-center">Preencha os dados abaixo para se cadastrar</p>

                <form className="w-full space-y-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold mb-1 ml-1 text-sm">Nome Completo:</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                name='nome'
                                placeholder="Seu nome"
                                className="w-full pl-10 pr-4 py-2 bg-[#e9ecef] rounded-xl border-none focus:ring-2 focus:ring-[#009951] outline-none transition-all placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold mb-1 ml-1 text-sm">E-mail:</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                name='email'
                                placeholder="exemplo@email.com"
                                className="w-full pl-10 pr-4 py-2 bg-[#e9ecef] rounded-xl border-none focus:ring-2 focus:ring-[#009951] outline-none transition-all placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold mb-1 ml-1 text-sm">Telefone (opcional):</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                maxLength={11}
                                type="text"
                                name='telefone'
                                placeholder="(11) 91234 5678"
                                className="w-full pl-10 pr-4 py-2 bg-[#e9ecef] rounded-xl border-none focus:ring-2 focus:ring-[#009951] outline-none transition-all placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold mb-1 ml-1 text-sm">Senha:</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="password"
                                name='senha'
                                placeholder="Mínimo 5 caracteres"
                                className="w-full pl-10 pr-4 py-2 bg-[#e9ecef] rounded-xl border-none focus:ring-2 focus:ring-[#009951] outline-none transition-all placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold mb-1 ml-1 text-sm">Confirmar Senha:</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="password"
                                name='confirmarSenha'
                                placeholder="Digite a senha novamente"
                                className="w-full pl-10 pr-4 py-2 bg-[#e9ecef] rounded-xl border-none focus:ring-2 focus:ring-[#009951] outline-none transition-all placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full py-3.5 mt-2 rounded-xl text-lg bg-[#009951]! hover:bg-[#007d42]! text-white "
                    >
                        Criar uma conta
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default CadastroCard;