import { useState } from 'react';
import { Service } from '../services/Service';
import { TauriService } from '../services/TauriService';

export const useTauriService = (): Service => {
  const [service] = useState<Service>(new TauriService());

  return service;
};
