import express from 'express';
import { sendConnectionRequest, acceptConnection, disconnectPartner, getConnectionStatus, togglePlannerShare, searchUsernames } from '../controllers/connectionController.js';
import { getConnectedCoupleId } from '../controllers/plannerController.js'; // Adicione esta linha
import { autenticarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/request', autenticarToken, sendConnectionRequest);
router.post('/accept', autenticarToken, acceptConnection);
router.delete('/disconnect', autenticarToken, disconnectPartner);
router.get('/status', autenticarToken, getConnectionStatus);
router.put('/share-planner', autenticarToken, togglePlannerShare);
router.get('/search', autenticarToken, searchUsernames);
router.get('/connected-couple', autenticarToken, getConnectedCoupleId);

export default router;
