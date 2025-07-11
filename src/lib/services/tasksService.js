import { taskOperations } from './tasks/tasksOperations';
import { taskUtils } from './tasks/tasksUtils';

export const tasksService = {
  ...taskOperations,
  ...taskUtils
};