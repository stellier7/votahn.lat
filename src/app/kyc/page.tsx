"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Upload, CheckCircle, AlertCircle, Camera, Clock, QrCode, User, Smartphone, X, ArrowLeft, ArrowRight } from "lucide-react";
import { KYCData } from "@/types";

type KYCStep = 'personal' | 'front' | 'back' | 'qr' | 'face' | 'pending';

interface PersonalData {
  firstName: string;
  lastName: string;
  identityNumber: string;
}

export default function KYCPage() {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState<KYCStep>('personal');
  const [personalData, setPersonalData] = useState<PersonalData>({
    firstName: '',
    lastName: '',
    identityNumber: '',
  });
  const [kycData, setKycData] = useState<KYCData>({
    idDocument: null,
    idDocumentBack: null,
    qrCode: null,
    selfie: null,
  });
  const [uploading, setUploading] = useState(false);
  const [kycStatus, setKycStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null);
  const [error, setError] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [isClient, setIsClient] = useState(false);

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Generate session ID for mobile connection
  useEffect(() => {
    if (isClient) {
      setSessionId(`kyc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    }
  }, [isClient]);

  // Handle redirects on client side only
  useEffect(() => {
    if (isClient) {
      if (!user) {
        router.push("/");
      } else if (user.kycVerified) {
        router.push("/vote");
      }
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

  // Show loading while redirecting to vote
  if (user.kycVerified) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirigiendo a votación...</p>
        </div>
      </div>
    );
  }

  const handleFileUpload = (field: keyof KYCData, file: File) => {
    setKycData(prev => ({
      ...prev,
      [field]: file,
    }));
    setError("");
  };

  const handleNextStep = () => {
    switch (currentStep) {
      case 'personal':
        if (personalData.firstName && personalData.lastName && personalData.identityNumber) {
          setCurrentStep('front');
        }
        break;
      case 'front':
        if (kycData.idDocument) {
          setCurrentStep('back');
        }
        break;
      case 'back':
        if (kycData.idDocumentBack) {
          setCurrentStep('qr');
        }
        break;
      case 'qr':
        if (kycData.qrCode) {
          setCurrentStep('face');
        }
        break;
      case 'face':
        if (kycData.selfie) {
          handleSubmitKYC();
        }
        break;
    }
  };

  const handlePreviousStep = () => {
    switch (currentStep) {
      case 'front':
        setCurrentStep('personal');
        break;
      case 'back':
        setCurrentStep('front');
        break;
      case 'qr':
        setCurrentStep('back');
        break;
      case 'face':
        setCurrentStep('qr');
        break;
    }
  };

  const handleSubmitKYC = async () => {
    setUploading(true);
    setError("");

    try {
      // Simulate the upload process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Set KYC status to pending
      setKycStatus('pending');
      setCurrentStep('pending');
      updateUser({
        kycVerified: false, // Will be true once approved
        kycDocuments: {
          idDocument: "ipfs://mock-id-document-hash",
          selfie: "ipfs://mock-selfie-hash",
        },
      });

    } catch (err) {
      setError("Error al subir documentos. Por favor intenta de nuevo.");
    } finally {
      setUploading(false);
    }
  };

  const getStepInfo = () => {
    switch (currentStep) {
      case 'personal':
        return {
          title: "Datos Personales",
          description: "Ingresa tu información personal para comenzar la verificación",
          stepNumber: 1,
          totalSteps: 5
        };
      case 'front':
        return {
          title: "Frente de la Cédula",
          description: "Toma una foto clara del frente de tu cédula de identidad",
          stepNumber: 2,
          totalSteps: 5
        };
      case 'back':
        return {
          title: "Reverso de la Cédula", 
          description: "Toma una foto clara del reverso de tu cédula de identidad",
          stepNumber: 3,
          totalSteps: 5
        };
      case 'qr':
        return {
          title: "Código QR",
          description: "Escanea el código QR de tu cédula para verificación automática",
          stepNumber: 4,
          totalSteps: 5
        };
      case 'face':
        return {
          title: "Verificación Facial",
          description: "Toma una selfie clara para verificar tu identidad",
          stepNumber: 5,
          totalSteps: 5
        };
      default:
        return null;
    }
  };

  const currentStepInfo = getStepInfo();

  // Show pending status
  if (kycStatus === 'pending') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="relative inline-block">
                <Clock className="h-16 w-16 text-yellow-500 mx-auto mb-4 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Verificación en Proceso</h1>
            <p className="text-gray-600 mb-8">
              Tus documentos han sido enviados para verificación. 
              Este proceso puede tomar hasta 24 horas.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-yellow-900 mb-4">Estado Actual</h2>
              <div className="space-y-3 text-left">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-green-700">Documentos subidos correctamente</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-yellow-500 mr-3 animate-spin" />
                  <span className="text-yellow-700">En revisión por el equipo de verificación</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                <strong>Nota:</strong> Puedes ver las elecciones mientras esperas la verificación, 
                pero no podrás votar hasta que tu identidad sea aprobada.
              </p>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => router.push("/vote")}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700"
                >
                  Ver Elecciones
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-8">
            <Camera className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">Verificación de Identidad</h1>
            <p className="mt-2 text-gray-600">
              Completa la verificación para poder emitir tu voto de forma segura
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">¿Por qué necesitamos verificar tu identidad?</h2>
            <div className="space-y-2 text-left text-sm text-blue-800">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>Garantizar que solo voten ciudadanos hondureños</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>Prevenir votos duplicados</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>Mantener la integridad del proceso electoral</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 flex items-center mx-auto"
          >
            <Camera className="mr-2 h-5 w-5" />
            Comenzar Verificación
          </button>

          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              El proceso toma aproximadamente 5 minutos y tus datos están protegidos con encriptación de nivel bancario.
            </p>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-8">
            <button
              onClick={() => router.push("/")}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              ← Volver al Inicio
            </button>
          </div>
        </div>
      </div>

      {/* KYC Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center">
                <Camera className="h-6 w-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">Verificación de Identidad</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Progress Bar */}
            {currentStepInfo && (
              <div className="px-6 py-4 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Paso {currentStepInfo.stepNumber} de {currentStepInfo.totalSteps}
                  </span>
                  <span className="text-sm text-gray-500">
                    {Math.round((currentStepInfo.stepNumber / currentStepInfo.totalSteps) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStepInfo.stepNumber / currentStepInfo.totalSteps) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Modal Content */}
            <div className="p-6">
              {currentStepInfo && (
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{currentStepInfo.title}</h3>
                  <p className="text-gray-600 text-sm">{currentStepInfo.description}</p>
                </div>
              )}

              {/* Step Content */}
              {currentStep === 'personal' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={personalData.firstName}
                      onChange={(e) => setPersonalData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellido
                    </label>
                    <input
                      type="text"
                      value={personalData.lastName}
                      onChange={(e) => setPersonalData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tu apellido"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de Identidad
                    </label>
                    <input
                      type="text"
                      value={personalData.identityNumber}
                      onChange={(e) => setPersonalData(prev => ({ ...prev, identityNumber: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ej: 0801-1990-12345"
                    />
                  </div>
                </div>
              )}

              {(currentStep === 'front' || currentStep === 'back' || currentStep === 'qr' || currentStep === 'face') && (
                <div>
                  {/* Mobile Connection Option */}
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Smartphone className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="text-blue-800 text-sm font-medium">¿Usando computadora?</span>
                      </div>
                      <button
                        onClick={() => setShowQR(!showQR)}
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                      >
                        {showQR ? 'Ocultar' : 'Conectar con celular'}
                      </button>
                    </div>
                    
                    {showQR && (
                      <div className="mt-3 text-center">
                        <div className="bg-white p-3 rounded-lg inline-block">
                          <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                            <QrCode className="h-16 w-16 text-gray-400" />
                          </div>
                          <p className="text-xs text-gray-600">
                            Escanea con tu celular
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      accept={currentStep === 'face' ? ".jpg,.jpeg,.png" : ".jpg,.jpeg,.png,.pdf"}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const field = currentStep === 'front' ? 'idDocument' : 
                                       currentStep === 'back' ? 'idDocumentBack' :
                                       currentStep === 'qr' ? 'qrCode' : 'selfie';
                          handleFileUpload(field as keyof KYCData, file);
                        }
                      }}
                      className="hidden"
                      id={`file-upload-${currentStep}`}
                    />
                    <label htmlFor={`file-upload-${currentStep}`} className="cursor-pointer">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Haz clic para subir archivo
                      </p>
                    </label>
                  </div>

                  {/* File Preview */}
                  {((currentStep === 'front' && kycData.idDocument) ||
                    (currentStep === 'back' && kycData.idDocumentBack) ||
                    (currentStep === 'qr' && kycData.qrCode) ||
                    (currentStep === 'face' && kycData.selfie)) && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-green-700 text-sm font-medium">
                          ✓ Archivo subido correctamente
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-3">
                  <div className="flex">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <p className="ml-2 text-sm text-red-600">{error}</p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={handlePreviousStep}
                  disabled={currentStep === 'personal'}
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Anterior
                </button>
                
                <button
                  onClick={handleNextStep}
                  disabled={uploading || 
                    (currentStep === 'personal' && (!personalData.firstName || !personalData.lastName || !personalData.identityNumber)) ||
                    (currentStep === 'front' && !kycData.idDocument) ||
                    (currentStep === 'back' && !kycData.idDocumentBack) ||
                    (currentStep === 'qr' && !kycData.qrCode) ||
                    (currentStep === 'face' && !kycData.selfie)
                  }
                  className="flex items-center bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Procesando...
                    </>
                  ) : currentStep === 'face' ? (
                    "Completar Verificación"
                  ) : (
                    <>
                      Siguiente
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 