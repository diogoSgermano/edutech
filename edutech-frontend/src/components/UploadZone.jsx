import React, { useState } from 'react';
import { Upload, FileText, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadPDF, generateAudio } from '../services/api';

export default function UploadZone({ onUploadSuccess }) {
  const [isUploading, setIsUploading] = useState(false);
  const [processingStage, setProcessingStage] = useState('idle'); // idle, uploading, summarizing, audio
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    console.log("Arquivo detectado:", file?.name);
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Por favor, selecione um arquivo PDF.');
      return;
    }

    const loadingToast = toast.loading('Processando PDF e gerando resumo...');
    setIsUploading(true);
    setProcessingStage('uploading');
    setProgress(0);

    try {
      console.log("Iniciando upload para o servidor...");
      const data = await uploadPDF(file, (p) => {
        setProgress(p);
        if (p === 100) setProcessingStage('summarizing');
      });

      // Fase 2: Geração de Áudio
      setProcessingStage('audio');
      console.log("Gerando áudio do resumo...");
      await generateAudio(data.file_id);

      console.log("Upload concluído com sucesso:", data);
      
      toast.success('Resumo e áudio finalizados com êxito!', { 
        id: loadingToast,
        duration: 4000 
      });

      if (onUploadSuccess) onUploadSuccess(data);
    } catch (error) {
      console.error("Erro no upload:", error);
      toast.error(`Erro: ${error.response?.data?.detail || 'Erro ao processar o documento'}`, { id: loadingToast });
    } finally {
      setIsUploading(false);
      setProcessingStage('idle');
      setProgress(0);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full p-10 border-2 border-dashed border-blue-300 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer relative">
      <input
        type="file"
        className={`absolute inset-0 w-full h-full opacity-0 z-10 ${isUploading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        onChange={handleFileChange}
        accept=".pdf"
        disabled={isUploading}
      />

      {isUploading ? (
        <div className="flex flex-col items-center gap-4 text-blue-600">
          <Loader2 className="w-12 h-12 animate-spin" />
          <div className="text-center">
            <p className="text-lg font-semibold">
              {processingStage === 'uploading' && 'Enviando PDF...'}
              {processingStage === 'summarizing' && 'A IA está lendo e resumindo...'}
              {processingStage === 'audio' && 'Transformando resumo em áudio...'}
            </p>
            <p className="text-sm text-blue-400">
              {processingStage === 'uploading' ? `Progresso: ${progress}%` : 'Quase pronto...'}
            </p>
            <div className="w-48 h-2 bg-blue-200 rounded-full mt-3 overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 pointer-events-none">
        <div className="p-4 bg-white rounded-full shadow-sm">
          <Upload className="w-8 h-8 text-blue-600" />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">
            Clique ou arraste seu PDF aqui
          </p>
          <p className="text-sm text-gray-500">
            Apenas arquivos PDF são aceitos para resumo inteligente
          </p>
        </div>
      </div>
      )}
    </div>
  );
}