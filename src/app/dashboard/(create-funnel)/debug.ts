'use server';

export async function DEBUG(log?: any): Promise<void> {
  return console.log(log);
}
