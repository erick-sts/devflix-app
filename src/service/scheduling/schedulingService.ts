// ============================================================
// SERVIÇO DE AGENDAMENTOS
// ============================================================
// Este arquivo gerencia todas as requisições à API de agendamentos
// Inclui operações CRUD: criar, listar, buscar, atualizar e deletar

import api from "../axiosInterceptor";
// ============================================================
// INTERFACE: Estrutura de dados do agendamento
// ============================================================
// Define como os dados do agendamento são organizados
export interface Scheduling {
  id?: number;
  title: string;
  description?: string;
  startDateTime: Date | string;
  endDateTime: Date | string;
  userId: number;
}

// ============================================================
// DTO: Dados para criar um agendamento
// ============================================================
// DTO = Data Transfer Object (objeto para transferir dados)
export interface CreateSchedulingDto {
  title: string;
  description?: string;
  startDateTime: Date | string;
  endDateTime: Date | string;
  userId: number;
}

// ============================================================
// DTO: Dados para atualizar um agendamento
// ============================================================
// Mesma estrutura do Create, mas todos os campos são opcionais
export interface UpdateSchedulingDto {
  title?: string;
  description?: string;
  startDateTime?: Date | string;
  endDateTime?: Date | string;
}

// ============================================================
// FUNÇÃO: Criar novo agendamento
// ============================================================
// Envia uma requisição POST para criar um novo evento
export const createScheduling = async (
  data: CreateSchedulingDto
): Promise<Scheduling> => {
  const response = await api.post("/schedulings", data);
  return response.data;
};

// ============================================================
// FUNÇÃO: Buscar todos os agendamentos
// ============================================================
// Envia uma requisição GET para listar todos os eventos do usuário
export const getAllSchedulings = async (): Promise<Scheduling[]> => {
  const response = await api.get("/schedulings");
  return response.data;
};

// ============================================================
// FUNÇÃO: Buscar um agendamento específico
// ============================================================
// Envia uma requisição GET para buscar um evento por ID
export const getSchedulingById = async (id: number): Promise<Scheduling> => {
  const response = await api.get(`/schedulings/${id}`);
  return response.data;
};

// ============================================================
// FUNÇÃO: Atualizar um agendamento
// ============================================================
// Envia uma requisição PATCH para atualizar dados de um evento
export const updateScheduling = async (
  id: number,
  data: UpdateSchedulingDto
): Promise<Scheduling> => {
  const response = await api.patch(`/schedulings/${id}`, data);
  return response.data;
};

// ============================================================
// FUNÇÃO: Deletar um agendamento
// ============================================================
// Envia uma requisição DELETE para remover um evento
export const deleteScheduling = async (id: number): Promise<void> => {
  await api.delete(`/schedulings/${id}`);
};
