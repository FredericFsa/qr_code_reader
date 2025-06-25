// @ts-nocheck
import { useState } from 'react';
import jsQR from 'jsqr';
import { Canvg } from 'canvg';

export default function QRCodeReader() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [decodedInfo, setDecodedInfo] = useState(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileType = file.type;
    const reader = new FileReader();

    reader.onload = async (e) => {
      const content = e.target.result;
      if (fileType === 'image/svg+xml') {
  setImagePreview(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(content)}`);
} else {
  setImagePreview(content);
}


      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (fileType === 'image/svg+xml') {
        canvas.width = 512;
        canvas.height = 512;
        const v = await Canvg.fromString(context, content);
        await v.render();
        processQR(canvas);
      } else {
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0);
          processQR(canvas);
        };
        img.onerror = () => setError("Erreur de chargement de l'image");
        img.src = content;
      }
    };

    if (fileType === 'image/svg+xml') {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  };

  const processQR = (canvas) => {
    try {
      const context = canvas.getContext('2d');
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, canvas.width, canvas.height);
      if (code) {
        setResult(code.data);
        setDecodedInfo(parseQRCode(code.data));
        setError(null);
      } else {
        setResult(null);
        setDecodedInfo(null);
        setError("QR code non détecté.");
      }
    } catch (err) {
      setResult(null);
      setError("Erreur lors du traitement de l'image.");
    }
  };

  const parseQRCode = (text) => {
    if (text.startsWith("WIFI:")) {
      const parts = {};
      text
        .replace("WIFI:", "")
        .split(";")
        .forEach((chunk) => {
          const [k, v] = chunk.split(":");
          if (k && v) parts[k] = v;
        });

      return `🔐 Réseau Wi-Fi : ${parts.S || "?"}
🔑 Mot de passe : ${parts.P || "?"}
🔒 Sécurité : ${parts.T || "?"}`;
    }

    if (text.startsWith("http")) {
      return `🔗 Lien détecté : ${text}`;
    }

    return `📝 Texte : ${text}`;
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/svg+xml"
        onChange={handleImageUpload}
        className="w-full border p-2 rounded"
      />

      {imagePreview && (
        <img
          src={imagePreview}
          alt="QR preview"
          className="mx-auto border rounded max-h-64"
        />
      )}

      {result && (
        <div className="p-4 bg-green-100 text-green-800 rounded">
          <strong>Brut :</strong> <code className="break-all">{result}</code>
          <br />
          <strong>Interprété :</strong> <pre className="whitespace-pre-wrap">{decodedInfo}</pre>
        </div>
      )}
      {error && <p className="text-red-600">❌ {error}</p>}
    </div>
  );
}
