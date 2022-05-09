import { prisma } from '../../src/database.js';
import { jest } from '@jest/globals';
import { recommendationService } from '../../src/services/recommendationsService.js';
import { recommendationRepository } from '../../src/repositories/recommendationRepository.js';
import faker from '@faker-js/faker';
import recommendationFatory from '../factories/recommendationFactory.js';

describe('service unit tests', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should remove recommendation when score is lower than -5', async () => {
    const recommendation =
      await recommendationFatory.generateBadRecommendation();

    jest
      .spyOn(recommendationRepository, 'find')
      .mockResolvedValue(recommendation);
    jest.spyOn(recommendationRepository, 'updateScore').mockResolvedValue(null);
    const remove = jest
      .spyOn(recommendationRepository, 'remove')
      .mockResolvedValue(null);

    await recommendationService.downvote(recommendation.id);

    expect(remove).toHaveBeenCalledTimes(1);
  });

  it('should return error if no recommendation is found', async () => {
    const recommendation = null;

    jest
      .spyOn(recommendationRepository, 'find')
      .mockResolvedValue(recommendation);
    jest.spyOn(recommendationRepository, 'updateScore').mockResolvedValue(null);
  });

  it('should get random recommendation', async () => {
    const recommendation = await recommendationFatory.getRecommendation();
    jest
      .spyOn(recommendationRepository, 'findAll')
      .mockResolvedValue([recommendation]);

    const result = await recommendationService.getByScore('gt');

    expect(result).toEqual([recommendation]);
  });
});
