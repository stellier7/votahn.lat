"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { Shield, Vote, Users, CheckCircle, Eye, Scale } from "lucide-react";

export default function Home() {
  const { isAuthenticated, user, login, logout } = useAuth();

  const getUserDisplayName = () => {
    if (user?.phone) {
      return `+${user.phone}`;
    }
    if (user?.email) {
      return user.email;
    }
    if (user?.walletAddress) {
      return `${user.walletAddress.slice(0, 8)}...`;
    }
    return "Usuario";
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 shadow-2xl border-b-4 border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center">
              <div className="flex items-center">
                {/* Honduras Flag SVG */}
                <div className="w-12 h-10 mr-6">
                  <img 
                    src="/images/bandera-honduras-svg.svg" 
                    alt="Bandera de Honduras" 
                    className="w-full h-full object-contain drop-shadow-lg"
                  />
                </div>
                <div className="text-white">
                  <h1 className="text-3xl font-bold tracking-tight">Elecciones Honduras 2025</h1>
                  <p className="text-sm text-blue-200 font-medium">Transparencia y Democracia Digital</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-white font-medium bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                    Bienvenido, {getUserDisplayName()}
                  </span>
                  <button
                    onClick={logout}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-red-700 transition-all duration-200 border border-white/20 shadow-lg hover:shadow-xl"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <button
                  onClick={login}
                  className="bg-white text-blue-900 px-8 py-3 rounded-lg text-sm font-bold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Iniciar Sesión
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white sm:text-7xl drop-shadow-2xl mb-6">
            Transparencia Electoral para{" "}
            <span className="text-yellow-300 font-extrabold">Honduras</span>
          </h1>
          <p className="mt-8 text-xl text-white/95 max-w-4xl mx-auto drop-shadow-lg leading-relaxed">
            Luchamos contra el fraude electoral con tecnología blockchain avanzada. 
            Cada voto es transparente, verificable e inmutable.
          </p>
          
          {isAuthenticated ? (
            <div className="mt-12 flex justify-center space-x-6">
              {user?.kycVerified ? (
                <Link
                  href="/vote"
                  className="bg-blue-700 text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-blue-800 flex items-center transition-all duration-200 shadow-xl hover:shadow-2xl border border-white/20 transform hover:scale-105"
                >
                  <Vote className="mr-3 h-6 w-6" />
                  Emitir Voto
                </Link>
              ) : (
                <Link
                  href="/kyc"
                  className="bg-green-600 text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-green-700 flex items-center transition-all duration-200 shadow-xl hover:shadow-2xl border border-white/20 transform hover:scale-105"
                >
                  <CheckCircle className="mr-3 h-6 w-6" />
                  Completar Verificación
                </Link>
              )}
              <Link
                href="/results"
                className="bg-white/20 backdrop-blur-sm text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-white/30 flex items-center transition-all duration-200 shadow-xl hover:shadow-2xl border border-white/30 transform hover:scale-105"
              >
                <Users className="mr-3 h-6 w-6" />
                Ver Resultados
              </Link>
            </div>
          ) : (
            <div className="mt-12 flex justify-center">
              <button
                onClick={login}
                className="bg-white text-blue-900 px-12 py-4 rounded-xl text-lg font-bold hover:bg-blue-50 transition-all duration-200 shadow-xl hover:shadow-2xl border border-blue-200 transform hover:scale-105"
              >
                Iniciar Sesión
              </button>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="text-center bg-white/15 backdrop-blur-md rounded-2xl p-8 border border-white/25 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="bg-blue-100/30 rounded-full p-6 w-20 h-20 mx-auto flex items-center justify-center mb-6">
              <Eye className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Transparencia Total</h3>
            <p className="text-white/90 leading-relaxed">
              Cada voto es visible y verificable en la blockchain. Eliminamos la opacidad del proceso electoral tradicional.
            </p>
          </div>
          
          <div className="text-center bg-white/15 backdrop-blur-md rounded-2xl p-8 border border-white/25 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="bg-green-100/30 rounded-full p-6 w-20 h-20 mx-auto flex items-center justify-center mb-6">
              <Scale className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Lucha Contra el Fraude</h3>
            <p className="text-white/90 leading-relaxed">
              Tecnología blockchain inmutable que previene la manipulación de votos y garantiza la integridad electoral.
            </p>
          </div>
          
          <div className="text-center bg-white/15 backdrop-blur-md rounded-2xl p-8 border border-white/25 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="bg-purple-100/30 rounded-full p-6 w-20 h-20 mx-auto flex items-center justify-center mb-6">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Democracia Digital</h3>
            <p className="text-white/90 leading-relaxed">
              Modernizamos el sistema electoral hondureño con tecnología de vanguardia para una democracia más fuerte.
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-32">
          <h2 className="text-4xl font-bold text-center text-white mb-16 drop-shadow-2xl">
            Cómo Garantizamos la Transparencia
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center bg-white/15 backdrop-blur-md rounded-2xl p-8 border border-white/25 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="bg-blue-700 text-white rounded-full w-16 h-16 mx-auto flex items-center justify-center text-2xl font-bold mb-6 shadow-lg">
                1
              </div>
              <h3 className="text-lg font-bold text-white mb-4">Identidad Verificada</h3>
              <p className="text-white/90 leading-relaxed">
                Verificación biométrica para prevenir votos duplicados
              </p>
            </div>
            
            <div className="text-center bg-white/15 backdrop-blur-md rounded-2xl p-8 border border-white/25 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="bg-blue-700 text-white rounded-full w-16 h-16 mx-auto flex items-center justify-center text-2xl font-bold mb-6 shadow-lg">
                2
              </div>
              <h3 className="text-lg font-bold text-white mb-4">Voto Inmutable</h3>
              <p className="text-white/90 leading-relaxed">
                Cada voto se registra en blockchain para evitar alteraciones
              </p>
            </div>
            
            <div className="text-center bg-white/15 backdrop-blur-md rounded-2xl p-8 border border-white/25 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="bg-blue-700 text-white rounded-full w-16 h-16 mx-auto flex items-center justify-center text-2xl font-bold mb-6 shadow-lg">
                3
              </div>
              <h3 className="text-lg font-bold text-white mb-4">Verificación Pública</h3>
              <p className="text-white/90 leading-relaxed">
                Cualquier ciudadano puede verificar que su voto fue contabilizado
              </p>
            </div>
            
            <div className="text-center bg-white/15 backdrop-blur-md rounded-2xl p-8 border border-white/25 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="bg-blue-700 text-white rounded-full w-16 h-16 mx-auto flex items-center justify-center text-2xl font-bold mb-6 shadow-lg">
                4
              </div>
              <h3 className="text-lg font-bold text-white mb-4">Resultados Transparentes</h3>
              <p className="text-white/90 leading-relaxed">
                Conteo en tiempo real sin posibilidad de manipulación
              </p>
            </div>
          </div>
        </div>

        {/* Anti-fraud section */}
        <div className="mt-32 bg-white/15 backdrop-blur-md rounded-3xl p-12 border border-white/25 shadow-2xl">
          <div className="text-center">
            <Scale className="h-20 w-20 text-yellow-300 mx-auto mb-8 drop-shadow-lg" />
            <h2 className="text-4xl font-bold text-white mb-6">Cero Tolerancia al Fraude</h2>
            <p className="text-xl text-white/95 mb-12 max-w-5xl mx-auto leading-relaxed">
              Nuestro sistema elimina las vulnerabilidades del voto tradicional. 
              Cada voto es único, verificable e imposible de manipular.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="bg-red-500/20 rounded-2xl p-6 border border-red-300/30 shadow-lg">
                <h3 className="font-bold text-white mb-4 text-lg">❌ Eliminamos</h3>
                <ul className="text-white/90 text-base space-y-3">
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    Votos duplicados
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    Manipulación de urnas
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    Conteos falsos
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    Votos de personas fallecidas
                  </li>
                </ul>
              </div>
              <div className="bg-green-500/20 rounded-2xl p-6 border border-green-300/30 shadow-lg">
                <h3 className="font-bold text-white mb-4 text-lg">✅ Garantizamos</h3>
                <ul className="text-white/90 text-base space-y-3">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    Un voto por persona
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    Transparencia total
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    Verificación pública
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    Resultados inmutables
                  </li>
                </ul>
              </div>
              <div className="bg-blue-500/20 rounded-2xl p-6 border border-blue-300/30 shadow-lg">
                <h3 className="font-bold text-white mb-4 text-lg">🔒 Protegemos</h3>
                <ul className="text-white/90 text-base space-y-3">
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    Privacidad del votante
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    Integridad electoral
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    Democracia hondureña
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    Confianza ciudadana
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
