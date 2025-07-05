import express from 'express';
import { testMonthlyReport } from '../controllers/reminder.controller.js';

const router = express.Router();

router.get('/test-report', testMonthlyReport);

export default router;
