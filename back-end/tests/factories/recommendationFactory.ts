import faker from '@faker-js/faker';
import { prisma } from '../../src/database';

async function getRecommendation() {
  return await prisma.recommendation.findFirst({});
}

async function getRecommendationById(id: number) {
  return await prisma.recommendation.findUnique({ where: { id } });
}

async function generateRecommendations(qty: number) {
  let i = 1;
  while (i <= qty) {
    const recommendation = {
      name: faker.name.findName(),
      youtubeLink: 'https://www.youtube.com/watch?v=wMBrcn0ZllM',
    };

    await prisma.recommendation.create({ data: { ...recommendation } });
    i++;
  }
}

async function generateBadRecommendation() {
  return await prisma.recommendation.create({
    data: {
      name: faker.name.findName(),
      youtubeLink: faker.internet.url(),
      score: -6,
    },
    select: { id: true, name: true, youtubeLink: true, score: true },
  });
}

async function eraseRecommendations() {
  return await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
}

const recommendationFatory = {
  getRecommendation,
  getRecommendationById,
  generateRecommendations,
  generateBadRecommendation,
  eraseRecommendations,
};

export default recommendationFatory;
