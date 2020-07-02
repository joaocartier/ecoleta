import knex from "../database/connection";
import { Request, Response } from "express";

class ItemsController {
  async index(req: Request, res: Response) {
    const items = await knex("items").select("*");

    const serializedItems: Array<ISerializedItem> = items.map((item: IItem) => {
      return {
        name: item.title,
        image_url: `http://localhost:3333/uploads/${item.image}`,
      };
    });

    res.json(serializedItems);
  }
}

export default ItemsController;
