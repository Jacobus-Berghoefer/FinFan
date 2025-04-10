import { initModels } from '../models/index.js';

export const adjustUserBalance = async (userId: number, amount: number, models: ReturnType<typeof initModels>) => {
    await models.User.increment('balance', { by: amount, where: { id: userId } });
  };