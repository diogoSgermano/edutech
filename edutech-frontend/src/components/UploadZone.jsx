import React, { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function UploadZone({ onUpload, loading }) {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      onUpload(selectedFile);
    } else {
      alert('Apenas arquivos PDF são aceitos.');
      setFile(null);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      onUpload(droppedFile);
    } else {
      alert('Apenas arquivos PDF são aceitos.');
      setFile(null);
    }
  };

  const handleClick = () => {
    if (!loading) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      style={{
        border: `2px dashed ${loading ? 'var(--gray-200)' : 'var(--green-300)'}`,
        borderRadius: 'var(--radius-xl)',
        padding: '40px 24px',
        textAlign: 'center',
        cursor: loading ? 'not-allowed' : 'pointer',
        background: loading ? 'var(--gray-50)' : 'var(--white)',
        transition: 'all var(--t-normal)',
        userSelect: 'none',
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="application/pdf"
        style={{ display: 'none' }}
        disabled={loading}
      />

      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'var(--green-100)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          transition: 'background var(--t-normal)',
        }}
      >
        {loading ? (
          <Spinner />
        ) : (
          <Upload size={28} color="var(--green-600)" />
        )}
      </div>

      {loading ? (
        <>
          <p style={{ fontWeight: 700, fontSize: 'var(--fs-lg)', color: 'var(--green-700)', margin: 0 }}>
            Processando com IA…
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)', marginTop: 6 }}>
            Extraindo texto e gerando resumo via RAG. Isso pode levar alguns instantes.
          </p>
        </>
      ) : (
        <>
          <p style={{ fontWeight: 700, fontSize: 'var(--fs-lg)', color: 'var(--text-primary)', margin: 0 }}>
            Arraste seu PDF aqui
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)', marginTop: 6, marginBottom: 16 }}>
            ou clique para selecionar um arquivo do seu computador
          </p>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'var(--green-600)',
              color: '#fff',
              padding: '9px 22px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: 'var(--fs-sm)',
              boxShadow: 'var(--shadow-green)',
              transition: 'background var(--t-fast)',
            }}
          >
            <Upload size={15} />
            Selecionar PDF
          </div>

          <p
            style={{
              marginTop: 14,
              fontSize: 'var(--fs-xs)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              justifyContent: 'center',
            }}
          >
            <AlertCircle size={11} />
            Apenas arquivos .pdf — tamanho máximo recomendado: 50 MB
          </p>
        </>
      )}

      {file && !loading && (
        <div
          style={{
            marginTop: 14,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 'var(--fs-xs)',
            color: 'var(--green-700)',
            background: 'var(--green-100)',
            padding: '4px 10px',
            borderRadius: 99,
          }}
        >
          <CheckCircle2 size={12} />
          {file.name}
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <span
      style={{
        width: 28,
        height: 28,
        border: '3px solid var(--green-300)',
        borderTopColor: 'var(--green-600)',
        borderRadius: '50%',
        display: 'inline-block',
        animation: 'spin .8s linear infinite',
      }}
    />
  );
}