// app/api/produtos/route.ts

import { NextResponse } from 'next/server';



export async function POST(request: Request) {
  try {
    // Pegar os dados do body
    const produto = await request.json();

    
    return NextResponse.json({ 
      message: 'Produto cadastrado com sucesso',
      data: produto 
    }, { status: 201 });

  } catch (error) {
    console.error('Erro ao cadastrar produto:', error);
    return NextResponse.json(
      { error: 'Erro ao cadastrar produto' },
      { status: 500 }
    );
  }
}