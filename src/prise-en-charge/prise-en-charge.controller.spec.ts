import { PriseEnChargeController } from './prise-en-charge.controller';
import { PriseEnChargeService } from './prise-en-charge.service';

describe('PriseEnChargeController', () => {
  const findAll = jest.fn().mockResolvedValue([]);
  const controller = new PriseEnChargeController({ findAll } as unknown as PriseEnChargeService);

  beforeEach(() => findAll.mockClear());

  it('transmet le CHU demandé : chaque SIH ne voit que ses entreprises', async () => {
    await controller.findAll('chu-A');
    expect(findAll).toHaveBeenCalledWith('chu-A');
  });

  it('sans CHU, liste tout (administration multi-CHU)', async () => {
    await controller.findAll();
    expect(findAll).toHaveBeenCalledWith(undefined);
  });
});
