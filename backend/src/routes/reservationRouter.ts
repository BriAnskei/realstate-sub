import express from "express";
import { Database } from "sqlite";
import { ReserveRepo } from "../repo/reservationRepo";
import { ReservationController } from "../controllers/reservationController";
import { asyncHandler } from "../utils/asyncHandler";

export function createReservationRouter(db: Database) {
  const reservationRouter = express.Router();
  const reserveRepo = new ReserveRepo(db);
  const reservationController = new ReservationController(reserveRepo);

  reservationRouter.post(
    "/add",
    asyncHandler(reservationController.create, "create")
  );

  reservationRouter.get(
    "/get/all",
    asyncHandler(reservationController.getAll, "getAll")
  );

  reservationRouter.post(
    "/reject",
    asyncHandler(reservationController.rejectReservation, "rejectReservation")
  );

  reservationRouter.get(
    "/get/filter",
    asyncHandler(reservationController.getFiltered, "getFiltered")
  );

  reservationRouter.get(
    "/get/:id",
    asyncHandler(reservationController.getById, "getById")
  );

  reservationRouter.post(
    "/update/:id",
    asyncHandler(reservationController.update, "update")
  );

  reservationRouter.post(
    "/delete/:id",
    asyncHandler(reservationController.delete, "delete")
  );

  return reservationRouter;
}
