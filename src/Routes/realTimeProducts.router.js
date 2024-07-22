import { Router } from 'express';
import path from 'path';

const router = Router();

// Renderizar la página de productos en tiempo real
router.get('/', (req, res) => {
    res.render('realTimeProducts');
});

export default router;