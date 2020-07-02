import { Request, Response } from "express";
import knex from "../database/connection";

class PointsController {
  async create(req: Request, res: Response) {
    const point: IPoint = req.body;

    point.image =
      "https://images.unsplash.com/photo-1556767576-5ec41e3239ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60";

    const trx = await knex.transaction();

    const { items, ...insertedPoint } = point;

    const insertedIds = await trx("points").insert(insertedPoint);

    const point_id = insertedIds[0];

    const pointItems = point.items.map((item_id: number) => {
      return { item_id, point_id };
    });

    await trx("point_items").insert(pointItems);

    await trx.commit();

    point.id = point_id;

    return res.json(point);
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;
    const point: IPoint = await knex("points").where("id", id).first();

    if (!point) {
      return res.status(400).json({ message: "Point not found." });
    }

    const items = await knex("items")
      .join("point_items", "items.id", "=", "point_items.item_id")
      .where("point_items.point_id", id);

    return res.json({ point, items });
  }

  async index(req: Request, res: Response) {
    const { city, uf, items } = req.query;

    const parsedItems = String(items)
      .split(",")
      .map((item) => Number(item.trim()));

    const points: Array<IPoint> = await knex("points")
      .join("point_items", "points_id", "=", "point_items.point_id")
      .whereIn("point_items.item_id", parsedItems)
      .where("city", String(city))
      .where("uf", String(uf))
      .distinct()
      .select("points.*");

    return res.json(points);
  }
}

export default PointsController;
