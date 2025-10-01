import express from 'express';
import { ReserveController } from '../controllers/reservationController';

const router = express.Router();

let reserveController: ReserveController;

ReserveController.initialize()
    .then(controller => {
        reserveController = controller;
        console.log("ReserveController initialized successfully");
    })
    .catch(error => {
        console.error('Failed to initialize ReserveController:', error);
    });

router.get('/', (req, res) => {
    if(!reserveController) {
        res.status(503).json({ message: 'Service unavailable' });
        return;
    }
    reserveController.getReservations(req, res);
});

router.get('/:id', (req, res) => {
    if (!reserveController) {
        res.status(503).json({ message: 'Service unavailable' });
        return;
    }
    reserveController.getReservation(req, res);
});

router.put('/:id', (req, res) => {
    if (!reserveController) {
        res.status(503).json({ message: 'Service unavailable' });
        return;
    }
    reserveController.updateReservation(req, res);
});

router.delete('/:id', (req, res) => {
    if (!reserveController) {
        res.status(503).json({ message: 'Service unavailable' });
        return;
    }
    reserveController.deleteReservation(req, res);
});

export default router;