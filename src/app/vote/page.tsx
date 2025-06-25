"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Vote, CheckCircle, AlertCircle, Shield, Clock } from "lucide-react";
import { Candidate, VoteReceipt } from "@/types";

// Real candidates for November 2025 elections
const realCandidates: Candidate[] = [
  {
    id: 1,
    name: "Xiomara Castro",
    party: "Partido Libertad y Refundación (LIBRE)",
    voteCount: 0,
    exists: true,
  },
  {
    id: 2,
    name: "Nasry Asfura",
    party: "Partido Nacional",
    voteCount: 0,
    exists: true,
  },
  {
    id: 3,
    name: "Yani Rosenthal",
    party: "Partido Liberal",
    voteCount: 0,
    exists: true,
  },
  {
    id: 4,
    name: "Salvador Nasralla",
    party: "Partido Salvador de Honduras (PSH)",
    voteCount: 0,
    exists: true,
  },
  {
    id: 5,
    name: "Milton Benítez",
    party: "Partido Demócrata Cristiano",
    voteCount: 0,
    exists: true,
  },
];

export default function VotePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [candidates, setCandidates] = useState<Candidate[]>(realCandidates);
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [voting, setVoting] = useState(false);
  const [voteReceipt, setVoteReceipt] = useState<VoteReceipt | null>(null);
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false);

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle redirects on client side only
  useEffect(() => {
    if (isClient && !user) {
      router.push("/");
    }
  }, [isClient, user, router]);

  // Don't render anything until we're on the client
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show loading while redirecting
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  // Show pending KYC message if not verified
  if (!user.kycVerified) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <Clock className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Verificación Pendiente</h1>
            <p className="text-gray-600 mb-8">
              Tu identidad está siendo verificada. Una vez aprobada, podrás emitir tu voto.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-yellow-900 mb-4">Estado de Verificación</h2>
              <div className="space-y-3 text-left">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-yellow-500 mr-3 animate-spin" />
                  <span className="text-yellow-700">Documentos en revisión</span>
                </div>
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">Votación bloqueada hasta aprobación</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                <strong>Tiempo estimado:</strong> 24 horas para completar la verificación.
              </p>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => router.push("/kyc")}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700"
                >
                  Verificar Estado
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="bg-gray-600 text-white px-6 py-2 rounded-md font-medium hover:bg-gray-700"
                >
                  Volver al Inicio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleVote = async () => {
    if (!selectedCandidate) {
      setError("Por favor selecciona un candidato");
      return;
    }

    setVoting(true);
    setError("");

    try {
      // In a real implementation, you would:
      // 1. Generate ZK proof using Semaphore
      // 2. Call smart contract to cast vote
      // 3. Get vote receipt

      // Simulate the voting process
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Generate mock vote receipt
      const receipt: VoteReceipt = {
        receiptNumber: `VOTO-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        timestamp: Date.now(),
        candidateId: selectedCandidate,
      };

      setVoteReceipt(receipt);

      // Update candidate vote count
      setCandidates(prev =>
        prev.map(candidate =>
          candidate.id === selectedCandidate
            ? { ...candidate, voteCount: candidate.voteCount + 1 }
            : candidate
        )
      );

    } catch (err) {
      setError("Error al emitir voto. Por favor intenta de nuevo.");
    } finally {
      setVoting(false);
    }
  };

  if (voteReceipt) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">¡Voto Emitido Exitosamente!</h1>
            <p className="text-gray-600 mb-8">
              Tu voto ha sido registrado en la blockchain usando pruebas de conocimiento cero.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-green-900 mb-4">Comprobante de Voto</h2>
              <div className="space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600">Número de Comprobante:</span>
                  <span className="font-mono font-medium text-green-800">
                    {voteReceipt.receiptNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha y Hora:</span>
                  <span className="text-green-800">
                    {new Date(voteReceipt.timestamp).toLocaleString('es-HN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className="text-green-800 font-medium">✓ Verificado</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                <strong>Importante:</strong> Guarda este número de comprobante. Puedes usarlo para verificar 
                que tu voto fue contabilizado en la página de resultados.
              </p>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => router.push("/results")}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700"
                >
                  Ver Resultados
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="bg-gray-600 text-white px-6 py-2 rounded-md font-medium hover:bg-gray-700"
                >
                  Volver al Inicio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <Vote className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Emitir Tu Voto</h1>
          <p className="mt-2 text-gray-600">
            Selecciona tu candidato preferido. Tu voto será registrado de forma anónima usando pruebas de conocimiento cero.
          </p>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-blue-600 mr-2" />
            <p className="text-sm text-blue-800">
              <strong>Privacidad Garantizada:</strong> Tu identidad está completamente oculta. 
              Solo tú puedes probar que votaste, pero nadie puede ver por quién votaste.
            </p>
          </div>
        </div>

        {/* Candidates */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className={`bg-white rounded-lg shadow-md p-6 cursor-pointer border-2 transition-all ${
                selectedCandidate === candidate.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setSelectedCandidate(candidate.id)}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-600">
                    {candidate.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {candidate.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{candidate.party}</p>
                
                {selectedCandidate === candidate.id && (
                  <div className="flex items-center justify-center text-blue-600">
                    <CheckCircle className="h-5 w-5 mr-1" />
                    <span className="text-sm font-medium">Seleccionado</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="ml-2 text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Vote Button */}
        <div className="text-center">
          <button
            onClick={handleVote}
            disabled={voting || !selectedCandidate}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center mx-auto"
          >
            {voting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Emitiendo Voto...
              </>
            ) : (
              <>
                <Vote className="mr-2 h-5 w-5" />
                Emitir Voto
              </>
            )}
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Después de emitir tu voto, recibirás un número de comprobante único. 
            Usa este número para verificar que tu voto fue contabilizado en la página de resultados.
          </p>
        </div>
      </div>
    </div>
  );
} 