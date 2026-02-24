import dotenv from 'dotenv';
dotenv.config();
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../../app.js'
import User from '../../models/User.js';
import Project from '../../models/Project.js';


let tokenA;
let tokenB;
let projectId;


beforeAll(async()=>{
    await mongoose.connect(process.env.MONGO_URI_TEST);
})

afterAll(async () => {
  await User.deleteMany({});
  await Project.deleteMany({});
  await mongoose.connection.close();
});


beforeEach(async () => {
  await User.deleteMany({});
  await Project.deleteMany({});

  const a = await request(app)
    .post('/api/auth/register')
    .send({ email: 'a@test.com', password: 'password123' });
  tokenA = a.body.token;

  const b = await request(app)
    .post('/api/auth/register')
    .send({ email: 'b@test.com', password: 'password123' });
  tokenB = b.body.token;

  const p = await request(app)
    .post('/api/projects')
    .set('Authorization', `Bearer ${tokenA}`)
    .send({ name: 'My Project' });
  projectId = p.body.project._id;
});

describe('POST /api/projects', () => {
  it('creates project and returns apiKey', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ name: 'New App' });
    expect(res.status).toBe(201);
    expect(res.body.project).toHaveProperty('apiKey');
  });
  it('returns 400 when name is missing', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Project Name is required.');
  });
  it('returns 401 when no token', async () => {
    const res = await request(app)
      .post('/api/projects')
      .send({ name: 'No Auth' });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/projects', () => {
  it('returns only your own projects', async () => {
    await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ name: 'User B App' });
    const res = await request(app)
      .get('/api/projects')
      .set('Authorization', `Bearer ${tokenA}`);
    expect(res.status).toBe(200);
    expect(res.body.projects.length).toBe(1);
    expect(res.body.projects[0].name).toBe('My Project');
  });
});

describe('GET /api/projects/:id', () => {
  it('returns project when owner requests it', async () => {
    const res = await request(app)
      .get(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${tokenA}`);
    expect(res.status).toBe(200);
    expect(res.body.project).toHaveProperty('apiKey');
  });
  it('returns 404 when wrong user tries to access it', async () => {
    const res = await request(app)
      .get(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${tokenB}`);
    expect(res.status).toBe(404);
  });
  it('returns 404 when ID format is invalid', async () => {
    const res = await request(app)
      .get('/api/projects/not-a-valid-id')
      .set('Authorization', `Bearer ${tokenA}`);
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/projects/:id', () => {
  it('deletes project when owner requests it', async () => {
    const res = await request(app)
      .delete(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${tokenA}`);
    expect(res.status).toBe(200);
    const check = await Project.findById(projectId);
    expect(check).toBeNull();
  });
  it('returns 404 and does NOT delete when wrong user tries it', async () => {
    const res = await request(app)
      .delete(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${tokenB}`);
    expect(res.status).toBe(404);
    const check = await Project.findById(projectId);
    expect(check).not.toBeNull();
  });
});