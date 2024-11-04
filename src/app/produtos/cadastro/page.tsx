"use client"

import React, { useState } from 'react';

const CadastroProdutoPage = () => {
  const [formData, setFormData] = useState({
    marca: '',
    nome: '',
    descricao: '',
    preco: ''
  });
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'preco') {
      // Permite apenas números e um único ponto decimal
      if (value === '' || /^\d*\.?\d*$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const errors = [];
    
    Object.entries(formData).forEach(([key, value]) => {
      if (!value.toString().trim()) {
        errors.push(`${key.charAt(0).toUpperCase() + key.slice(1)} é obrigatório`);
      }
    });

    if (formData.preco && parseFloat(formData.preco) <= 0) {
      errors.push('Preço deve ser maior que zero');
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Reset states
      setLoading(true);
      setErro(null);
      setSucesso(false);

      // Validate form
      const errors = validateForm();
      if (errors.length > 0) {
        setErro(errors.join(', '));
        return;
      }

      // Prepare data
      const produtoData = {
        ...formData,
        preco: parseFloat(formData.preco)
      };

      // Make request
      const response = await fetch('/api/produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(produtoData),
      });

      // Handle response
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Success
      setSucesso(true);
      setFormData({
        marca: '',
        nome: '',
        descricao: '',
        preco: ''
      });

    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao cadastrar produto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Cadastro de Produto
        </h1>

        {erro && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {erro}
          </div>
        )}
        
        {sucesso && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md">
            Produto cadastrado com sucesso!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {['marca', 'nome', 'descricao'].map((field) => (
            <div key={field} className="space-y-2">
              <label 
                htmlFor={field}
                className="block text-sm font-medium text-gray-700 capitalize"
              >
                {field}
              </label>
              <input
                id={field}
                name={field}
                type="text"
                value={formData[field as keyof typeof formData]}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Digite ${field === 'descricao' ? 'a' : 'o'} ${field} do produto`}
              />
            </div>
          ))}

          <div className="space-y-2">
            <label htmlFor="preco" className="block text-sm font-medium text-gray-700">
              Preço
            </label>
            <input
              id="preco"
              name="preco"
              type="text"
              value={formData.preco}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors
              ${loading 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              }`}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar Produto'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CadastroProdutoPage;