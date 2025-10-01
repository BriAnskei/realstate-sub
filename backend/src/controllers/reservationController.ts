import { Request, Response } from "express";
import { ReserveRepo } from "../repo/reservationRepo";
import { ReserveType } from "../model/reserveModel";
import { initDB } from "../db";

export class ReserveController {
    private static instance: ReserveController;
    private reserveRepo: ReserveRepo;

    private constructor(reserveRepo: ReserveRepo) {
        this.reserveRepo = reserveRepo;
    }

    public static getInstance(reserveRepo: ReserveRepo): ReserveController {
        if(!ReserveController.instance) {
            ReserveController.instance = new ReserveController(reserveRepo);
        }
        return ReserveController.instance;
    }

    public static async initialize(): Promise<ReserveController> {
        try {
            const db = await initDB();
            const reserveRepo = ReserveRepo.getInstance(db);
            console.log('ReserveRepo initialized successfully');
            return ReserveController.getInstance(reserveRepo);
        } catch (error) {
            console.error('Failed to initialize ReserveRepo: ', error);
            throw error;
        }
    }

    //create
    async createReservation(req: Request, res: Response): Promise<void> {
        try {
            const { applicationId, clientName, status, notes } = req.body;
            if(!applicationId || !clientName || !status) {
                res.status(400).json({
                    message: "Missing required fields: applicationId, clientname, and status are required"
                });
                return;
            }

            const newReservation: ReserveType = {
                applicationId,
                clientName,
                status, 
                notes
            };

            const createdReservation = await this.reserveRepo.create(newReservation);
            res.status(201).json(createdReservation);
        } catch (err: any) {
            res.status(500).json({ messgae: err.message });
        }
    }

    //read all
    async getReservations(req: Request, res: Response): Promise<void> {
        try {
            const { status } = req.query;
            const reservations = await this.reserveRepo.findAll(status as string);
            res.json(reservations);
        } catch (err: any) {
            res.status(500).json({ message: err.message});
        }
    }

    //read one
    async getReservation(req: Request, res: Response): Promise<void> {
        try {
            const reservation = await this.reserveRepo.findById(Number(req.params.id));
            if(!reservation) {
                res.status(404).json({ message: "Reservation not found" });
                return;
            }
            res.json(reservation);
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }

    //update
    async updateReservation(req: Request, res: Response): Promise<void> {
        try {
            const updated = await this.reserveRepo.update(Number(req.params.id), req.body);
            if(!updated) {
                res.status(404).json({ message: "Reservation not found" });
                return;
            }
            res.json(updated);
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }

    //delete
    async deleteReservation(req: Request, res: Response): Promise<void> {
        try {
            const deleted = await this.reserveRepo.delete(Number(req.params.id));
            if (!deleted) {
                res.status(404).json({ message: "Reservation not found" });
                return;
            }
            res.json({ message: "Reservation deleted" });
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }
}