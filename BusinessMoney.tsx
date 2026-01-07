
import React, { useState } from 'react';
import { Edit, Image as ImageIcon, UploadCloud, Loader2, Wand2 } from 'lucide-react';
import Card from '../Card';
import { editImage } from '../services/geminiService';

const BusinessMoney: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
        setEditedImage(null);
        setError(null);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  
  const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });

  const handleEdit = async () => {
    if (!file || !prompt) {
      setError("Please select an image and enter a prompt.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setEditedImage(null);
    try {
      const base64Image = await toBase64(file);
      const result = await editImage(base64Image, file.type, prompt);
      if (result) {
        setEditedImage(`data:${file.type};base64,${result}`);
      } else {
        setError("Failed to edit image. The result was empty.");
      }
    } catch (err) {
      console.error("Image editing failed:", err);
      setError("An error occurred during image editing.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 animate-fade-in">
      <h1 className="text-4xl font-bold mb-6 text-business-primary flex items-center gap-3">
        <Edit size={36} /> Business Image Editor
      </h1>
      <Card className="p-6">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold text-white">1. Upload Image</h2>
            <div className="relative border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
              <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <div className="flex flex-col items-center justify-center">
                <UploadCloud className="w-12 h-12 text-gray-500" />
                <p className="mt-2 text-sm text-gray-400">Drag & drop or click to upload</p>
                <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-white mt-4">2. Describe Your Edit</h2>
             <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'remove the background', 'add a retro filter'"
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!originalImage}
            />
             <button
                onClick={handleEdit}
                disabled={isLoading || !originalImage || !prompt}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:bg-gray-500"
            >
                {isLoading ? <Loader2 className="animate-spin" /> : <Wand2 />}
                {isLoading ? 'Generating...' : 'Apply Edit with Gemini'}
            </button>
             {error && <p className="text-red-400 text-sm">{error}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <h3 className="text-lg font-semibold text-center mb-2">Original</h3>
              <div className="aspect-square bg-gray-900/50 rounded-lg flex items-center justify-center border border-gray-700">
                {originalImage ? <img src={originalImage} alt="Original" className="max-h-full max-w-full object-contain rounded-lg" /> : <ImageIcon className="w-16 h-16 text-gray-600" />}
              </div>
            </div>
             <div>
              <h3 className="text-lg font-semibold text-center mb-2">Edited</h3>
              <div className="aspect-square bg-gray-900/50 rounded-lg flex items-center justify-center border border-gray-700">
                {isLoading ? <Loader2 className="animate-spin text-blue-400" size={40}/> : editedImage ? <img src={editedImage} alt="Edited" className="max-h-full max-w-full object-contain rounded-lg" /> : <ImageIcon className="w-16 h-16 text-gray-600" />}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BusinessMoney;
