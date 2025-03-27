import items from "../dataJSON/items.json";
import {Item} from "@/types/interfaces";

// Function that returns an item by id
export function getItemObject(itemId: number): Item | undefined {
    return items.find((item: Item) => item.id === itemId);
}