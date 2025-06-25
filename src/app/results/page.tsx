"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { BarChart3, Search, CheckCircle, AlertCircle, Users } from "lucide-react";
import { Candidate } from "@/types";

// Real candidates with mock vote counts
const candidatesWithVotes: Candidate[] = [
  {
    id: 1,
    name: "Xiomara Castro",
    party: "Partido Libertad y Refundación (LIBRE)",
    voteCount: 1852347,
    exists: true,
  },
  {
    id: 2,
    name: "Nasry Asfura",
    party: "Partido Nacional",
    voteCount: 1428765,
    exists: true,
  },
  {
    id: 3,
    name: "Yani Rosenthal",
    party: "Partido Liberal",
    voteCount: 987432,
    exists: true,
  },
  {
    id: 4,
    name: "Salvador Nasralla",
    party: "Partido Salvador de Honduras (PSH)",
    voteCount: 654789,
    exists: true,
  },
  {
    id: 5,
    name: "Milton Benítez",
    party: "Partido Demócrata Cristiano",
    voteCount: 234567,
    exists: true,
  },
];

export default function ResultsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [receiptNumber, setReceiptNumber] = useState("");
  const [verificationResult, setVerificationResult] = useState<{
    found: boolean;
    timestamp?: string;
    candidateId?: number;
  } | null>(null);
  const [verifying, setVerifying] = useState(false);

  const totalVotes = candidatesWithVotes.reduce((sum, candidate) => sum + candidate.voteCount, 0);

  const handleVerifyReceipt = async () => {
    if (!receiptNumber.trim()) return;

    setVerifying(true);
    setVerificationResult(null);

    try {
      // Simulate verification process
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock verification - in real app this would check the blockchain
      const mockResult = {
        found: Math.random() > 0.3, // 70% chance of finding the receipt
        timestamp: new Date(Date.now() - Math.random() * 86400000).toLocaleString('es-HN'),
        candidateId: Math.floor(Math.random() * 5) + 1,
      };

      setVerificationResult(mockResult);
    } catch (error) {
      setVerificationResult({ found: false });
    } finally {
      setVerifying(false);
    }
  };

  const getCandidateName = (id: number) => {
    const candidate = candidatesWithVotes.find(c => c.id === id);
    return candidate ? candidate.name : "Candidato no encontrado";
  };

  const getPercentage = (votes: number) => {
    return ((votes / totalVotes) * 100).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Resultados Electorales</h1>
          <p className="mt-2 text-gray-600">
            Resultados en tiempo real de las elecciones presidenciales de Honduras 2025
          </p>
        </div>

        {/* Total Votes Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h2 className="text-2xl font-bold text-gray-900">
              {totalVotes.toLocaleString('es-HN')}
            </h2>
            <p className="text-gray-600">Total de Votos Emitidos</p>
          </div>
        </div>

        {/* Results Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Resultados por Candidato</h2>
          <div className="space-y-4">
            {candidatesWithVotes.map((candidate) => (
              <div key={candidate.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                    <p className="text-sm text-gray-600">{candidate.party}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">
                      {candidate.voteCount.toLocaleString('es-HN')}
                    </div>
                    <div className="text-sm text-gray-600">
                      {getPercentage(candidate.voteCount)}%
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${getPercentage(candidate.voteCount)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vote Receipt Verification */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Verificar Mi Voto</h2>
          <p className="text-gray-600 mb-4">
            Ingresa tu número de comprobante para verificar que tu voto fue contabilizado correctamente.
          </p>

          <div className="flex space-x-4 mb-6">
            <input
              type="text"
              value={receiptNumber}
              onChange={(e) => setReceiptNumber(e.target.value)}
              placeholder="Ej: VOTO-1234567890-ABC123DEF"
              className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleVerifyReceipt}
              disabled={verifying || !receiptNumber.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
            >
              {verifying ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Verificando...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Verificar
                </>
              )}
            </button>
          </div>

          {/* Verification Result */}
          {verificationResult && (
            <div className={`border rounded-lg p-4 ${
              verificationResult.found 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center">
                {verificationResult.found ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                )}
                <span className={`font-medium ${
                  verificationResult.found ? 'text-green-800' : 'text-red-800'
                }`}>
                  {verificationResult.found 
                    ? '¡Voto Verificado!' 
                    : 'Comprobante no encontrado'
                  }
                </span>
              </div>
              
              {verificationResult.found && (
                <div className="mt-3 space-y-1 text-sm">
                  <p className="text-green-700">
                    <strong>Fecha de emisión:</strong> {verificationResult.timestamp}
                  </p>
                  <p className="text-green-700">
                    <strong>Candidato votado:</strong> {getCandidateName(verificationResult.candidateId!)}
                  </p>
                  <p className="text-green-700">
                    <strong>Estado:</strong> ✓ Contabilizado en la blockchain
                  </p>
                </div>
              )}
              
              {!verificationResult.found && (
                <p className="mt-2 text-sm text-red-700">
                  El número de comprobante ingresado no fue encontrado en nuestros registros. 
                  Verifica que el número sea correcto o contacta soporte si crees que hay un error.
                </p>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h3 className="text-sm font-medium text-blue-900 mb-2">¿Cómo funciona la verificación?</h3>
            <p className="text-sm text-blue-700">
              Cada voto emitido genera un número de comprobante único que se registra en la blockchain. 
              Este sistema garantiza que tu voto fue contabilizado sin revelar tu identidad o preferencia electoral.
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.push("/")}
            className="bg-gray-600 text-white px-6 py-2 rounded-md font-medium hover:bg-gray-700"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  );
} 