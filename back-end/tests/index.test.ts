import app from '../src/app.js';
import supertest from 'supertest';
import { faker } from '@faker-js/faker';
import { prisma } from '../src/database.js';
import recommendationFatory from './factories/recommendationFactory.js';
import { Recommendation } from '@prisma/client';

beforeAll(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
});

describe('post recommendations tests', () => {
  it('should post a new recommendation given a valid body', async () => {
    const body = {
      name: 'gilberto gil',
      youtubeLink: 'https://www.youtube.com/watch?v=RJlMtEROMN4',
    };

    const result = await supertest(app).post('/recommendations').send(body);

    expect(result.status).toEqual(201);
  });

  it('should return 422 given an invalid body', async () => {
    const body = {
      name: faker.name.findName(),
      youtubeLink: faker.internet.url(),
    };

    const result = await supertest(app).post('/recommendations').send(body);

    expect(result.status).toEqual(422);
  });

  it('should return all posted recommendations', async () => {
    const result = await supertest(app).get('/recommendations');

    expect(result.status).toEqual(200);
    expect(result.body.length).not.toBe(null);
  });
});

describe('test recommendations votes', () => {
  it('should increment one vote point of a recommendation', async () => {
    const recommendation = await recommendationFatory.getRecommendation();

    const { status } = await supertest(app).post(
      `/recommendations/${recommendation.id}/upvote`
    );

    const postUpvoteRecommendation =
      await recommendationFatory.getRecommendationById(recommendation.id);

    expect(status).toEqual(200);
    expect(postUpvoteRecommendation.score).toBeGreaterThan(
      recommendation.score
    );
  });

  it('should return status code 404 given invalid id', async () => {
    const id: number = 9999999;

    const result = await supertest(app).post(`/recommendations/${id}/upvote`);

    expect(result.status).toBe(404);
  });

  it('should decrease one vote point of a recommendation', async () => {
    const recommendation = await recommendationFatory.getRecommendation();

    const result = await supertest(app).post(
      `/recommendations/${recommendation.id}/downvote`
    );

    const postDownvoteRecommendation =
      await recommendationFatory.getRecommendationById(recommendation.id);

    expect(result.status).toEqual(200);
    expect(postDownvoteRecommendation.score).toBeLessThan(recommendation.score);
  });

  it('should return status code 404 given invalid id', async () => {
    const id: number = 999999999999;

    const result = await supertest(app).post(`/recommendations/${id}/downvote`);

    expect(result.status).toEqual(404);
  });
});

describe('test get recommendations', () => {
  it('should get the last 10 recommendations', async () => {
    const recommendationNumber: number = 10;
    await recommendationFatory.generateRecommendations(recommendationNumber);

    const result = await supertest(app).get('/recommendations');

    expect(result.status).toEqual(200);
    expect(result.body.length).toBeGreaterThanOrEqual(10);
  });

  it('should return one recommendation given valid id', async () => {
    const recommendation = await recommendationFatory.getRecommendation();

    const result = await supertest(app).get(
      `/recommendations/${recommendation.id}`
    );
    expect(result.status).toEqual(200);
    expect(result.body).toEqual(recommendation);
  });

  it('should return empty body given invalid id', async () => {
    const id = 7897899999999999999;
    const result = await supertest(app).get(`/recommendations/${id}`);

    expect(result.body).toEqual({});
  });

  it('should return one random recommendation', async () => {
    const result = await supertest(app).get('/recommendations/random');

    expect(result.status).toEqual(200);
    expect(result.body).not.toBe(null);
  });

  it('should return a list of most voted song recommendations', async () => {
    const recommendationsAmount: number = 5;
    const result = await supertest(app).get(
      `/recommendations/top/${recommendationsAmount}`
    );
    let firstIsMostVoted = true;

    result.body.map((el: Recommendation, index: number) => {
      if (el.score < result.body[index + 1]) return (firstIsMostVoted = false);
    });

    expect(firstIsMostVoted).toBe(true);
  });

  it('should return status code 404 when there is no recommendation saved', async () => {
    await recommendationFatory.eraseRecommendations();

    const result = await supertest(app).get('/recommendations/random');

    expect(result.status).toEqual(404);
  });
});
