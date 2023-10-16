import type { Data } from '.';

import { updateDocument } from '@/database/functions/native-functions';

import { formatPhoneNumber } from '../formatPhoneNumber';

export enum TransactionStatus {
  OPENNED = 1, // Fatura aberta, cliente gerou boleto, mas ainda não foi compensado
  PAID = 3, // Compra foi paga, o cliente já esta apto a receber o produto
  CANCELED = 4, // Fatura Cancelada pela Eduzz
  WAITING_REFUND = 6, // Cliente solicitou reembolso, porem o mesmo ainda não foi efetuado
  REFUNDED = 7, // Cliente já foi reembolsado pela eduzz
  DUPLICATED = 9, // Cliente tentou comprar mais de uma vez o mesmo produto, a segunda fatura fica como duplicada e não é cobrada.
  EXPIRED = 10, // A fatura que fica mais de 15 dias aberta é alterada para expirada.
  IN_RECOVER = 11, // Fatura entrou para o processo de recuperação
  WAITING_PAYMENT = 15, // Faturas de recorrência após o vencimento ficam com o status aguardando pagamento
}

export enum RecurrenceStatus {
  UP_TO_DATE = 1, // Contrato com pagamento em dia.
  WAITING_PAYMENT = 2, // Esse status é acionado após o vencimento da fatura. Permanece por 3 dias.
  SUSPENDED = 3, // O contrato não gera novas cobranças. Pode ser reativado.
  CANCELED = 4, // O contrato do cliente foi cancelado.
  LATE = 7, // Contrato sem pagamento há mais de 3 dias após o vencimento.
  FINISHED = 9, // Todos os pagamentos foram realizados. Não gera novas cobranças.
  TRIAL = 10, // Contrato em período de trial.
}

export interface WeebhookResponse {
  api_key: string;
  pro_cod: string;
  pro_name: string;
  pro_email: string;
  pro_document_number: string;
  pro_value: number;
  trans_cod: number;
  trans_checkoutid: number;
  trans_value: number;
  trans_paid: number;
  trans_status: TransactionStatus;
  trans_paymentmethod: number;
  trans_createdate: string;
  trans_paiddate: string;
  trans_duedate: string;
  trans_createtime: string;
  trans_paidtime: string;
  trans_duetime: string;
  trans_items_quantity: number;
  trans_key: string;
  recurrence_cod: number;
  recurrence_type: string;
  recurrence_plan: string;
  product_cod: number;
  product_name: string;
  product_parent_cod: number;
  product_refund: number;
  product_sku: string;
  discount_coupon_code: string;
  cus_cod: number;
  cus_taxnumber: string;
  cus_name: string;
  cus_email: string;
  cus_tel: string;
  cus_tel2: string;
  cus_cel: string;
  cus_apikey: string;
  cus_address: string;
  refund_type: string;
  student_cod: number;
  student_taxnumber: string;
  student_name: string;
  student_email: string;
  student_tel: string;
  student_tel2: string;
  student_cel: string;
  cus_address_number: string;
  cus_address_country: string;
  cus_address_district: string;
  cus_address_comp: string;
  cus_address_city: string;
  cus_address_state: string;
  cus_address_zip_code: string;
  recurrence_startdate: string;
  recurrence_status: RecurrenceStatus;
  recurrence_status_name: string;
  recurrence_interval: number;
  recurrence_interval_type: string;
  recurrence_count: number;
  recurrence_first_payment: number;
  aff_cod: string;
  aff_name: string;
  aff_email: string;
  aff_document_number: number;
  aff_value: number;
  tracker_trk: string;
  tracker_trk2: string;
  tracker_trk3: string;
  tracker_utm_source: string;
  tracker_utm_content: string;
  tracker_utm_medium: string;
  tracker_utm_campaign: string;
  utm_source: string;
  utm_content: string;
  utm_medium: string;
  utm_campaign: string;
  sku_reference: string;
  eduzz_value: number;
  other_values: number;
  trans_items: [
    {
      item_id: number;
      item_name: string;
      item_value: number;
      item_coupon_code: string;
      item_coupon_value: string;
      item_product_id: string;
      item_product_name: string;
      item_product_refund: string;
      item_product_sku_reference: string;
      item_product_partner_cod: string;
      item_product_chargetype: string;
    }
  ];
  trans_barcode: string;
  trans_orderid: string;
  trans_currency: string;
  trans_job_id: string;
  trans_job_status: string;
  request_token: string;
  billet_url: string;
  page_checkout_url: string;
  type: string;
  trans_bankslip: string;
  recurrence_canceled_at: string;
  product_chargetype: string;
  refund_date: string;
}

const events = {
  'Pagamento aprovado': [TransactionStatus.PAID],
  'Aguardando pagamento': [TransactionStatus.WAITING_PAYMENT],
  'Carrinho abandonado': [TransactionStatus.OPENNED],
  Reembolso: [TransactionStatus.REFUNDED, TransactionStatus.IN_RECOVER],
};

function findEvent(option: TransactionStatus): string | null {
  for (const event in events) {
    if (events[event as keyof typeof events].includes(option)) {
      return event;
    }
  }

  return null;
}

export const eduzz = async (body: WeebhookResponse): Promise<Data> => {
  try {
    const email = body.cus_email;
    const name = body.cus_name;
    const phone = formatPhoneNumber(body.cus_tel);
    const transStatus = Number(body.trans_status);
    const recurrenceStatus = Number(body.recurrence_status);
    const revenue = Number(body.trans_value);
    const checkout = body.page_checkout_url;

    const event = findEvent(transStatus);

    if (!event) {
      return {} as Data;
    }

    if (transStatus === TransactionStatus.PAID) {
      return {
        type: 'buy',
        event,
        revenue,
        lead: {
          phone,
          name,
          email,
          cpf: null,
          pixCode: null,
          boletoUrl: null,
          checkout,
        },
      };
    }

    return {
      type: 'recover',
      event,
      revenue,
      lead: {
        phone,
        name,
        email,
        cpf: null,
        pixCode: null,
        boletoUrl: null,
        checkout,
      },
    };
  } catch (err) {
    await updateDocument('logs', 'webhook-received', {
      status: 'error',
      error: err,
    });

    return {} as Data;
  }
};
