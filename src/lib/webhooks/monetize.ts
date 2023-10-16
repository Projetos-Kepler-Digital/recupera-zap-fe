import type { Data } from '.';

export const monetize = (body: any): Data => {
  return {
    type: 'recover',
    event: 'Carrinho abandonado',
    revenue: 10.95,
    lead: {
      phone: '5561995222034',
      name: 'Lead',
      email: 'lead@gmail.com',
      cpf: '054.079.841-05',
      pixCode: null,
      boletoUrl: null,
      checkout: null,
    },
  };
};
