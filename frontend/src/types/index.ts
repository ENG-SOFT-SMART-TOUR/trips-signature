export interface Usuario {
  id: number;
  nome: string;
  email: string;
  quizCompleto: boolean;
}

export interface Opcao {
  label: string;
  tag: string;
}

export interface Pergunta {
  id: number;
  texto: string;
  opcoes: Opcao[];
}

export interface Destino {
  id: number;
  nome: string;
  descricao: string;
  foto: string;
  pais: string;
  categoria: string;
  tags: string[];
  matchPercentual?: number;
}

export interface Roteiro {
  id: number;
  destino: Destino;
  dataIda: string;
  dataVolta: string;
  totalDias: number;
  criadoEm: string;
}

export interface Atividade {
  id: number;
  nome: string;
  categoria: string;
  duracao: string;
  turno: string;
  descricao: string;
  foto: string;
  latitude?: number;
  longitude?: number;
}

export interface RoteiroAtividadeResponse {
  atividadeId: number;
  diaNumero: number;
}

export type Turno = 'morning' | 'afternoon' | 'evening';

export const TURNOS: { value: Turno; label: string }[] = [
  { value: 'morning', label: 'Manhã' },
  { value: 'afternoon', label: 'Tarde' },
  { value: 'evening', label: 'Noite' },
];
