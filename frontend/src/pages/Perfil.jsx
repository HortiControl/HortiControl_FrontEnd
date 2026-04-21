import React from 'react';
import { Link } from 'react-router-dom';
import {User,Mail,Phone,Lock,ArrowLeft,Save,RefreshCw} from 'lucide-react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export default function Perfil() {
    return (
        <div className="p-4 max-w-6xl">
            {/* Botão Voltar */}
            <Link
                to="/"
                className="flex items-center text-xs text-gray-500 hover:text-gray-700 mb-4 transition-colors"
            >
                <ArrowLeft size={14} className="mr-1" />
                Voltar para Dashboard
            </Link>

            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Perfil</h1>
                <p className="text-sm text-gray-500 mt-1">Gerencie suas informações pessoais</p>
            </header>

            <div className="space-y-6">
                <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-1">Informações Pessoais</h2>
                    <p className="text-sm text-gray-500 mb-8">Visualize ou altere suas informações de perfil</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <div className="relative">
                            <label className="text-sm font-bold text-gray-700 mb-2 block">Nome Completo</label>
                            <div className="relative flex items-center">
                                <User className="absolute left-4 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    defaultValue="Lucia Yamasaki"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#00a859]/20 transition-all"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="text-sm font-bold text-gray-700 mb-2 block">E-mail</label>
                            <div className="relative flex items-center">
                                <Mail className="absolute left-4 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    defaultValue="lucia@gmail.com"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#00a859]/20 transition-all"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="text-sm font-bold text-gray-700 mb-2 block">Telefone</label>
                            <div className="relative flex items-center">
                                <Phone className="absolute left-4 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    defaultValue="(11) 91234 5678"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#00a859]/20 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <button className="bg-[#00a859] hover:bg-[#008f4c] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold transition-colors cursor-pointer">
                            <Save size={18} />
                            Salvar Alterações
                        </button>
                    </div>
                </section>

                {/* Card Alterar Senha */}
                <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-1">Alterar Senha</h2>
                    <p className="text-sm text-gray-500 mb-8">Atualize sua senha para manter sua conta segura</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="relative">
                            <label className="text-sm font-bold text-gray-700 mb-2 block">Senha Atual</label>
                            <div className="relative flex items-center">
                                <Lock className="absolute left-4 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    placeholder="••••••"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#00a859]/20 transition-all"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="text-sm font-bold text-gray-700 mb-2 block">Nova Senha</label>
                            <div className="relative flex items-center">
                                <Lock className="absolute left-4 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    placeholder="Mínimo 5 Caracteres"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#00a859]/20 transition-all"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="text-sm font-bold text-gray-700 mb-2 block">Confirmar Nova Senha</label>
                            <div className="relative flex items-center">
                                <Lock className="absolute left-4 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    placeholder="Digite a senha novamente"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#00a859]/20 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <button className="bg-[#00a859] hover:bg-[#008f4c] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold transition-colors cursor-pointer">
                            <RefreshCw size={18} />
                            Atualizar Senha
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}