import { Application, Request, Response } from "express";
import { ReserveRepo } from "../repo/reservationRepo";
import { ReserveType } from "../model/reserationModel";
import { ApplicationType } from "../model/applicationModel";

export class ReservationController {
  constructor(private reservationRepo: ReserveRepo) {
    this.create = this.create.bind(this);
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.rejectReservation = this.rejectReservation.bind(this);
    this.getFiltered = this.getFiltered.bind(this);
  }

  /**
   * @description so this controller, will be use for manual adding resevation.
   * @param res payload: {applicaiton, reservation}
   * @returns application, reservation w/ created and _id
   */
  async create(req: Request, res: Response): Promise<void> {
    const reservation: ReserveType = req.body.reservation;
    const application: ApplicationType = req.body.application;

    const response = await this.reservationRepo.create({
      application,
      reservation,
    });

    res.json({ ...response });
  }

  async rejectReservation(req: Request, res: Response): Promise<void> {
    const reservation = req.body.reservation as ReserveType;
    const { status, notes } = req.body;

    const response = await this.reservationRepo.rejectReservation({
      reservation,
      status,
      notes,
    });

    res.json({ ...response });
  }

  async getFiltered(req: Request, res: Response): Promise<void> {
    const status = req.query.status as string;
    const query = req.query.searchQuery as string;

    const response = await this.reservationRepo.filterReservation({
      status,
      query,
    });

    res.json({ reservation: response });
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.json({ error: "Invalid reservation ID" });
        return;
      }

      const reservation = await this.reservationRepo.findById(id);

      if (!reservation) {
        res.json({ error: "Reservation not found" });
        return;
      }

      res.json(reservation);
    } catch (error) {
      console.error("Error fetching reservation:", error);
      res.json({ error: "Internal server error" });
    }
  }

  async getAll(_: Request, res: Response): Promise<void> {
    try {
      const reservations = await this.reservationRepo.findAll();

      res.json({ reservations });
    } catch (error) {
      console.error("Error fetching reservations:", error);
      res.json({ error: "Internal server error" });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.json({ error: "Invalid reservation ID" });
        return;
      }

      const updates: Partial<Omit<ReserveType, "id" | "createdAt">> = req.body;

      const updatedReservation = await this.reservationRepo.update(id, updates);

      if (!updatedReservation) {
        res.json({ error: "Reservation not found" });
        return;
      }

      res.json(updatedReservation);
    } catch (error) {
      console.error("Error updating reservation:", error);
      res.json({ error: "Internal server error" });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.json({ error: "Invalid reservation ID" });
        return;
      }

      const deleted = await this.reservationRepo.delete(id);

      if (!deleted) {
        res.json({ error: "Reservation not found" });
        return;
      }

      res.json({ message: "Reservation deleted successfully" });
    } catch (error) {
      console.error("Error deleting reservation:", error);
      res.json({ error: "Internal server error" });
    }
  }
}
